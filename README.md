# 🌍 GlobeTrotter

GlobeTrotter is a comprehensive travel itinerary planning, budgeting, and community-sharing application. It allows travellers to plan trips day-by-day, track estimated vs. actual expenses across various categories, view their travel schedules on a calendar, and share their itineraries publicly with a community of fellow explorers.

## 📋 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Architecture](#-architecture)
4. [Database Schema](#-database-schema)
5. [Tech Stack](#-tech-stack)
6. [Getting Started](#-getting-started)
7. [Project Structure](#-project-structure)

## 📖 Overview
GlobeTrotter simplifies the complexity of trip planning. From mapping out multiple destinations and scheduling daily activities, to keeping a strict eye on transportation and accommodation budgets, everything is integrated into one seamless dashboard. Users can explore public itineraries from others, like/comment on community trips, and clone them for their own use.

## ✨ Key Features
- **Itinerary Builder**: Multi-stop trip planning with day-by-day drag-and-drop activity scheduling. Integration with OpenStreetMap for discovering real locations.
- **Budget Tracking**: Granular budget breakdowns across Transport, Accommodation, Activity, Food, and Other categories.
- **Interactive Calendar**: A global calendar view showing all upcoming and past trips with color-coordinated themes.
- **Community Feed**: Discover trips published by other users, like, comment, and view their full itineraries.
- **Dashboard Analytics**: Top-level overview of travel statistics, total spent vs. estimated budgets, and recommended destinations.

## 🏗️ Architecture

Below is the high-level system architecture of GlobeTrotter.

`mermaid
graph TD
    %% Define styles
    classDef client fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef server fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef db fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px,stroke-dasharray: 5 5;

    %% Nodes
    Client((Web Client<br/>Next.js React App)):::client
    Server[Express Backend API<br/>Node.js]:::server
    Postgres[(PostgreSQL<br/>Aiven Cloud)]:::db
    Prisma{Prisma ORM}:::server
    Nominatim[OpenStreetMap / Nominatim API]:::external

    %% Edges
    Client -->|HTTP / REST| Server
    Server -->|Queries| Prisma
    Prisma -->|TCP / SSL| Postgres
    Server -->|Location Search| Nominatim
`

## 🗄️ Database Schema

The core domain revolves around Users, Trips, Stops, Activities, and Budgets.

`mermaid
erDiagram
    USER ||--o{ TRIP : "creates"
    USER ||--o{ TRIP_LIKE : "likes"
    USER ||--o{ TRIP_COMMENT : "comments"

    TRIP ||--o| TRIP_BUDGET : "has"
    TRIP ||--o{ TRIP_STOP : "contains"
    TRIP ||--o{ TRIP_LIKE : "receives"
    TRIP ||--o{ EXPENSE : "tracks"

    TRIP_STOP ||--|| CITY : "located in"
    TRIP_STOP ||--o{ ITINERARY_ITEM : "schedules"

    ITINERARY_ITEM ||--o| ACTIVITY : "references"
    ITINERARY_ITEM ||--o{ EXPENSE : "generates"

    CITY ||--o{ ACTIVITY : "offers"

    USER {
        uuid id PK
        string email
        string username
        string role
    }
    TRIP {
        uuid id PK
        string name
        date startDate
        date endDate
        string visibility
    }
    TRIP_BUDGET {
        uuid id PK
        decimal totalBudget
        decimal transportBudget
    }
    TRIP_STOP {
        uuid id PK
        int sequence
        date arrivalDate
        date departureDate
    }
    ITINERARY_ITEM {
        uuid id PK
        string title
        datetime startTime
        decimal estimatedCost
    }
    ACTIVITY {
        uuid id PK
        string name
        string category
    }
    EXPENSE {
        uuid id PK
        decimal amount
        string category
    }
`
*(For the full Prisma schema definitions, please refer to [schemas.md](./schemas.md))*

## 💻 Tech Stack
- **Frontend**: Next.js (App Router), React 19, TypeScript, CSS Modules/Custom Props, Lucide Icons, Recharts.
- **Backend**: Node.js, Express, TypeScript, Zod (Validation), JSON Web Tokens (Auth).
- **Database**: PostgreSQL (hosted on Aiven), Prisma ORM.
- **Monorepo**: TurboRepo (npm workspaces).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or an Aiven cloud DB string)
- npm or yarn

### Installation
1. **Clone the repository**
   ``bash
   git clone https://github.com/koffandaff/GlobeTrotter.git
   cd GlobeTrotter
   ``

2. **Install dependencies**
   ``bash
   npm install
   ``

3. **Set up Environment Variables**
   - In pps/express, create a .env file:
     ``env
     PORT=4000
     NODE_ENV=development
     DATABASE_URL="postgres://<user>:<password>@<host>:<port>/defaultdb?sslmode=require&connection_limit=3&pool_timeout=30"
     JWT_SECRET="your_super_secret_key"
     ``
   - In pps/frontend, create a .env.local file:
     ``env
     NEXT_PUBLIC_API_URL="http://localhost:4000/api"
     ``

4. **Initialize the Database**
   ``bash
   cd apps/express
   npx prisma generate
   npx prisma db push
   npm run seed
   ``

5. **Run the Development Servers**
   From the root of the project:
   ``bash
   npm run dev
   ``
   - Frontend runs on: http://localhost:3000
   - Backend API runs on: http://localhost:4000

## 📁 Project Structure

``text
GlobeTrotter/
├── apps/
│   ├── express/                 # Node.js + Express Backend
│   │   ├── prisma/              # DB Schema and Migrations
│   │   └── src/
│   │       ├── core/            # Auth, Middleware, Error Handling
│   │       └── modules/         # Domain Modules (trips, budget, community)
│   └── frontend/                # Next.js Frontend
│       ├── app/                 # Next.js App Router Pages
│       ├── components/          # Shared UI Components
│       ├── features/            # Feature-based Components (itinerary, calendar)
│       └── lib/                 # Utilities and API Client
├── package.json                 # Monorepo Workspaces Configuration
└── schemas.md                   # Full database schema export
``
