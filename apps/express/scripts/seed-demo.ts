/**
 * Seed script — creates demo users, trips, stops, and community likes.
 * Run: npx tsx scripts/seed-demo.ts
 */

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo1234!";

const USERS = [
  { email: "demo1@globetrotter.com", firstName: "Aria", lastName: "Patel", username: "ariapatel" },
  { email: "demo2@globetrotter.com", firstName: "Marcus", lastName: "Chen", username: "marcuschen" },
  { email: "demo3@globetrotter.com", firstName: "Sofia", lastName: "Rossi", username: "sofiarossi" },
];

const TRIPS_DATA = [
  // Aria's trips
  {
    userIdx: 0,
    trips: [
      {
        name: "Japan Cherry Blossom Tour",
        description: "Two weeks exploring Tokyo, Kyoto, and Osaka during sakura season.",
        coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop",
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-04-14"),
        visibility: "PUBLIC" as const,
        status: "PLANNED" as const,
        currency: "JPY",
        stops: [
          { cityName: "Tokyo", country: "Japan", sequence: 1, arrivalDate: new Date("2026-04-01"), departureDate: new Date("2026-04-05") },
          { cityName: "Kyoto", country: "Japan", sequence: 2, arrivalDate: new Date("2026-04-05"), departureDate: new Date("2026-04-10") },
          { cityName: "Osaka", country: "Japan", sequence: 3, arrivalDate: new Date("2026-04-10"), departureDate: new Date("2026-04-14") },
        ],
      },
      {
        name: "Greek Island Hopping",
        description: "Sun, sea, and ancient ruins across Santorini, Mykonos, and Athens.",
        coverImageUrl: "https://images.unsplash.com/photo-1503152394-c571994fd383?w=800&auto=format&fit=crop",
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-24"),
        visibility: "PUBLIC" as const,
        status: "PLANNED" as const,
        currency: "EUR",
        stops: [
          { cityName: "Athens", country: "Greece", sequence: 1, arrivalDate: new Date("2026-07-10"), departureDate: new Date("2026-07-13") },
          { cityName: "Santorini", country: "Greece", sequence: 2, arrivalDate: new Date("2026-07-13"), departureDate: new Date("2026-07-19") },
          { cityName: "Mykonos", country: "Greece", sequence: 3, arrivalDate: new Date("2026-07-19"), departureDate: new Date("2026-07-24") },
        ],
      },
    ],
  },
  // Marcus's trips
  {
    userIdx: 1,
    trips: [
      {
        name: "South America Adventure",
        description: "Backpacking from Buenos Aires to Cusco and Machu Picchu.",
        coverImageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop",
        startDate: new Date("2026-03-15"),
        endDate: new Date("2026-04-05"),
        visibility: "PUBLIC" as const,
        status: "COMPLETED" as const,
        currency: "USD",
        stops: [
          { cityName: "Buenos Aires", country: "Argentina", sequence: 1, arrivalDate: new Date("2026-03-15"), departureDate: new Date("2026-03-20") },
          { cityName: "Lima", country: "Peru", sequence: 2, arrivalDate: new Date("2026-03-20"), departureDate: new Date("2026-03-28") },
          { cityName: "Cusco", country: "Peru", sequence: 3, arrivalDate: new Date("2026-03-28"), departureDate: new Date("2026-04-05") },
        ],
      },
      {
        name: "Morocco Desert Trek",
        description: "From Marrakech medina to the Sahara sand dunes.",
        coverImageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&auto=format&fit=crop",
        startDate: new Date("2026-10-01"),
        endDate: new Date("2026-10-12"),
        visibility: "PUBLIC" as const,
        status: "PLANNED" as const,
        currency: "EUR",
        stops: [
          { cityName: "Marrakech", country: "Morocco", sequence: 1, arrivalDate: new Date("2026-10-01"), departureDate: new Date("2026-10-05") },
          { cityName: "Merzouga", country: "Morocco", sequence: 2, arrivalDate: new Date("2026-10-05"), departureDate: new Date("2026-10-09") },
          { cityName: "Fes", country: "Morocco", sequence: 3, arrivalDate: new Date("2026-10-09"), departureDate: new Date("2026-10-12") },
        ],
      },
    ],
  },
  // Sofia's trips
  {
    userIdx: 2,
    trips: [
      {
        name: "Scandinavia Northern Lights",
        description: "Chasing the aurora borealis through Norway and Iceland.",
        coverImageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop",
        startDate: new Date("2026-01-10"),
        endDate: new Date("2026-01-22"),
        visibility: "PUBLIC" as const,
        status: "COMPLETED" as const,
        currency: "EUR",
        stops: [
          { cityName: "Oslo", country: "Norway", sequence: 1, arrivalDate: new Date("2026-01-10"), departureDate: new Date("2026-01-14") },
          { cityName: "Tromsø", country: "Norway", sequence: 2, arrivalDate: new Date("2026-01-14"), departureDate: new Date("2026-01-18") },
          { cityName: "Reykjavik", country: "Iceland", sequence: 3, arrivalDate: new Date("2026-01-18"), departureDate: new Date("2026-01-22") },
        ],
      },
      {
        name: "Southeast Asia Food Tour",
        description: "A culinary odyssey through Thailand, Vietnam, and Singapore.",
        coverImageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop",
        startDate: new Date("2026-09-05"),
        endDate: new Date("2026-09-20"),
        visibility: "PUBLIC" as const,
        status: "PLANNED" as const,
        currency: "USD",
        stops: [
          { cityName: "Bangkok", country: "Thailand", sequence: 1, arrivalDate: new Date("2026-09-05"), departureDate: new Date("2026-09-09") },
          { cityName: "Hanoi", country: "Vietnam", sequence: 2, arrivalDate: new Date("2026-09-09"), departureDate: new Date("2026-09-14") },
          { cityName: "Singapore", country: "Singapore", sequence: 3, arrivalDate: new Date("2026-09-14"), departureDate: new Date("2026-09-20") },
        ],
      },
    ],
  },
];

