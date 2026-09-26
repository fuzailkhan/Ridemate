/**
 * Static mock data for the Task 1 visual shell only.
 * No network calls, no Firebase — every screen in this task renders from
 * this file so the navigation/theme/component work can be reviewed without
 * any backend wired up yet.
 */
import type {
  AppNotification,
  ChatMessage,
  EmergencyContact,
  Ride,
  RideGroup,
  RiderUser,
  Vehicle
} from '@/types/models';

export const mockCurrentUser: RiderUser = {
  uid: 'user-arjun',
  email: 'arjun.rao@example.com',
  displayName: 'Arjun Rao',
  city: 'Pune',
  ridingExperienceYears: 6,
  bio: 'Weekend rider. Ghats and coastal roads over anything flat.',
  rideStats: {
    totalRides: 24,
    totalDistanceKm: 6120,
    groupRidesLed: 5,
    memberSince: '2022-03-01'
  }
};

export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    ownerId: 'user-arjun',
    manufacturer: 'KTM',
    model: 'Duke 390',
    year: 2023,
    registrationNumber: 'MH12 AB 4390',
    color: 'Atlas Grey',
    isPrimary: true,
    modifications: ['Aftermarket exhaust', 'Crash guard']
  },
  {
    id: 'vehicle-2',
    ownerId: 'user-arjun',
    manufacturer: 'Royal Enfield',
    model: 'Himalayan 450',
    year: 2024,
    registrationNumber: 'MH12 CD 4501',
    color: 'Slate Black',
    isPrimary: false
  }
];

export const mockRides: Ride[] = [
  {
    id: 'ride-sunrise-ghats',
    organizerId: 'user-arjun',
    organizerName: 'Arjun · Duke 390',
    title: 'Sunrise Ghats Run',
    description: 'Early start through the ghats, fuel stop at Airoli, rest at Bhushi Dam.',
    status: 'live',
    visibility: 'public',
    dateLabel: 'Sat 6:00 AM',
    startTime: '06:00',
    meetingPoint: { name: 'Lonavala Toll Plaza', location: { lat: 18.7537, lng: 73.4064 } },
    destination: { name: 'Pawna Lake', location: { lat: 18.6841, lng: 73.4547 } },
    distanceKm: 142,
    estimatedDurationMin: 210,
    difficulty: 'moderate',
    maxRiders: 15,
    currentRiderCount: 12,
    sweepRiderName: 'Rhea',
    sweepRiderPhone: '+91 98XXXXXX21',
    nearestHospital: 'Kamshet Rural, 8 km',
    stops: [
      {
        id: 'stop-1',
        rideId: 'ride-sunrise-ghats',
        type: 'meeting',
        name: 'Meet: Lonavala Toll Plaza',
        location: { lat: 18.7537, lng: 73.4064 },
        order: 1,
        estimatedArrival: '6:00 AM'
      },
      {
        id: 'stop-2',
        rideId: 'ride-sunrise-ghats',
        type: 'fuel',
        name: 'Fuel: Airoli Petrol Pump',
        location: { lat: 18.72, lng: 73.42 },
        order: 2,
        estimatedArrival: '7:30 AM'
      },
      {
        id: 'stop-3',
        rideId: 'ride-sunrise-ghats',
        type: 'rest',
        name: 'Rest: Bhushi Dam viewpoint',
        location: { lat: 18.7276, lng: 73.4649 },
        order: 3,
        estimatedArrival: '9:00 AM'
      },
      {
        id: 'stop-4',
        rideId: 'ride-sunrise-ghats',
        type: 'destination',
        name: 'Destination: Pawna Lake',
        location: { lat: 18.6841, lng: 73.4547 },
        order: 4,
        estimatedArrival: '10:30 AM'
      }
    ],
    participants: [
      { userId: 'user-arjun', displayName: 'Arjun', role: 'organizer', status: 'joined', isSharingLocation: true, speedKmh: 72, lastUpdatedLabel: 'now' },
      { userId: 'user-meera', displayName: 'Meera', role: 'member', status: 'joined', isSharingLocation: true, speedKmh: 0.4, lastUpdatedLabel: 'now' },
      { userId: 'user-dev', displayName: 'Dev', role: 'member', status: 'joined', isSharingLocation: true, speedKmh: 2.1, lastUpdatedLabel: '10s ago' },
      { userId: 'user-sana', displayName: 'Sana', role: 'member', status: 'joined', isSharingLocation: true, speedKmh: 88, lastUpdatedLabel: 'now' },
      { userId: 'user-kabir', displayName: 'Kabir', role: 'member', status: 'joined', isSharingLocation: true, speedKmh: 3.3, lastUpdatedLabel: '5s ago' },
      { userId: 'user-rhea', displayName: 'Rhea', role: 'sweep', status: 'joined', isSharingLocation: true, speedKmh: 75, lastUpdatedLabel: 'now' }
    ]
  },
  {
    id: 'ride-coastal-twist',
    organizerId: 'user-dev',
    organizerName: 'Dev · Interceptor 650',
    title: 'Coastal Twist — Gokarna',
    description: 'Long coastal run down to Gokarna with a rest stop at Karwar.',
    status: 'published',
    visibility: 'public',
    dateLabel: 'Sun 5:30 AM',
    startTime: '05:30',
    meetingPoint: { name: 'Karwar Bypass HP Fuel Station', location: { lat: 14.8022, lng: 74.1291 } },
    destination: { name: 'Gokarna', location: { lat: 14.5479, lng: 74.3188 } },
    distanceKm: 310,
    estimatedDurationMin: 360,
    difficulty: 'hard',
    maxRiders: 12,
    currentRiderCount: 8,
    stops: [
      {
        id: 'stop-5',
        rideId: 'ride-coastal-twist',
        type: 'meeting',
        name: 'Meet: Karwar Bypass HP Fuel Station',
        location: { lat: 14.8022, lng: 74.1291 },
        order: 1,
        estimatedArrival: '5:30 AM'
      },
      {
        id: 'stop-6',
        rideId: 'ride-coastal-twist',
        type: 'destination',
        name: 'Destination: Gokarna',
        location: { lat: 14.5479, lng: 74.3188 },
        order: 2,
        estimatedArrival: '11:30 AM'
      }
    ],
    participants: [
      { userId: 'user-dev', displayName: 'Dev', role: 'organizer', status: 'joined', isSharingLocation: false },
      { userId: 'user-arjun', displayName: 'Arjun', role: 'member', status: 'joined', isSharingLocation: false }
    ]
  },
  {
    id: 'ride-twisties-ooty',
    organizerId: 'user-meera',
    organizerName: 'Meera · Himalayan 450',
    title: 'Twisties to Ooty — Day 2',
    status: 'live',
    visibility: 'private',
    dateLabel: 'Sat · Day 2',
    startTime: '07:00',
    meetingPoint: { name: 'Mysore Road Junction', location: { lat: 11.75, lng: 76.6 } },
    destination: { name: 'Ooty', location: { lat: 11.4102, lng: 76.695 } },
    distanceKm: 88,
    estimatedDurationMin: 145,
    difficulty: 'moderate',
    currentRiderCount: 6,
    stops: [
      {
        id: 'stop-7',
        rideId: 'ride-twisties-ooty',
        type: 'fuel',
        name: 'Fuel Stop: Kalhatti Rd',
        location: { lat: 11.5, lng: 76.65 },
        order: 1,
        estimatedArrival: 'next stop'
      }
    ],
    participants: []
  }
];

