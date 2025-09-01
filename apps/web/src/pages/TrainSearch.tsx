import { Layout } from "@/components/Layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccessTime,
  CalendarToday,
  DirectionsBus,
  Search,
  SwapHoriz,
  Train,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Mock data for stations (in real app, this would come from API)
const mockStations = [
  { code: "NDLS", name: "New Delhi", city: "New Delhi" },
  { code: "CSMT", name: "Mumbai CST", city: "Mumbai" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
  { code: "MAS", name: "Chennai Central", city: "Chennai" },
  { code: "SBC", name: "Bengaluru City Junction", city: "Bengaluru" },
  { code: "PUNE", name: "Pune Junction", city: "Pune" },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur" },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow" },
  { code: "PNBE", name: "Patna Junction", city: "Patna" },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad" },
];

// Mock train data
const mockTrains = [
  {
    id: "1",
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani Express",
    trainType: "RAJDHANI",
    departureTime: "16:55",
    arrivalTime: "08:35",
    duration: "15h 40m",
    distance: "1384 km",
    operationalDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { code: "AC1A", name: "AC First Class", available: 12, fare: 9006 },
      { code: "AC2A", name: "AC 2-Tier", available: 45, fare: 5817 },
      { code: "AC3A", name: "AC 3-Tier", available: 120, fare: 3875 },
    ],
  },
  {
    id: "2",
    trainNumber: "12261",
    trainName: "Howrah Duronto Express",
    trainType: "DURONTO",
    departureTime: "14:20",
    arrivalTime: "06:30",
    duration: "16h 10m",
    distance: "1400 km",
    operationalDays: ["Mon", "Wed", "Fri"],
    classes: [
      { code: "AC2A", name: "AC 2-Tier", available: 32, fare: 5200 },
      { code: "AC3A", name: "AC 3-Tier", available: 89, fare: 3200 },
      { code: "SL", name: "Sleeper", available: 156, fare: 1450 },
    ],
  },
  {
    id: "3",
    trainNumber: "12007",
    trainName: "Chennai Express",
    trainType: "EXPRESS",
    departureTime: "13:30",
    arrivalTime: "20:15",
    duration: "6h 45m",
    distance: "362 km",
    operationalDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    classes: [
      { code: "AC3A", name: "AC 3-Tier", available: 45, fare: 1890 },
      { code: "SL", name: "Sleeper", available: 78, fare: 620 },
      { code: "2S", name: "Second Sitting", available: 120, fare: 285 },
    ],
  },
];

const searchSchema = z.object({
  fromStation: z.object({
    code: z.string(),
    name: z.string(),
    city: z.string(),
  }).nullable(),
  toStation: z.object({
    code: z.string(),
    name: z.string(),
    city: z.string(),
  }).nullable(),
  travelDate: z.custom<Dayjs>().refine((val) => val && dayjs(val).isAfter(dayjs().subtract(1, 'day')), "Please select a valid travel date"),
}).refine(
  (data) => data.fromStation !== null,
  {
    message: "Please select departure station",
    path: ["fromStation"],
  }
).refine(
  (data) => data.toStation !== null,
  {
    message: "Please select arrival station",
    path: ["toStation"],
  }
);

type SearchFormData = z.infer<typeof searchSchema>;

