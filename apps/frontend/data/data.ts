/**
 * MOCK DATA — replace with real API calls once backend is ready. Keep the
 * same shape (interfaces) so components don't need to change, only the data
 * source does.
 */

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string; // ISO date string, e.g. "2025-03-10"
  endDate: string;
  status: "completed" | "upcoming" | "ongoing";
  coverImage?: string;
  budget?: number;
}

export const trips: Trip[] = [
  {
    id: "t1",
    name: "Mediterranean Summer Yacht Week",
    destination: "Split & Mykonos",
    startDate: "2024-08-10",
    endDate: "2024-08-20",
    status: "completed",
    budget: 3500,
  },
  {
    id: "t2",
    name: "Scandinavian Winter Retreat",
    destination: "Norway & Finland",
    startDate: "2025-12-15",
    endDate: "2025-12-28",
    status: "upcoming",
    budget: 4200,
  },
  {
    id: "t3",
    name: "The South American Expedition",
    destination: "Peru",
    startDate: "2026-06-05",
    endDate: "2026-06-25",
    status: "ongoing",
    budget: 2800,
  },
];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  preferredLanguage: string;
  savedDestinations: string[];
}

export const currentUser: User = {
  id: "u1",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  preferredLanguage: "English",
  savedDestinations: ["Cusco", "Tromsø", "Mykonos"],
};

export interface CityOption {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: "Budget" | "Mid-range" | "Luxury";
  popularity: number;
  description?: string;
  imageUrl?: string;
}

export const popularCities: CityOption[] = [
  { id: "c1", name: "Cusco", country: "Peru", region: "South America", costIndex: "Budget", popularity: 92 },
  { id: "c2", name: "Tromsø", country: "Norway", region: "Europe", costIndex: "Luxury", popularity: 88 },
  { id: "c3", name: "Split", country: "Croatia", region: "Europe", costIndex: "Mid-range", popularity: 95 },
  { id: "c4", name: "Rovaniemi", country: "Finland", region: "Europe", costIndex: "Luxury", popularity: 82 },
  { id: "c5", name: "Mykonos", country: "Greece", region: "Europe", costIndex: "Luxury", popularity: 98 },
];

export interface ActivityOption {
  id: string;
  name: string;
  type: string;
  city: string;
  duration: string;
  cost: number;
}

export const activities: ActivityOption[] = [
  { id: "a1", name: "Machu Picchu Trek", type: "Adventure", city: "Cusco", duration: "8 hours", cost: 150 },
  { id: "a2", name: "Northern Lights Safari", type: "Sightseeing", city: "Tromsø", duration: "4 hours", cost: 120 },
  { id: "a3", name: "Diocletian's Palace Tour", type: "Culture", city: "Split", duration: "2 hours", cost: 25 },
  { id: "a4", name: "Husky Sledding", type: "Adventure", city: "Rovaniemi", duration: "3 hours", cost: 180 },
  { id: "a5", name: "Sunset Catamaran Cruise", type: "Leisure", city: "Mykonos", duration: "5 hours", cost: 200 },
];

export interface TripSuggestion {
  id: string;
  name: string;
  description: string;
}

export const tripSuggestions: TripSuggestion[] = [
  {
    id: "s1",
    name: "Patagonia Highlights",
    description: "Hike the breathtaking glaciers and peaks of southern Chile and Argentina.",
  },
  {
    id: "s2",
    name: "Iceland Ring Road",
    description: "Drive past waterfalls, volcanoes, and black sand beaches.",
  },
  {
    id: "s3",
    name: "Amalfi Coast Drive",
    description: "Experience the vibrant cliffside villages and crystal clear waters of Italy.",
  },
];

export interface Activity {
  id: string;
  name: string;
  type: string;
  duration?: string;
  cost?: number;
  day: number;
  category: "transport" | "stay" | "activities" | "meals";
}

export interface ItineraryStop {
  id: string;
  city: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
}

export const dailyBudgetLimit = 250;

