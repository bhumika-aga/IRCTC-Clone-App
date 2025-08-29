/**
 * Train and booking related types
 */

export interface Train {
  id: string
  trainNumber: string
  trainName: string
  trainType: TrainType
  routes: TrainRoute[]
  operationalDays: string[]
  isActive: boolean
  coachConfiguration: Record<string, number>
  baseFarePerKm: Record<string, number>
}

export interface TrainRoute {
  stationCode: string
  stationName: string
  arrivalTime: string
  departureTime: string
  distanceFromSource: number
  stopNumber: number
  haltDurationMinutes: number
  isSourceStation: boolean
  isDestinationStation: boolean
}

export interface TrainSearchRequest {
  sourceStation: string
  destinationStation: string
  travelDate: string
  classType?: string
  quota?: QuotaType
}

export interface TrainSearchResult {
  train: Train
  availableClasses: ClassAvailability[]
  duration: string
  distance: number
  departureTime: string
  arrivalTime: string
  fare: Record<string, number>
}

export interface ClassAvailability {
  classType: string
  className: string
  available: number
  waitlist: number
  fare: number
  status: AvailabilityStatus
}

export interface Station {
  code: string
  name: string
  city: string
  state: string
}

export interface Passenger {
  name: string
  age: number
  gender: 'M' | 'F' | 'T'
  berthPreference?: BerthPreference
  isSeniorCitizen: boolean
  isChild: boolean
  isInfant: boolean
}

export interface SeatAllocation {
  passengerName: string
  coachNumber: string
  seatNumber: number
  berthType: string
  allocationStatus: BookingStatus
}

export interface Booking {
  id: string
  pnrNumber: string
  user: string
  train: Train
  sourceStationCode: string
  destinationStationCode: string
  travelDate: string
  classType: string
  status: BookingStatus
  quota: QuotaType
  passengers: Passenger[]
  seatAllocations: SeatAllocation[]
  totalFare: number
  convenienceFee: number
  totalAmount: number
  isPaid: boolean
  bookedAt: string
  updatedAt: string
  // Cancellation details (optional)
  cancelledAt?: string
  cancellationCharges?: number
  refundAmount?: number
  cancellationReason?: string
}

export interface BookingRequest {
  trainId: string
  sourceStationCode: string
  destinationStationCode: string
  travelDate: string
  classType: string
  quota: QuotaType
  passengers: Passenger[]
}

// Enums
export enum TrainType {
  SUPERFAST = 'SUPERFAST',
  EXPRESS = 'EXPRESS',
  PASSENGER = 'PASSENGER',
  RAJDHANI = 'RAJDHANI',
  SHATABDI = 'SHATABDI',
  VANDE_BHARAT = 'VANDE_BHARAT',
  DURONTO = 'DURONTO',
  GARIB_RATH = 'GARIB_RATH'
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  RAC = 'RAC',
  WAITLISTED = 'WAITLISTED',
  CANCELLED = 'CANCELLED',
  CHART_PREPARED = 'CHART_PREPARED'
}

export enum QuotaType {
  GENERAL = 'GENERAL',
  TATKAL = 'TATKAL',
  LADIES = 'LADIES',
  SENIOR_CITIZEN = 'SENIOR_CITIZEN',
  PHYSICALLY_HANDICAPPED = 'PHYSICALLY_HANDICAPPED',
  DEFENCE = 'DEFENCE',
  RAILWAY_EMPLOYEE = 'RAILWAY_EMPLOYEE'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  RAC = 'RAC',
  WAITLISTED = 'WAITLISTED',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}

export enum BerthPreference {
  LOWER = 'LOWER',
  MIDDLE = 'MIDDLE',
  UPPER = 'UPPER',
  SIDE_LOWER = 'SIDE_LOWER',
  SIDE_UPPER = 'SIDE_UPPER'
}

// Class configurations
export const CLASS_TYPES = {
  'AC1A': { name: 'AC First Class', shortName: '1A' },
  'AC2A': { name: 'AC 2 Tier', shortName: '2A' },
  'AC3A': { name: 'AC 3 Tier', shortName: '3A' },
  'CC': { name: 'Chair Car', shortName: 'CC' },
  'SL': { name: 'Sleeper', shortName: 'SL' },
  '2S': { name: 'Second Sitting', shortName: '2S' }
} as const

export type ClassType = keyof typeof CLASS_TYPES