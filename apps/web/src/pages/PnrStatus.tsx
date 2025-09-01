import { Layout } from "@/components/Layout/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccessTime,
  CheckCircle,
  FindInPage,
  LocationOn,
  Person,
  Search,
  Train,
  Warning,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Mock PNR data structure
interface PNRData {
  pnr: string;
  trainNumber: string;
  trainName: string;
  trainType: string;
  journeyDate: string;
  from: {
    stationCode: string;
    stationName: string;
    departureTime: string;
  };
  to: {
    stationCode: string;
    stationName: string;
    arrivalTime: string;
  };
  classCode: string;
  className: string;
  bookingStatus: "CNF" | "WL" | "RAC" | "CAN" | "PQWL";
  currentStatus: "CNF" | "WL" | "RAC" | "CAN" | "PQWL";
  passengers: {
    name: string;
    age: number;
    gender: string;
    currentStatus: string;
    seatNumber?: string;
    coachPosition?: string;
  }[];
  chartStatus: "PREPARED" | "NOT_PREPARED";
  distance: string;
  duration: string;
}

// Mock PNR database
const mockPNRDatabase: { [key: string]: PNRData } = {
  "1234567890": {
    pnr: "1234567890",
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani Express",
    trainType: "RAJDHANI",
    journeyDate: "2025-09-15",
    from: {
      stationCode: "NDLS",
      stationName: "New Delhi",
      departureTime: "16:55",
    },
    to: {
      stationCode: "CSMT",
      stationName: "Mumbai CST",
      arrivalTime: "08:35",
    },
    classCode: "AC2A",
    className: "AC 2-Tier",
    bookingStatus: "CNF",
    currentStatus: "CNF",
    passengers: [
      {
        name: "John Doe",
        age: 32,
        gender: "Male",
        currentStatus: "CNF",
        seatNumber: "15",
        coachPosition: "A2",
      },
      {
        name: "Jane Doe",
        age: 28,
        gender: "Female",
        currentStatus: "CNF",
        seatNumber: "16",
        coachPosition: "A2",
      },
    ],
    chartStatus: "PREPARED",
    distance: "1384 km",
    duration: "15h 40m",
  },
  "9876543210": {
    pnr: "9876543210",
    trainNumber: "12261",
    trainName: "Howrah Duronto Express",
    trainType: "DURONTO",
    journeyDate: "2025-09-20",
    from: {
      stationCode: "NDLS",
      stationName: "New Delhi",
      departureTime: "14:20",
    },
    to: {
      stationCode: "HWH",
      stationName: "Howrah Junction",
      arrivalTime: "06:30",
    },
    classCode: "SL",
    className: "Sleeper",
    bookingStatus: "WL",
    currentStatus: "RAC",
    passengers: [
      {
        name: "Alice Smith",
        age: 25,
        gender: "Female",
        currentStatus: "RAC 2",
      },
    ],
    chartStatus: "NOT_PREPARED",
    distance: "1400 km",
    duration: "16h 10m",
  },
  "5555666677": {
    pnr: "5555666677",
    trainNumber: "12007",
    trainName: "Chennai Express",
    trainType: "EXPRESS",
    journeyDate: "2025-08-30",
    from: {
      stationCode: "NDLS",
      stationName: "New Delhi",
      departureTime: "13:30",
    },
    to: {
      stationCode: "MAS",
      stationName: "Chennai Central",
      arrivalTime: "20:15",
    },
    classCode: "AC3A",
    className: "AC 3-Tier",
    bookingStatus: "CNF",
    currentStatus: "CAN",
    passengers: [
      {
        name: "Bob Johnson",
        age: 45,
        gender: "Male",
        currentStatus: "CAN",
      },
    ],
    chartStatus: "PREPARED",
    distance: "362 km",
    duration: "6h 45m",
  },
};

const pnrSchema = z.object({
  pnr: z
    .string()
    .min(10, "PNR must be 10 digits")
    .max(10, "PNR must be 10 digits")
    .regex(/^\d{10}$/, "PNR must contain only numbers"),
});

type PNRFormData = z.infer<typeof pnrSchema>;