export const itineraryStops: ItineraryStop[] = [
  {
    id: "stop1",
    city: "Lima, Peru",
    startDate: "2026-06-05",
    endDate: "2026-06-08",
    activities: [
      { id: "act1", name: "Flight to Lima", type: "Travel", cost: 450, day: 1, category: "transport" },
      { id: "act2", name: "Miraflores Boutique Hotel", type: "Accommodation", cost: 120, day: 1, category: "stay" },
      { id: "act3", name: "Historic Center Walk", type: "Sightseeing", duration: "3 hours", cost: 0, day: 1, category: "activities" },
      { id: "act4", name: "Ceviche Masterclass", type: "Food", cost: 85, day: 2, category: "meals" },
    ],
  },
  {
    id: "stop2",
    city: "Cusco, Peru",
    startDate: "2026-06-08",
    endDate: "2026-06-15",
    activities: [
      { id: "act5", name: "Flight to Cusco", type: "Travel", cost: 90, day: 1, category: "transport" },
      { id: "act6", name: "Sacred Valley Lodge", type: "Accommodation", cost: 150, day: 1, category: "stay" },
      { id: "act7", name: "Machu Picchu Day Tour", type: "Adventure", duration: "10 hours", cost: 200, day: 2, category: "activities" },
      { id: "act8", name: "Andean Traditional Dinner", type: "Food", cost: 40, day: 2, category: "meals" },
    ],
  },
];

export interface CommunityPost {
  id: string;
  authorName: string;
  authorInitials: string;
  tripOrActivityName: string;
  activityType: string;
  destination: string;
  content: string;
  postedDate: string;
  likeCount: number;
}

export const communityPosts: CommunityPost[] = [
  {
    id: "post1",
    authorName: "Carlos Mendoza",
    authorInitials: "CM",
    tripOrActivityName: "Machu Picchu Trek",
    activityType: "Adventure",
    destination: "Cusco, Peru",
    content: "Absolutely breathtaking! The altitude was tough, but reaching the Sun Gate at dawn was a once-in-a-lifetime experience. Make sure to pack coca leaves!",
    postedDate: "2026-08-10T14:30:00Z",
    likeCount: 215,
  },
  {
    id: "post2",
    authorName: "Sofia Lindberg",
    authorInitials: "SL",
    tripOrActivityName: "Northern Lights Safari",
    activityType: "Nature",
    destination: "Tromsø, Norway",
    content: "We were lucky enough to see the aurora dancing across the sky for a full 20 minutes! Wrap up warm though, it gets freezing out on the fjords.",
    postedDate: "2026-08-15T09:15:00Z",
    likeCount: 342,
  },
  {
    id: "post3",
    authorName: "Mateo Rossi",
    authorInitials: "MR",
    tripOrActivityName: "Sunset Catamaran Cruise",
    activityType: "Leisure",
    destination: "Mykonos, Greece",
    content: "The water was crystal clear and the sunset was unreal. Definitely spring for the premium package, the seafood appetizers were incredible.",
    postedDate: "2026-08-18T18:45:00Z",
    likeCount: 128,
  },
  {
    id: "post4",
    authorName: "Emma Virtanen",
    authorInitials: "EV",
    tripOrActivityName: "Husky Sledding",
    activityType: "Adventure",
    destination: "Rovaniemi, Finland",
    content: "The dogs were so excited and friendly! Gliding through the snowy forests felt completely magical. A must-do if you visit Lapland.",
    postedDate: "2026-08-19T11:20:00Z",
    likeCount: 189,
  },
  {
    id: "post5",
    authorName: "Luka Kovač",
    authorInitials: "LK",
    tripOrActivityName: "Diocletian's Palace Tour",
    activityType: "Culture",
    destination: "Split, Croatia",
    content: "Walking through a living Roman palace is surreal. The fact that people still live and work within its walls gives the city such an amazing vibe.",
    postedDate: "2026-08-20T08:10:00Z",
    likeCount: 87,
  }
];
