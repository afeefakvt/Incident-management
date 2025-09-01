# 🚗 Incident Management System

An incident tracking and management system built with **Next.js (App Router)**, **NeonDB (PostgreSQL)**, and **Prisma ORM**.  
It allows drivers to report incidents, fleet managers to assign and track them, and admins to oversee the system.  
Validation is handled with **Zod**, and data fetching with **TanStack Query**.
This is a machine test mainly done for a developer role as per their requirements.

---

## 📖 Features

- User roles: Driver, Fleet Manager, Admin  
- Report, assign, and update incidents  
- Prisma ORM with NeonDB (PostgreSQL)  
- REST API endpoints built with Next.js API routes  
- Zod validation  
- TanStack Query for frontend data fetching & caching  
- Cloudinary Storage for client-side image uploads  

---

## ⚙️ Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/afeefakvt/incident-management.git
cd incident-management
```
### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

Create a .env file in the project root:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 4. Run database migrations
```bash
npx prisma migrate dev
```

### 5. Generate Prisma client
```bash
npx prisma generate
```
### 6. Seed the database
```bash
npx prisma db seed
```
### 7. Start the app (development)
```bash
npm run dev
```

## 🗄️ Database Schema (Prisma)
### User

id (Int, Primary Key, Auto Increment)

name (String)

email (Unique String)

role (Enum: DRIVER, FLEET_MANAGER, ADMIN)

createdAt, updatedAt


### Car

id (Int, PK)

licensePlate (String, Unique)

model (String)

assignedTo (User FK)

### Incident

id (Int, PK)

title (String)

description (String)

severity (Enum: LOW, MEDIUM, HIGH, CRITICAL)

status (Enum: PENDING, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED)

type (Enum: ACCIDENT, BREAKDOWN, THEFT, VANDALISM, MAINTENANCE_ISSUE, TRAFFIC_VIOLATION, FUEL_ISSUE)

reporterId (User FK → DRIVER)

assigneeId (User FK → FLEET_MANAGER)

occurredAt (DateTime)

location, latitude, longitude

images, documents

estimatedCost (Float)

createdAt, updatedAt

IncidentUpdate

id (Int, PK)

incidentId (FK → Incident)

userId (FK → User)

updateText (String)

createdAt

## 📌 API Documentation

### 🚨 Incidents

POST /api/incidents → Report new incident

GET /api/incidents → Get all incidents

GET /api/incidents/:id → Get incident details

PUT /api/incidents/:id → Update incident

POST /api/incidents/:id/updates → Post Incident Update Comment


## 🚀 Deployment (Vercel)

Push code to GitHub

Import repo in Vercel

Set environment variables in Vercel dashboard (DATABASE_URL)

Ensure prisma generate run during build


## ✅ Notes

Make sure NeonDB connection pooling is enabled for Prisma.

Seeding is only needed once per environment (dev/prod).

Local dev uses npm run dev with Hot Reloading.
