# NextGenRail Makefile
# Convenient commands for development and deployment

.PHONY: help dev build test clean deploy stop logs shell

# Default target
help: ## Show this help message
	@echo "NextGenRail - Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8080"
	@echo "MongoDB UI: http://localhost:8081"

dev-logs: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

dev-stop: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

dev-clean: ## Stop and remove development containers and volumes
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker volume prune -f

# Production commands
build: ## Build production images
	docker-compose build
	@echo "Production images built successfully!"

prod: ## Start production environment
	docker-compose up -d
	@echo "Production environment started!"
	@echo "Application: http://localhost"

prod-logs: ## View production logs
	docker-compose logs -f

prod-stop: ## Stop production environment
	docker-compose down

prod-deploy: ## Deploy to production with monitoring
	docker-compose -f infra/docker/docker-compose.prod.yml --profile monitoring up -d
	@echo "Production environment with monitoring deployed!"

# Testing commands
test: ## Run all tests
	@echo "Running frontend tests..."
	cd apps/web && npm test
	@echo "Running backend tests..."
	cd apps/api && ./mvnw test

test-api: ## Run API tests only
	cd apps/api && ./mvnw test

test-web: ## Run frontend tests only
	cd apps/web && npm test

# Database commands
db-seed: ## Seed database with sample data
	@echo "Seeding database..."
	docker-compose exec mongodb mongosh nextgenrail /docker-entrypoint-initdb.d/01-init-db.js

db-backup: ## Backup production database
	@echo "Creating database backup..."
	docker-compose exec mongodb mongodump --db nextgenrail --out /tmp/backup
	docker cp $$(docker-compose ps -q mongodb):/tmp/backup ./backup-$$(date +%Y%m%d-%H%M%S)

db-restore: ## Restore database from backup (requires BACKUP_PATH)
	@if [ -z "$(BACKUP_PATH)" ]; then echo "Usage: make db-restore BACKUP_PATH=./backup-folder"; exit 1; fi
	docker cp $(BACKUP_PATH) $$(docker-compose ps -q mongodb):/tmp/restore
	docker-compose exec mongodb mongorestore --db nextgenrail /tmp/restore/nextgenrail

# Utility commands
logs: ## View all service logs
	docker-compose logs -f

shell-api: ## Shell into API container
	docker-compose exec nextgenrail-api /bin/bash

shell-web: ## Shell into Web container
	docker-compose exec nextgenrail-web /bin/sh

shell-db: ## Shell into MongoDB container
	docker-compose exec mongodb mongosh nextgenrail

clean: ## Clean up containers, images, and volumes
	docker-compose down -v --remove-orphans
	docker system prune -f
	docker volume prune -f

install: ## Install dependencies for both frontend and backend
	@echo "Installing frontend dependencies..."
	cd apps/web && npm install
	@echo "Installing backend dependencies..."
	cd apps/api && ./mvnw dependency:resolve

lint: ## Run linters
	@echo "Linting frontend..."
	cd apps/web && npm run lint
	@echo "Linting backend..."
	cd apps/api && ./mvnw spotless:check

fix: ## Fix linting issues
	@echo "Fixing frontend issues..."
	cd apps/web && npm run lint:fix
	@echo "Fixing backend issues..."
	cd apps/api && ./mvnw spotless:apply

# Security commands
security-scan: ## Run security scans
	@echo "Scanning for security vulnerabilities..."
	cd apps/web && npm audit
	cd apps/api && ./mvnw org.owasp:dependency-check-maven:check

# Render deployment
render-deploy: ## Deploy to Render (requires Render CLI)
	@echo "Deploying to Render..."
	render deploy --service-id $(RENDER_SERVICE_ID)

# Status check
status: ## Check service status
	docker-compose ps
	@echo "\nHealthcheck status:"
	@docker-compose exec nextgenrail-api curl -f http://localhost:8080/api/actuator/health 2>/dev/null && echo "✓ API healthy" || echo "✗ API unhealthy"
	@docker-compose exec nextgenrail-web curl -f http://localhost:80/health 2>/dev/null && echo "✓ Web healthy" || echo "✗ Web unhealthy"

# Quick start
quick-start: install build dev ## Quick start for new developers
	@echo "🚀 NextGenRail is now running!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:8080"
	@echo "🗄️  Database UI: http://localhost:8081"
	@echo "📖 API Docs: http://localhost:8080/swagger-ui.html"

# Environment setup
env-setup: ## Set up environment files from templates
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env file from template"; fi
	@if [ ! -f apps/web/.env.local ]; then cp apps/web/.env.example apps/web/.env.local && echo "Created web .env.local file"; fi
	@if [ ! -f apps/api/src/main/resources/application-dev.yml ]; then cp apps/api/src/main/resources/application-dev.yml.example apps/api/src/main/resources/application-dev.yml && echo "Created API dev config"; fi
	@echo "⚠️  Please update the environment files with your actual values!"