export function TrainSearch() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      fromStation: null,
      toStation: null,
      travelDate: dayjs().add(1, 'day'),
    },
  });

  const fromStation = watch("fromStation");
  const toStation = watch("toStation");

  const handleSwapStations = () => {
    const temp = fromStation;
    setValue("fromStation", toStation);
    setValue("toStation", temp);
  };

  const onSubmit = async (data: SearchFormData) => {
    // Validate that stations are selected (should be caught by schema validation)
    if (!data.fromStation || !data.toStation) {
      return;
    }
    
    if (data.fromStation.code === data.toStation.code) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filter mock data based on search criteria (in real app, this would be API call)
      const filteredTrains = mockTrains.filter(train => {
        const dayOfWeek = data.travelDate.format('ddd');
        return train.operationalDays.includes(dayOfWeek);
      });
      
      setSearchResults(filteredTrains);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTrain = (train: any, classDetails: any) => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: { pathname: '/book' },
          bookingData: {
            train,
            classDetails,
            searchData: {
              fromStation,
              toStation,
              travelDate: watch("travelDate"),
            }
          }
        }
      });
      return;
    }

    // Navigate to booking page with train and class details
    navigate('/book', {
      state: {
        train,
        classDetails,
        searchData: {
          fromStation,
          toStation,
          travelDate: watch("travelDate"),
        }
      }
    });
  };

  const getAvailabilityColor = (available: number) => {
    if (available > 50) return 'success';
    if (available > 20) return 'warning';
    if (available > 0) return 'error';
    return 'default';
  };

  const getAvailabilityText = (available: number) => {
    if (available > 50) return 'Available';
    if (available > 20) return 'Limited';
    if (available > 0) return 'Few Left';
    return 'Waiting List';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Search Form */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              <Train sx={{ mr: 1, verticalAlign: 'middle' }} />
              Search Trains
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Controller
                    name="fromStation"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={mockStations}
                        getOptionLabel={(option) => `${option.name} (${option.code})`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="From Station"
                            error={!!errors.fromStation}
                            helperText={errors.fromStation?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <DirectionsBus sx={{ mr: 1, color: 'primary.main' }} />,
                            }}
                          />
                        )}
                        onChange={(_, value) => field.onChange(value)}
                        value={field.value}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={handleSwapStations}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'rotate(180deg)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <SwapHoriz />
                  </IconButton>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="toStation"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={mockStations}
                        getOptionLabel={(option) => `${option.name} (${option.code})`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="To Station"
                            error={!!errors.toStation}
                            helperText={errors.toStation?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <DirectionsBus sx={{ mr: 1, color: 'primary.main' }} />,
                            }}
                          />
                        )}
                        onChange={(_, value) => field.onChange(value)}
                        value={field.value}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="travelDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Travel Date"
                        minDate={dayjs()}
                        maxDate={dayjs().add(4, 'month')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.travelDate,
                            helperText: errors.travelDate?.message,
                            InputProps: {
                              startAdornment: <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />,
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <Search />}
                    sx={{ 
                      py: 1.5,
                      background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                      }
                    }}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Search Results */}
          {hasSearched && (
            <Box>
              {isLoading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CircularProgress size={60} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Searching for trains...
                  </Typography>
                </Box>
              ) : searchResults.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No trains found for the selected route and date. Please try different search criteria.
                </Alert>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {searchResults.length} trains found from {fromStation?.name} to {toStation?.name}
                  </Typography>
                  
                  {searchResults.map((train) => (
                    <Card key={train.id} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {train.trainNumber} - {train.trainName}
                            </Typography>
                            <Chip
                              label={train.trainType}
                              color="primary"
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                              <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                              {train.duration} • {train.distance}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Runs: {train.operationalDays.join(', ')}
                            </Typography>
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                              <Typography variant="h5" fontWeight="bold" color="primary">
                                {train.departureTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {fromStation?.name}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                {train.duration}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                <Box sx={{ width: 50, height: 2, bgcolor: 'primary.main' }} />
                                <Train sx={{ mx: 1, color: 'primary.main' }} />
                                <Box sx={{ width: 50, height: 2, bgcolor: 'primary.main' }} />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {train.distance}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                              <Typography variant="h5" fontWeight="bold" color="primary">
                                {train.arrivalTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {toStation?.name}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Available Classes
                          </Typography>
                          <Grid container spacing={2}>
                            {train.classes.map((classDetails: any) => (
                              <Grid item xs={12} sm={6} md={4} key={classDetails.code}>
                                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                      {classDetails.name}
                                    </Typography>
                                    <Chip
                                      label={getAvailabilityText(classDetails.available)}
                                      color={getAvailabilityColor(classDetails.available)}
                                      size="small"
                                    />
                                  </Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Available: {classDetails.available}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                      ₹{classDetails.fare}
                                    </Typography>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled={classDetails.available === 0}
                                      onClick={() => handleBookTrain(train, classDetails)}
                                    >
                                      {classDetails.available === 0 ? 'Full' : 'Book'}
                                    </Button>
                                  </Box>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Box>
          )}

          {/* Empty state for initial load */}
          {!hasSearched && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Train sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Search for trains to get started
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your departure and arrival stations along with travel date
              </Typography>
            </Box>
          )}
        </Container>
      </Layout>
    </LocalizationProvider>
  );
}