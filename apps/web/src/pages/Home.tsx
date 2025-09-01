import { Layout } from "@/components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowForward,
  DirectionsRailway,
  PhoneAndroid,
  Schedule,
  Search,
  Security,
  Speed,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: "Smart Search",
      description:
        "Find trains with intelligent search and real-time availability",
      action: () => navigate("/search"),
    },
    {
      icon: <DirectionsRailway sx={{ fontSize: 40 }} />,
      title: "Live Tracking",
      description:
        "Track your train status with real-time updates and notifications",
      action: () => navigate("/pnr-status"),
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Secure Booking",
      description: "Book with confidence using our secure payment gateway",
      action: () => (isAuthenticated ? navigate("/book") : navigate("/login")),
    },
  ];

  const stats = [
    { value: "50M+", label: "Happy Travelers" },
    { value: "12K+", label: "Train Routes" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  const benefits = [
    {
      icon: <Speed />,
      title: "Lightning Fast",
      description: "Quick bookings in under 2 minutes",
    },
    {
      icon: <PhoneAndroid />,
      title: "Mobile First",
      description: "Optimized for mobile devices",
    },
    {
      icon: <Schedule />,
      title: "Real-time Updates",
      description: "Live train status and notifications",
    },
    {
      icon: <Security />,
      title: "Bank-grade Security",
      description: "Your data is safe with us",
    },
  ];

  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: -200,
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${alpha(
              "#fff",
              0.1
            )} 0%, transparent 70%)`,
            borderRadius: "50%",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                {isAuthenticated && (
                  <Chip
                    label={`Welcome back, ${user?.firstName}!`}
                    sx={{
                      mb: 2,
                      bgcolor: alpha("#fff", 0.2),
                      color: "white",
                      "& .MuiChip-label": { fontWeight: 500 },
                    }}
                  />
                )}

                <Typography
                  variant="h2"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
                >
                  Next Generation Railway Booking
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
                >
                  Experience seamless train bookings with real-time updates,
                  smart search, and secure payments
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: { xs: "center", md: "flex-start" },
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/search")}
                    sx={{
                      background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                      color: "white",
                      py: 1.5,
                      px: 3,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      border: 0,
                      borderRadius: "25px",
                      boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 15px rgba(255, 105, 135, .4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Book Now
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/pnr-status")}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      py: 1.5,
                      px: 3,
                      fontSize: "1.1rem",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: alpha("#fff", 0.1),
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Check PNR
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center", position: "relative" }}>
                {/* Train illustration placeholder */}
                <Box
                  sx={{
                    fontSize: { xs: 150, md: 200 },
                    opacity: 0.8,
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  🚆
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Why Choose NextGenRail?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Modern features for a seamless travel experience
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[10],
                    },
                  }}
                  onClick={feature.action}
                >
                  <CardContent sx={{ flex: 1, textAlign: "center", p: 4 }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button endIcon={<ArrowForward />}>Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Built for Modern Travelers
          </Typography>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Ready to Travel?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join millions of satisfied customers and experience the future of
              train booking
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() =>
                isAuthenticated ? navigate("/search") : navigate("/login")
              }
              sx={{
                background: "linear-gradient(45deg, #4CAF50 30%, #45A049 90%)",
                color: "white",
                py: 1.5,
                px: 4,
                fontSize: "1.2rem",
                fontWeight: "bold",
                border: 0,
                borderRadius: "25px",
                boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #45A049 30%, #4CAF50 90%)",
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 15px rgba(76, 175, 80, .4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {isAuthenticated ? "Start Booking" : "Get Started"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Layout>
  );
}