export function PnrStatus() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pnrData, setPnrData] = useState<PNRData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PNRFormData>({
    resolver: zodResolver(pnrSchema),
    defaultValues: {
      pnr: "",
    },
  });

  const onSubmit = async (data: PNRFormData) => {
    setIsLoading(true);
    setNotFound(false);
    setPnrData(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check mock database
      const foundPNR = mockPNRDatabase[data.pnr];
      if (foundPNR) {
        setPnrData(foundPNR);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("PNR search failed:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CNF":
        return "success";
      case "RAC":
        return "warning";
      case "WL":
      case "PQWL":
        return "info";
      case "CAN":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CNF":
        return "Confirmed";
      case "RAC":
        return "RAC (Reservation Against Cancellation)";
      case "WL":
        return "Waiting List";
      case "PQWL":
        return "Pooled Quota Waiting List";
      case "CAN":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CNF":
        return <CheckCircle />;
      case "RAC":
      case "WL":
      case "PQWL":
        return <AccessTime />;
      case "CAN":
        return <Warning />;
      default:
        return <FindInPage />;
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          <FindInPage sx={{ mr: 1, verticalAlign: "middle" }} />
          Check PNR Status
        </Typography>

        {/* PNR Search Form */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Enter your 10-digit PNR number
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Try these sample PNRs: 1234567890 (Confirmed), 9876543210 (RAC), 5555666677 (Cancelled)
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Controller
                  name="pnr"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="PNR Number"
                      fullWidth
                      placeholder="Enter 10-digit PNR number"
                      error={!!errors.pnr}
                      helperText={errors.pnr?.message}
                      inputProps={{
                        maxLength: 10,
                        pattern: "[0-9]*",
                      }}
                      onChange={(e) => {
                        // Only allow numeric input
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Search />}
                  sx={{
                    py: 1.8,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
                    },
                  }}
                >
                  {isLoading ? "Searching..." : "Check Status"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Fetching PNR status...
            </Typography>
          </Box>
        )}

        {/* PNR Not Found */}
        {notFound && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              PNR Not Found
            </Typography>
            <Typography variant="body2">
              Please check your PNR number and try again. Make sure you've entered a valid 10-digit PNR number.
            </Typography>
          </Alert>
        )}

        {/* PNR Data Display */}
        {pnrData && (
          <Grid container spacing={4}>
            {/* Train Information */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {pnrData.trainNumber} - {pnrData.trainName}
                      </Typography>
                      <Chip
                        label={pnrData.trainType}
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        PNR: {pnrData.pnr}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(pnrData.journeyDate).format("ddd, MMM DD, YYYY")}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Journey Details */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {pnrData.from.departureTime}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {pnrData.from.stationCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pnrData.from.stationName}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={4}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          {pnrData.duration}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                          <Box sx={{ width: 40, height: 2, bgcolor: "primary.main" }} />
                          <Train sx={{ mx: 1, color: "primary.main" }} />
                          <Box sx={{ width: 40, height: 2, bgcolor: "primary.main" }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {pnrData.distance}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {pnrData.to.arrivalTime}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {pnrData.to.stationCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pnrData.to.stationName}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Class Information */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Class:</strong> {pnrData.className} ({pnrData.classCode})
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1">
                        <strong>Chart Status:</strong>
                      </Typography>
                      <Chip
                        label={pnrData.chartStatus === "PREPARED" ? "Chart Prepared" : "Chart Not Prepared"}
                        color={pnrData.chartStatus === "PREPARED" ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Passenger Details */}
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Passenger Details
                  </Typography>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Passenger</TableCell>
                          <TableCell>Age</TableCell>
                          <TableCell>Gender</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Seat/Coach</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pnrData.passengers.map((passenger, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Person sx={{ mr: 1, color: "primary.main" }} />
                                {passenger.name}
                              </Box>
                            </TableCell>
                            <TableCell>{passenger.age}</TableCell>
                            <TableCell>{passenger.gender}</TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusText(passenger.currentStatus.split(" ")[0])}
                                color={getStatusColor(passenger.currentStatus.split(" ")[0])}
                                size="small"
                                icon={getStatusIcon(passenger.currentStatus.split(" ")[0])}
                              />
                            </TableCell>
                            <TableCell>
                              {passenger.seatNumber && passenger.coachPosition
                                ? `${passenger.coachPosition}/${passenger.seatNumber}`
                                : passenger.currentStatus.includes("RAC") || passenger.currentStatus.includes("WL")
                                ? passenger.currentStatus
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Status Summary */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: "sticky", top: 24 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Booking Status
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {getStatusIcon(pnrData.currentStatus)}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body1" fontWeight="bold">
                        Current Status
                      </Typography>
                      <Chip
                        label={getStatusText(pnrData.currentStatus)}
                        color={getStatusColor(pnrData.currentStatus)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  {pnrData.bookingStatus !== pnrData.currentStatus && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Original Status:</strong> {getStatusText(pnrData.bookingStatus)}
                      </Typography>
                    </Alert>
                  )}

                  {pnrData.currentStatus === "RAC" && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        RAC passengers get confirmed berths after chart preparation, subject to cancellations.
                      </Typography>
                    </Alert>
                  )}

                  {pnrData.currentStatus.includes("WL") && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Your ticket is on the waiting list. Confirmation depends on cancellations by other passengers.
                      </Typography>
                    </Alert>
                  )}

                  {pnrData.currentStatus === "CAN" && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        This ticket has been cancelled. Please check your refund status.
                      </Typography>
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Journey Progress
                </Typography>
                
                {dayjs(pnrData.journeyDate).isAfter(dayjs()) ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Journey starts in {dayjs(pnrData.journeyDate).diff(dayjs(), 'day')} day(s)
                    </Typography>
                    <LinearProgress variant="determinate" value={0} sx={{ mb: 2 }} />
                  </Box>
                ) : dayjs(pnrData.journeyDate).isSame(dayjs(), 'day') ? (
                  <Box>
                    <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                      Journey is today!
                    </Typography>
                    <LinearProgress variant="determinate" value={50} color="success" sx={{ mb: 2 }} />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Journey completed
                    </Typography>
                    <LinearProgress variant="determinate" value={100} color="success" sx={{ mb: 2 }} />
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/search")}
                    sx={{
                      background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                      },
                    }}
                  >
                    Book New Ticket
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate("/my-bookings")}>
                    View All Bookings
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Help Section */}
        {!pnrData && !isLoading && (
          <Paper elevation={1} sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Need Help?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <FindInPage sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Where to find PNR?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PNR number is on your ticket confirmation SMS/email
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <AccessTime sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Real-time Updates
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status is updated in real-time as chart preparation happens
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <LocationOn sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Live Train Tracking
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track your train's live location and running status
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </Layout>
  );
}
