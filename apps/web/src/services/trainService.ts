import {
  Booking,
  BookingRequest,
  ClassAvailability,
  Station,
  TrainSearchRequest,
  TrainSearchResult
} from '@/types/train'
import { apiClient } from './api'

/**
 * Train service
 * Handles all train and booking related API calls
 */
export const trainService = {
  /**
   * Search trains between stations
   */
  async searchTrains(request: TrainSearchRequest): Promise<TrainSearchResult[]> {
    const params = new URLSearchParams({
      source: request.sourceStation,
      destination: request.destinationStation,
      date: request.travelDate
    })

    if (request.classType) {
      params.append('class', request.classType)
    }

    if (request.quota) {
      params.append('quota', request.quota)
    }

    return apiClient.get<TrainSearchResult[]>(`/trains/search?${params.toString()}`)
  },

  /**
   * Get seat availability for a specific train
   */
  async getAvailability(trainId: string, sourceStation: string, destinationStation: string,
    travelDate: string, classType: string): Promise<ClassAvailability[]> {
    const params = new URLSearchParams({
      trainId,
      source: sourceStation,
      destination: destinationStation,
      date: travelDate,
      class: classType
    })

    return apiClient.get<ClassAvailability[]>(`/trains/availability?${params.toString()}`)
  },

  /**
   * Get station suggestions for autocomplete
   */
  async getStations(query?: string): Promise<Station[]> {
    const params = query ? `?query=${encodeURIComponent(query)}` : ''
    return apiClient.get<Station[]>(`/trains/stations${params}`)
  },

  /**
   * Create a new booking
   */
  async createBooking(request: BookingRequest): Promise<Booking> {
    return apiClient.post<Booking>('/bookings/create', request)
  },

  /**
   * Get booking by PNR number
   */
  async getBookingByPnr(pnrNumber: string): Promise<Booking> {
    return apiClient.get<Booking>(`/bookings/pnr/${pnrNumber}`)
  },

  /**
   * Get user's bookings
   */
  async getUserBookings(): Promise<Booking[]> {
    return apiClient.get<Booking[]>('/bookings/my-bookings')
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    return apiClient.post<Booking>(`/bookings/${bookingId}/cancel`, { reason })
  },

  /**
   * Get booking status with real-time updates
   */
  async getBookingStatus(bookingId: string): Promise<Booking> {
    return apiClient.get<Booking>(`/bookings/${bookingId}/status`)
  },

  /**
   * Get fare details for a journey
   */
  async getFareDetails(trainId: string, sourceStation: string, destinationStation: string,
    classType: string, passengerCount: number): Promise<any> {
    const params = new URLSearchParams({
      trainId,
      source: sourceStation,
      destination: destinationStation,
      class: classType,
      passengers: passengerCount.toString()
    })

    return apiClient.get<any>(`/trains/fare?${params.toString()}`)
  },

  /**
   * Get train route details
   */
  async getTrainRoute(trainNumber: string): Promise<any> {
    return apiClient.get<any>(`/trains/${trainNumber}/route`)
  },

  /**
   * Check PNR status
   */
  async checkPnrStatus(pnrNumber: string): Promise<any> {
    return apiClient.get<any>(`/pnr/${pnrNumber}`)
  }
}