async function upsertCity(name: string, country: string) {
  const existing = await prisma.city.findFirst({ where: { name, country } });
  if (existing) return existing;

  const defaultDataSource = await prisma.dataSource.findFirst();
  if (!defaultDataSource) throw new Error("No DataSource found in DB. Run migrations first.");

  return prisma.city.create({
    data: {
      name,
      country,
      countryCode: country.substring(0, 2).toUpperCase(),
      popularityScore: Math.floor(Math.random() * 40 + 60),
      sourceDataSourceId: defaultDataSource.id,
    },
  });
}

async function main() {
  console.log("🌍 Starting GlobeTrotter demo seed...\n");

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 1. Create or update demo users
  const createdUsers = [];
  for (const userData of USERS) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        passwordHash: hashedPassword,
        emailVerified: true,
        status: "ACTIVE",
        role: "USER",
      },
    });
    createdUsers.push(user);
    console.log(`✅ User: ${user.email}`);
  }

  // 2. Create trips, stops, and share tokens
  const createdTrips = [];
  for (const userTripsData of TRIPS_DATA) {
    const owner = createdUsers[userTripsData.userIdx];

    for (const tripData of userTripsData.trips) {
      // Check if trip already exists for this user
      const existingTrip = await prisma.trip.findFirst({
        where: { userId: owner.id, name: tripData.name, deletedAt: null },
      });

      const trip = existingTrip ?? await prisma.trip.create({
        data: {
          userId: owner.id,
          name: tripData.name,
          description: tripData.description,
          coverImageUrl: tripData.coverImageUrl,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          visibility: tripData.visibility,
          status: tripData.status,
          currency: tripData.currency,
        },
      });

      console.log(`  📍 Trip: "${trip.name}" (${owner.firstName})`);

      // Create stops
      for (const stopData of tripData.stops) {
        const city = await upsertCity(stopData.cityName, stopData.country);

        await prisma.tripStop.upsert({
          where: { tripId_cityId: { tripId: trip.id, cityId: city.id } },
          update: {},
          create: {
            tripId: trip.id,
            cityId: city.id,
            sequence: stopData.sequence,
            arrivalDate: stopData.arrivalDate,
            departureDate: stopData.departureDate,
          },
        });
      }

      // Create share token for each public trip
      const shareToken = `demo-${owner.username}-${trip.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 30)}`;
      await prisma.tripShare.upsert({
        where: { shareToken },
        update: {},
        create: {
          tripId: trip.id,
          createdByUserId: owner.id,
          shareToken,
          permission: "VIEW",
        },
      });

      createdTrips.push({ trip, owner });
    }
  }

  // 3. Cross-like trips between users
  console.log("\n❤️  Adding community likes...");
  for (let i = 0; i < createdTrips.length; i++) {
    const { trip } = createdTrips[i];
    // Other users like each trip
    for (let j = 0; j < createdUsers.length; j++) {
      if (createdUsers[j].id !== createdTrips[i].owner.id) {
        await prisma.tripLike.upsert({
          where: { tripId_userId: { tripId: trip.id, userId: createdUsers[j].id } },
          update: {},
          create: { tripId: trip.id, userId: createdUsers[j].id },
        });
      }
    }
  }

  console.log("\n✅ Demo seed complete!\n");
  console.log("Demo credentials (all use password: Demo1234!):");
  for (const u of USERS) {
    console.log(`  📧 ${u.email}`);
  }
  console.log("\nAdmin credentials:");
  console.log("  📧 admin@globetrotter.com / AdminPassword123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
