import http from "http";
import app from "../src/app";
import { prisma } from "../src/shared/prisma";

const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}/api`;

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
  details?: unknown;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, passed: true, durationMs: Date.now() - start });
    console.log(`  ✅ PASS: ${name} (${Date.now() - start}ms)`);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    results.push({
      name,
      passed: false,
      durationMs: Date.now() - start,
      error: errorMsg,
    });
    console.error(`  ❌ FAIL: ${name} (${Date.now() - start}ms) -> ${errorMsg}`);
  }
}

async function request(
  endpoint: string,
  options: {
    method?: string;
    token?: string;
    body?: unknown;
  } = {}
) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  return {
    status: res.status,
    ok: res.ok,
    body: json,
  };
}

async function runAllTests() {
  console.log("\n========================================================");
  console.log("🚀 STARTING GLOBETROTTER BACKEND END-TO-END TEST SUITE");
  console.log("========================================================\n");

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(PORT, resolve));

  const testEmail = `test.user.${Date.now()}@globetrotter.test`;
  const testPassword = "Password123!";
  let accessToken = "";
  let createdTripId = "";
  let createdStopId = "";
  let testCityId = "";

  try {
    // 1. Health Endpoint
    await test("Health Endpoint (GET /health)", async () => {
      const res = await request(`http://localhost:${PORT}/health`);
      if (res.status !== 200 || res.body.status !== "ok") {
        throw new Error(`Expected 200 ok, got ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 2. Auth: Register
    await test("Auth: Register (POST /api/v1/auth/register)", async () => {
      const res = await request("/auth/register", {
        method: "POST",
        body: {
          firstName: "John",
          lastName: "Doe",
          displayName: "TravelerJohn",
          email: testEmail,
          password: testPassword,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(`Register failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 3. Auth: Login
    await test("Auth: Login (POST /api/v1/auth/login)", async () => {
      const res = await request("/auth/login", {
        method: "POST",
        body: {
          email: testEmail,
          password: testPassword,
        },
      });

      if (!res.ok) {
        throw new Error(`Login failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }

      const token =
        res.body?.data?.tokens?.accessToken ||
        res.body?.data?.accessToken ||
        res.body?.accessToken;
      if (!token) {
        throw new Error(`Access token missing from login response: ${JSON.stringify(res.body)}`);
      }
      accessToken = token;
    });

    // 4. User Profile: Get Me
    await test("User Profile: Get Current User (GET /api/v1/users/me)", async () => {
      const res = await request("/users/me", { token: accessToken });
      if (!res.ok) {
        throw new Error(`Get me failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
      const data = res.body.data || res.body;
      if (data.email !== testEmail) {
        throw new Error(`Expected email ${testEmail}, got ${data.email}`);
      }
    });

    // 5. Dashboard Aggregation
    await test("Dashboard: Get Home Feed (GET /api/v1/dashboard)", async () => {
      const res = await request("/dashboard", { token: accessToken });
      if (!res.ok) {
        throw new Error(`Dashboard failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 6. Cities: Search / List
    await test("Cities: Search & List (GET /api/v1/cities)", async () => {
      const res = await request("/cities?limit=5", { token: accessToken });
      if (!res.ok) {
        throw new Error(`List cities failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
      const list = res.body?.data || [];
      if (list.length > 0) {
        testCityId = list[0].id;
      }
    });

    // 7. Cities: Popular Destinations
    await test("Cities: Popular Suggestions (GET /api/v1/cities/popular)", async () => {
      const res = await request("/cities/popular?limit=5", { token: accessToken });
      if (!res.ok) {
        throw new Error(`Popular cities failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // If no seeded city found, ensure a dummy city exists for foreign keys
    if (!testCityId) {
      let ds = await prisma.dataSource.findFirst();
      if (!ds) {
        ds = await prisma.dataSource.create({
          data: { code: "SEED", name: "Seed Data", type: "SYSTEM" },
        });
      }
      const city = await prisma.city.create({
        data: {
          sourceDataSourceId: ds.id,
          name: "Tokyo",
          country: "Japan",
          countryCode: "JP",
          popularityScore: 95,
        },
      });
      testCityId = city.id;
    }

    // 8. Cities: Detail View
    await test(`Cities: Detail View (GET /api/v1/cities/${testCityId})`, async () => {
      const res = await request(`/cities/${testCityId}`, { token: accessToken });
      if (!res.ok) {
        throw new Error(`City detail failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 9. Activities: Filtered Search
    await test("Activities: Search & Filter (GET /api/v1/activities)", async () => {
      const res = await request(`/activities?cityId=${testCityId}`, { token: accessToken });
      if (!res.ok) {
        throw new Error(`Activities list failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 10. Module 4: Trips - Create Trip
    await test("Trips: Create New Trip (POST /api/v1/trips)", async () => {
      const res = await request("/trips", {
        method: "POST",
        token: accessToken,
        body: {
          name: "Japan Explorer 2026",
          description: "A wonderful test trip across Tokyo and Kyoto",
          startDate: new Date("2026-09-01T00:00:00.000Z").toISOString(),
          endDate: new Date("2026-09-10T00:00:00.000Z").toISOString(),
          currency: "USD",
          totalBudget: 3500,
        },
      });

      if (!res.ok) {
        throw new Error(`Create trip failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }

      const data = res.body?.data || res.body;
      createdTripId = data.id;
      if (!createdTripId) throw new Error("Created trip id is missing");
    });

    // 11. Module 4: Trips - List Trips
    await test("Trips: List User Trips (GET /api/v1/trips)", async () => {
      const res = await request("/trips?page=1&limit=10", { token: accessToken });
      if (!res.ok) {
        throw new Error(`List trips failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
      const data = res.body?.data || [];
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Expected at least 1 trip in list");
      }
    });

    // 12. Module 4: Trips - Get Trip Detail
    await test(`Trips: Get Single Trip (GET /api/v1/trips/${createdTripId})`, async () => {
      const res = await request(`/trips/${createdTripId}`, { token: accessToken });
      if (!res.ok) {
        throw new Error(`Get trip failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 13. Module 4: Trips - Update Trip
    await test(`Trips: Update Trip Details (PATCH /api/v1/trips/${createdTripId})`, async () => {
      const res = await request(`/trips/${createdTripId}`, {
        method: "PATCH",
        token: accessToken,
        body: {
          name: "Japan Explorer 2026 (Updated)",
          description: "Updated notes",
        },
      });
      if (!res.ok) {
        throw new Error(`Update trip failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 14. Module 5: Trip Stops - Add Stop
    await test(`Trip Stops: Add Stop (POST /api/v1/trips/${createdTripId}/stops)`, async () => {
      const res = await request(`/trips/${createdTripId}/stops`, {
        method: "POST",
        token: accessToken,
        body: {
          cityId: testCityId,
          arrivalDate: new Date("2026-09-01T00:00:00.000Z").toISOString(),
          departureDate: new Date("2026-09-05T00:00:00.000Z").toISOString(),
          notes: "First stop in Tokyo",
        },
      });

      if (!res.ok) {
        throw new Error(`Add stop failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }

      const data = res.body?.data || res.body;
      createdStopId = data.id;
      if (!createdStopId) throw new Error("Created stop id is missing");
    });

    // 15. Module 5: Trip Stops - List Stops
    await test(`Trip Stops: List Stops (GET /api/v1/trips/${createdTripId}/stops)`, async () => {
      const res = await request(`/trips/${createdTripId}/stops`, { token: accessToken });
      if (!res.ok) {
        throw new Error(`List stops failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 16. Module 5: Trip Stops - Update Stop
    await test(`Trip Stops: Update Stop Dates (PATCH /api/v1/stops/${createdStopId})`, async () => {
      const res = await request(`/stops/${createdStopId}`, {
        method: "PATCH",
        token: accessToken,
        body: {
          notes: "Updated stop notes",
        },
      });
      if (!res.ok) {
        throw new Error(`Update stop failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    // 17. Module 10: Budget - Get Budget Breakdown
    await test(`Budget: Computed Breakdown (GET /api/v1/trips/${createdTripId}/budget)`, async () => {
      const res = await request(`/trips/${createdTripId}/budget`, { token: accessToken });
      if (!res.ok) {
        throw new Error(`Get budget failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
      const data = res.body?.data || res.body;
      if (data.tripId !== createdTripId) {
        throw new Error(`Expected tripId ${createdTripId}, got ${data.tripId}`);
      }
      if (!data.categories?.food || !data.categories?.transport) {
        throw new Error("Expected categories breakdown in budget response");
      }
    });

    // 18. Module 10: Budget - Update Category Budget
    await test(`Budget: Set Category Allocation (PATCH /api/v1/trips/${createdTripId}/budget/food)`, async () => {
      const res = await request(`/trips/${createdTripId}/budget/food`, {
        method: "PATCH",
        token: accessToken,
        body: {
          amount: 600,
        },
      });
      if (!res.ok) {
        throw new Error(`Update category budget failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
      const data = res.body?.data || res.body;
      if (data.categories?.food?.allocated !== 600) {
        throw new Error(`Expected food allocated 600, got ${data.categories?.food?.allocated}`);
      }
    });

    // 19. Module 4: Trips - Duplicate Trip
    let duplicatedTripId = "";
    await test(`Trips: Deep Clone Trip (POST /api/v1/trips/${createdTripId}/duplicate)`, async () => {
      const res = await request(`/trips/${createdTripId}/duplicate`, {
        method: "POST",
        token: accessToken,
      });

      if (!res.ok) {
        throw new Error(`Duplicate trip failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }

      const data = res.body?.data || res.body;
      duplicatedTripId = data.id;
      if (!duplicatedTripId || duplicatedTripId === createdTripId) {
        throw new Error("Duplicated trip id should be a new distinct id");
      }
    });

    // 20. Cleanup: Delete Trips
    await test(`Trips: Delete Trip (DELETE /api/v1/trips/${createdTripId})`, async () => {
      const res = await request(`/trips/${createdTripId}`, {
        method: "DELETE",
        token: accessToken,
      });
      if (!res.ok) {
        throw new Error(`Delete trip failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
    });

    if (duplicatedTripId) {
      await test(`Trips: Delete Duplicate Trip (DELETE /api/v1/trips/${duplicatedTripId})`, async () => {
        const res = await request(`/trips/${duplicatedTripId}`, {
          method: "DELETE",
          token: accessToken,
        });
        if (!res.ok) {
          throw new Error(`Delete duplicate failed with status ${res.status}: ${JSON.stringify(res.body)}`);
        }
      });
    }

    // 21. Cleanup: Delete test user
    await prisma.user.delete({ where: { email: testEmail } }).catch(() => {});
  } finally {
    server.close();
    await prisma.$disconnect();
  }

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log("\n========================================================");
  console.log(`📊 TEST SUITE SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  if (failedCount > 0) {
    console.log("\n❌ FAILED TESTS:");
    results.filter(r => !r.passed).forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
  console.log("========================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
