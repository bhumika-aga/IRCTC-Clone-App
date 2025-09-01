import { Layout } from "@/components/Layout/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Add,
  ArrowBack,
  CalendarToday,
  CreditCard,
  DirectionsBus,
  Person,
  Phone,
  Remove,
  Train,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const passengerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters"),
  age: z.number().min(1, "Age must be at least 1").max(120, "Age must not exceed 120"),
  gender: z.enum(["Male", "Female", "Other"]),
  seatPreference: z.enum(["Lower", "Middle", "Upper", "Side Lower", "Side Upper", "No Preference"]).optional(),
});

const bookingSchema = z.object({
  passengers: z.array(passengerSchema).min(1, "At least one passenger is required").max(6, "Maximum 6 passengers allowed"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  insuranceOpted: z.boolean().default(false),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const steps = ["Passenger Details", "Review & Payment", "Confirmation"];

const seatPreferences = [
  "Lower",
  "Middle", 
  "Upper",
  "Side Lower",
  "Side Upper",
  "No Preference"
];

export function BookTicket() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  
  // Get booking data from navigation state
  const { train, classDetails, searchData } = location.state || {};
  
  // If no booking data, redirect to search
  if (!train || !classDetails || !searchData) {
    navigate('/search');
    return null;
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      passengers: [
        {
          name: "",
          age: 18,
          gender: "Male",
          seatPreference: "No Preference",
        },
      ],
      contactEmail: "",
      contactPhone: "",
      insuranceOpted: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  const passengers = watch("passengers");
  const insuranceOpted = watch("insuranceOpted");

  const baseFare = classDetails.fare;
  const insuranceFee = insuranceOpted ? passengers.length * 35 : 0;
  const convenienceFee = 20;
  const totalFare = (baseFare * passengers.length) + insuranceFee + convenienceFee;

  const addPassenger = () => {
    if (passengers.length < 6) {
      append({
        name: "",
        age: 18,
        gender: "Male",
        seatPreference: "No Preference",
      });
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      // In a real app, this would process payment
      console.log('Booking data:', {
        train,
        classDetails,
        searchData,
        passengerDetails: data,
        totalFare,
      });
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          
          <Typography variant="h4" gutterBottom fontWeight="bold">
            <Train sx={{ mr: 1, verticalAlign: 'middle' }} />
            Complete Your Booking
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              {activeStep === 0 && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Passenger Information
                  </Typography>
                  
                  {fields.map((field, index) => (
                    <Card key={field.id} variant="outlined" sx={{ mb: 3, p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">
                          <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Passenger {index + 1}
                        </Typography>
                        {passengers.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removePassenger(index)}
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                        )}
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`passengers.${index}.name`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Full Name"
                                fullWidth
                                error={!!errors.passengers?.[index]?.name}
                                helperText={errors.passengers?.[index]?.name?.message}
                                placeholder="Enter full name as per ID proof"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Controller
                            name={`passengers.${index}.age`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Age"
                                type="number"
                                fullWidth
                                inputProps={{ min: 1, max: 120 }}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                error={!!errors.passengers?.[index]?.age}
                                helperText={errors.passengers?.[index]?.age?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Controller
                            name={`passengers.${index}.gender`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup
                                  {...field}
                                  row
                                  sx={{ mt: 1 }}
                                >
                                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                              </FormControl>
                            )}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            name={`passengers.${index}.seatPreference`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <FormLabel>Seat Preference (Optional)</FormLabel>
                                <RadioGroup
                                  {...field}
                                  row
                                  sx={{ mt: 1 }}
                                >
                                  {seatPreferences.map((preference) => (
                                    <FormControlLabel
                                      key={preference}
                                      value={preference}
                                      control={<Radio />}
                                      label={preference}
                                    />
                                  ))}
                                </RadioGroup>
                              </FormControl>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  ))}

                  {passengers.length < 6 && (
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addPassenger}
                      sx={{ mb: 4 }}
                    >
                      Add Another Passenger
                    </Button>
                  )}

                  <Divider sx={{ my: 4 }} />

                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Contact Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="contactEmail"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email Address"
                            type="email"
                            fullWidth
                            error={!!errors.contactEmail}
                            helperText={errors.contactEmail?.message}
                            placeholder="your.email@example.com"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="contactPhone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phone Number"
                            fullWidth
                            error={!!errors.contactPhone}
                            helperText={errors.contactPhone?.message}
                            placeholder="10-digit mobile number"
                            InputProps={{
                              startAdornment: <Phone sx={{ mr: 1, color: 'primary.main' }} />,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ 
                        px: 4,
                        background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                        }
                      }}
                    >
                      Continue to Payment
                    </Button>
                  </Box>
                </form>
              )}

              {activeStep === 1 && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Review Your Booking
                  </Typography>

                  {/* Passenger Review */}
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Passengers ({passengers.length})
                      </Typography>
                      {passengers.map((passenger, index) => (
                        <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < passengers.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                          <Typography variant="body1" fontWeight="bold">
                            {passenger.name || `Passenger ${index + 1}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Age: {passenger.age} • Gender: {passenger.gender}
                            {passenger.seatPreference && passenger.seatPreference !== "No Preference" && 
                              ` • Seat Preference: ${passenger.seatPreference}`
                            }
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Travel Insurance */}
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Controller
                        name="insuranceOpted"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={<Radio {...field} checked={field.value} />}
                            label={
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  Travel Insurance (₹35 per passenger)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Covers medical emergency, trip cancellation, and other travel-related incidents
                                </Typography>
                              </Box>
                            }
                          />
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Payment Method
                      </Typography>
                      <Alert severity="info">
                        Payment integration will be completed in the next phase. For now, this is a simulation.
                      </Alert>
                    </CardContent>
                  </Card>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      size="large"
                    >
                      Back to Passenger Details
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ 
                        px: 4,
                        background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #66BB6A 30%, #4CAF50 90%)",
                        }
                      }}
                    >
                      Confirm & Pay ₹{totalFare.toLocaleString()}
                    </Button>
                  </Box>
                </form>
              )}

              {activeStep === 2 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
                    🎉 Booking Confirmed!
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Your tickets have been booked successfully
                  </Typography>
                  
                  <Card variant="outlined" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        PNR: 1234567890
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Booking confirmation and tickets have been sent to your email address.
                      </Typography>
                    </CardContent>
                  </Card>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/my-bookings')}
                      sx={{ 
                        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
                        }
                      }}
                    >
                      View My Bookings
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                    >
                      Book Another Ticket
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Booking Summary Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Booking Summary
              </Typography>

              {/* Train Details */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {train.trainNumber} - {train.trainName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {searchData.travelDate.format('ddd, MMM DD, YYYY')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {train.departureTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchData.fromStation.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', mx: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {train.duration}
                      </Typography>
                      <DirectionsBus sx={{ color: 'primary.main' }} />
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {train.arrivalTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchData.toStation.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={classDetails.name}
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>

              {/* Fare Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Fare Details
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})
                  </Typography>
                  <Typography variant="body2">
                    ₹{(baseFare * passengers.length).toLocaleString()}
                  </Typography>
                </Box>
                
                {insuranceOpted && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Travel Insurance</Typography>
                    <Typography variant="body2">₹{insuranceFee}</Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Convenience Fee</Typography>
                  <Typography variant="body2">₹{convenienceFee}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{totalFare.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {activeStep < 2 && (
                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                  Your seats will be confirmed after payment. Current availability: {classDetails.available} seats
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}