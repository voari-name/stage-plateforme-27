
# Stagiaires Management Backend API

Backend API for the Stagiaires Management Platform built with Express, MongoDB, and JWT Authentication.

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the server with `npm run dev`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user (requires auth)

### Stagiaires

- `GET /api/stagiaires` - Get all stagiaires (requires auth)
- `GET /api/stagiaires/:id` - Get stagiaire by ID (requires auth)
- `POST /api/stagiaires` - Create a stagiaire (requires auth)
- `PUT /api/stagiaires/:id` - Update a stagiaire (requires auth)
- `DELETE /api/stagiaires/:id` - Delete a stagiaire (requires auth)

### Evaluations

- `GET /api/evaluations` - Get all evaluations (requires auth)
- `GET /api/evaluations/:id` - Get evaluation by ID (requires auth)
- `GET /api/evaluations/stagiaire/:stagiaireId` - Get evaluations by stagiaire ID (requires auth)
- `POST /api/evaluations` - Create an evaluation (requires auth)
- `PUT /api/evaluations/:id` - Update an evaluation (requires auth)
- `DELETE /api/evaluations/:id` - Delete an evaluation (requires auth)

### Missions

- `GET /api/missions` - Get all missions (requires auth)
- `GET /api/missions/:id` - Get mission by ID (requires auth)
- `GET /api/missions/stagiaire/:stagiaireId` - Get missions by stagiaire ID (requires auth)
- `POST /api/missions` - Create a mission (requires auth)
- `PUT /api/missions/:id` - Update a mission (requires auth)
- `POST /api/missions/:id/assign` - Assign stagiaires to a mission (requires auth)
- `PUT /api/missions/:id/progress` - Update mission progress (requires auth)
- `DELETE /api/missions/:id` - Delete a mission (requires auth)
