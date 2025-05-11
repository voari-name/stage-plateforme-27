
# MTEFOP Formation Pro Platform

A professional platform for managing trainees, evaluations, missions and projects.

## Features

- Multi-language support (French, English, Malagasy)
- Dark/Light mode with brightness control
- User authentication and profile management
- Trainee management
- Evaluations system
- Project and mission management
- Responsive design

## Tech Stack

### Frontend:
- React with TypeScript
- React Router for navigation
- Tanstack Query for data fetching
- Tailwind CSS for styling
- Shadcn UI for UI components
- Lucide React for icons

### Backend:
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB installed locally or a MongoDB Atlas account

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd mtefop-formation-pro
```

2. Install dependencies for both frontend and backend:
```
npm install
cd server
npm install
cd ..
```

3. Configure environment variables:
- Copy `server/.env.example` to `server/.env` and update the values as needed
- Make sure MongoDB is running

4. Start the backend server:
```
cd server
npm run dev
```

5. Start the frontend development server:
```
# In another terminal
npm run dev
```

6. Access the application at: `http://localhost:5173`

## Default Login Credentials

- Username: RAHAJANIAINA
- Password: olivier

## Development

The project structure is organized as follows:

- `/src` - Frontend React application
  - `/components` - Reusable UI components
  - `/pages` - Main application pages
  - `/lib` - Utilities and hooks
  - `/hooks` - Custom React hooks
  - `/utils` - Helper functions

- `/server` - Backend Node.js application
  - `/controllers` - API route controllers
  - `/models` - Mongoose data models
  - `/routes` - API routes
  - `/middleware` - Express middleware
  - `/utils` - Helper utilities

## Deployment

To deploy the application:

1. Build the frontend:
```
npm run build
```

2. Set environment variables for production in the server's .env file
3. Start the server in production mode:
```
cd server
NODE_ENV=production npm start
```

## License

[MIT](LICENSE)
