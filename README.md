# Concert Ticket Master

A full-stack concert ticket booking application built with NextJS (frontend) and NestJS (backend). The application allows admins to manage concerts and users to book tickets.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Running Unit Tests](#running-unit-tests)
- [API Documentation](#api-documentation)
- [Libraries](#libraries--packages)
- [Business Rules](#business-rules)

## Features

### Admin Features
- Create new concerts
- View all concerts
- Delete concerts (only if no active reservations)
- View booking history


### User Features
- View available seats per concert
- Reserve one seat per concert
- View booking history
- Cancel reservations

## Tech Stack

### Frontend
- **NextJS 16.1.6** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Port**: 3000

### Backend
- **NestJS 11.x** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping for database operations
- **SQLite** - Lightweight relational database
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation utilities
- **Jest** - Testing framework
- **Port**: 4000

## Architecture Overview

### Frontend Architecture (NextJS)

```
frontend/
├── app/
│   ├── components/
│   │   └── Sidebar.tsx          
│   ├── user/
│   │   └── page.tsx             # User page booking
│   ├── history/
│   │   └── page.tsx             # Admin booking history view
│   ├── page.tsx                 # Admin dashboard (main page)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global css
└── package.json
```

### Backend Architecture (NestJS)

```
backend/
├── src/
│   ├── concerts/
│   │   ├── dto/
│   │   │   └── create-concert.dto.ts      # Validation schema
│   │   ├── entities/
│   │   │   └── concert.entity.ts          # Database model
│   │   ├── concerts.controller.ts         # HTTP endpoints
│   │   ├── concerts.service.ts            # Business logic
│   │   ├── concerts.service.spec.ts       # Unit tests
│   │   └── concerts.module.ts             # Module configuration
│   ├── reservations/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── reservations.controller.ts
│   │   ├── reservations.service.ts
│   │   ├── reservations.service.spec.ts
│   │   └── reservations.module.ts
│   ├── users/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.service.spec.ts
│   │   └── users.module.ts
│   ├── app.module.ts                      # Root module
│   └── main.ts                            # Application entry point
└── concert-tickets.db                     # SQLite database (auto-generated)
```

**Database Schema:**
```
┌─────────────┐         ┌──────────────┐         ┌─────────┐
│   Concert   │         │ Reservation  │         │  User   │
├─────────────┤         ├──────────────┤         ├─────────┤
│ id (PK)     │◄────┐   │ id (PK)      │   ┌────►│ id (PK) │
│ name        │     └───│ concertId(FK)│   │     │ name    │
│ description │         │ userId (FK)  │───┘     │ email   │
│ totalSeats  │         │ status       │         │ isAdmin │
│ reservedSeats         │ createdAt    │         │ createdAt
│ createdAt   │         └──────────────┘         └─────────┘
│ updatedAt   │
└─────────────┘
```

### Running the Backend

```bash
cd backend
npm run start
```

The API will be available at `http://localhost:4000`

### Development Mode

```bash
cd backend
npm run start:dev
```

## Getting Started

1. **Clone the repository**
   ```bash
   cd c:\Workspace\test\concert-ticket-master
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Run both applications**
   
   In one terminal:
   ```bash
   cd frontend
   npm run dev
   ```
   
   In another terminal:
   ```bash
   cd backend
   npm run start:dev
   ```

## Development

### Frontend Development
- The landing page is located in `frontend/app/page.tsx`
- Global styles are in `frontend/app/globals.css`
- Tailwind configuration is in `frontend/tailwind.config.ts`

### Backend Development
- Main application entry point: `backend/src/main.ts`
- App module: `backend/src/app.module.ts`
- Controllers and services are in the `backend/src/` directory

## Setup & Installation

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For cloning the repository

### Installation Steps

1. **Clone the Repository**
```bash
git clone 
cd concert-ticket-master
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```


## Running the Application

### Development Mode

1. **Start the Backend Server** (Terminal 1)
```bash
cd backend
npm run start:dev
```
The backend will be available at `http://localhost:4000`

2. **Start the Frontend Server** (Terminal 2)
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

3. **Access the Application**
- Admin page: `http://localhost:3000`
- User Page: `http://localhost:3000/user`
- Booking History: `http://localhost:3000/history`

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## Running Unit Tests

The backend includes comprehensive unit tests for all service layer CRUD operations.

### Run All Tests
```bash
cd backend
npm test
```

### Run Tests in Watch Mode
```bash
cd backend
npm run test:watch
```

### Run Tests with Coverage
```bash
cd backend
npm run test:cov
```

## API Documentation

### Base URL
```
http://localhost:4000
```

### Concerts Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/concerts` | Get all concerts | - |
| GET | `/concerts/:id` | Get concert by ID | - |
| POST | `/concerts` | Create new concert | `{ name, description, totalSeats }` |
| DELETE | `/concerts/:id` | Delete concert | - |

**Example: Create Concert**
```bash
curl -X POST http://localhost:4000/concerts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rock Festival 2026",
    "description": "An amazing rock music festival",
    "totalSeats": 100
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Rock Festival 2026",
  "description": "An amazing rock music festival",
  "totalSeats": 100,
  "reservedSeats": 0
}
```

### Users Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users | - |
| GET | `/users/:id` | Get user by ID | - |
| POST | `/users` | Create new user | `{ name, email }` |
| DELETE | `/users/:id` | Delete user | - |

**Example: Create User**
```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Reservations Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/reservations` | Get all reservations | - |
| GET | `/reservations/user/:userId` | Get user's reservations | - |
| POST | `/reservations` | Create reservation | `{ userId, concertId }` |
| PATCH | `/reservations/:id/cancel` | Cancel reservation | `{ userId }` |

**Example: Reserve Seat**
```bash
curl -X POST http://localhost:4000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "concertId": 1
  }'
```

**Example: Cancel Reservation**
```bash
curl -X PATCH http://localhost:4000/reservations/1/cancel \
  -H "Content-Type: application/json" \
  -d '{ "userId": 1 }'
```

### Libraries

**NestJS**

**TypeORM**: Provides a robust ORM layer with TypeScript support, allowing us to work with databases using object-oriented patterns. Supports migrations, relations, and query builders.

**SQLite**: Lightweight, serverless database perfect for development and small-scale applications. No separate database server setup required.

**class-validator & class-transformer**: Enable declarative validation rules directly on DTO classes, ensuring data integrity at the API boundary. Custom error messages provide clear feedback.

**Next.js**

**Tailwind CSS**

**Jest**

## Business Rules

### Reservation Rules
1. **One Seat Per User**: Each user can reserve maximum 1 seat per concert
2. **No Duplicate Reservations**: Users cannot reserve the same concert multiple times
3. **Seat Availability Check**: Reservations fail if concert is fully booked
4. **Cancellation Ownership**: Users can only cancel their own reservations
5. **Active Status Only**: Only active reservations count toward seat limits

### Concert Management Rules
1. **Deletion Restrictions**: Concerts can only be deleted if they have no active reservations
2. **Cancelled Reservations**: Concerts with only cancelled reservations can be deleted
3. **Seat Tracking**: Reserved seats automatically increment/decrement with bookings/cancellations
4. **Minimum Capacity**: Concerts must have at least 1 seat

### Validation Rules
1. **Concert Name**: Required, max 200 characters
2. **Concert Description**: Required, max 1000 characters
3. **Total Seats**: Required, minimum 1
4. **User Name**: Required, max 100 characters
5. **User Email**: Required, valid email format
6. **IDs**: Must be positive integers

## Error Handling

### Server-Side Validation
The backend provides detailed validation errors:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "errors": ["Concert name is required"]
    },
    {
      "field": "totalSeats",
      "errors": ["Total seats must be at least 1"]
    }
  ]
}
```
## Development Notes

### Hot Reload
Both frontend and backend support hot reload in development mode:
- Backend: `npm run start:dev`
- Frontend: `npm run dev`

### Database Management
- Database file: `backend/concert-tickets.db`
- Auto-created on first run
- Delete file to reset database
- Schema auto-synced (development only)

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for both frontend and backend
- **Prettier**: Code formatting rules
- **Testing**: Unit tests for all services