export const mockGroups: RideGroup[] = [
  { id: 'group-ghat-riders', name: 'Ghat Riders Pune', memberCount: 46, lastActivityLabel: 'Active 2h ago' },
  { id: 'group-coastal-crew', name: 'Coastal Crew', memberCount: 21, lastActivityLabel: 'Active yesterday' },
  { id: 'group-himalayan-owners', name: 'Himalayan 450 Owners', memberCount: 118, lastActivityLabel: 'Active 12m ago' }
];

export const mockChatMessages: ChatMessage[] = [
  { id: 'msg-1', rideId: 'ride-sunrise-ghats', senderId: 'system', type: 'system', text: 'Rhea joined as sweep rider', createdAtLabel: '6:02 AM' },
  { id: 'msg-2', rideId: 'ride-sunrise-ghats', senderId: 'user-meera', senderName: 'Meera', type: 'text', text: 'Running 5 min late, wait at the toll plaza', createdAtLabel: '6:04 AM' },
  { id: 'msg-3', rideId: 'ride-sunrise-ghats', senderId: 'user-arjun', senderName: 'Arjun', type: 'text', text: 'No rush, grabbing chai', createdAtLabel: '6:05 AM' },
  { id: 'msg-4', rideId: 'ride-sunrise-ghats', senderId: 'system', type: 'system', text: 'Ride started', createdAtLabel: '6:12 AM' }
];

export const mockNotifications: AppNotification[] = [
  { id: 'notif-1', type: 'ride_starting', title: 'Sunrise Ghats Run is starting', body: 'The ride starts in 15 minutes at Lonavala Toll Plaza.', rideId: 'ride-sunrise-ghats', read: false, createdAtLabel: '5m ago' },
  { id: 'notif-2', type: 'rider_joined', title: 'Kabir joined your ride', body: 'Sunrise Ghats Run now has 12 riders.', rideId: 'ride-sunrise-ghats', read: false, createdAtLabel: '1h ago' },
  { id: 'notif-3', type: 'chat_message', title: 'New message from Meera', body: 'Running 5 min late, wait at the toll plaza', rideId: 'ride-sunrise-ghats', read: true, createdAtLabel: '2h ago' },
  { id: 'notif-4', type: 'ride_invite', title: 'Dev invited you to a ride', body: 'Coastal Twist — Gokarna, this Sunday.', rideId: 'ride-coastal-twist', read: true, createdAtLabel: 'Yesterday' }
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: 'contact-1', name: 'Priya Rao', phone: '+91 90XXXXXX12', relation: 'Spouse', isPrimary: true }
];
