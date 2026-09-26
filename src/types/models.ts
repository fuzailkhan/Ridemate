/**
 * Shared domain types, mirroring the Firestore schema from the approved
 * architecture document. These are plain TypeScript types only — no
 * Firebase SDK usage lives here or anywhere in Task 1. Real Firestore
 * converters will map documents to these shapes in a later task.
 */

export type RideStatus = 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
export type RideVisibility = 'public' | 'private';
export type RideDifficulty = 'easy' | 'moderate' | 'hard';
export type RideStopType = 'meeting' | 'fuel' | 'rest' | 'food' | 'checkpoint' | 'destination';
export type RideMemberRole = 'organizer' | 'sweep' | 'member';
export type RideMemberStatus = 'invited' | 'joined' | 'left' | 'removed';
export type MessageType = 'text' | 'system' | 'announcement' | 'location_share' | 'image';
export type NotificationType =
  | 'ride_invite'
  | 'ride_accepted'
  | 'ride_starting'
  | 'ride_reminder'
  | 'chat_message'
  | 'rider_joined'
  | 'organizer_announcement'
  | 'sos_alert';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface RideStat {
  totalRides: number;
  totalDistanceKm: number;
  groupRidesLed: number;
  memberSince: string; // ISO date string in mock data; Firestore Timestamp in production
}

export interface RiderUser {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string;
  city?: string;
  ridingExperienceYears?: number;
  bio?: string;
  rideStats: RideStat;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  manufacturer: string;
  model: string;
  year: number;
  registrationNumber: string;
  color: string;
  photoURL?: string;
  modifications?: string[];
  isPrimary: boolean;
}

export interface RideStop {
  id: string;
  rideId: string;
  type: RideStopType;
  name: string;
  location: GeoPoint;
  order: number;
  estimatedArrival?: string;
  notes?: string;
}

export interface RideParticipant {
  userId: string;
  displayName: string;
  photoURL?: string;
  role: RideMemberRole;
  status: RideMemberStatus;
  isSharingLocation: boolean;
  speedKmh?: number;
  lastUpdatedLabel?: string; // e.g. "2m ago" — display-only, computed client-side in production
}

export interface Ride {
  id: string;
  organizerId: string;
  organizerName: string;
  title: string;
  description?: string;
  status: RideStatus;
  visibility: RideVisibility;
  dateLabel: string;
  startTime: string;
  meetingPoint: { name: string; location: GeoPoint };
  destination: { name: string; location: GeoPoint };
  distanceKm: number;
  estimatedDurationMin: number;
  difficulty: RideDifficulty;
  maxRiders?: number;
  currentRiderCount: number;
  sweepRiderName?: string;
  sweepRiderPhone?: string;
  nearestHospital?: string;
  coverImageURL?: string;
  stops: RideStop[];
  participants: RideParticipant[];
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string | 'system';
  senderName?: string;
  type: MessageType;
  text?: string;
  createdAtLabel: string;
}

export interface RideGroup {
  id: string;
  name: string;
  memberCount: number;
  coverImageURL?: string;
  lastActivityLabel: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  rideId?: string;
  read: boolean;
  createdAtLabel: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation?: string;
  isPrimary: boolean;
}
