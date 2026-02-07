# Assignment 01: Me-API Playground (MERN Stack)

A professional personal profile API and frontend dashboard for Rajmangal Tiwari.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Lucide Icons, Plus Jakarta Sans
- **Backend**: Node.js, Express, Mongoose
- **Database**: Local MongoDB

## Setup Instructions

### 1. Prerequisites

- Node.js installed
- MongoDB installed and running locally on `localhost:27017`

### 2. Backend Setup

```bash
cd backend
npm install
node seed.js  # Seeds the database with Rajmangal's data
npm run dev   # Starts server on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev   # Starts Vite app on http://localhost:5173
```

## API Endpoints

- `GET /health`: Health check
- `GET /api/profile`: Get full profile
- `GET /api/projects?skill=...`: Query projects by skill
- `GET /api/skills/top`: Get top skills
- `GET /api/search?q=...`: Search across profile data

## Resume Link

[Rajmangal Tiwari - Resume](https://example.com/resume-link)
