# CodoTrack

Coding practice tracker with React frontend and Node.js + Express + MongoDB backend.

## Current Status (Backend Branch)

This README reflects work implemented so far on the backend branch.

### Implemented

- Express server bootstrap with centralized app and server files
- MongoDB connection via Mongoose
- Environment loading with dotenv
- Global not-found and error middleware
- Authentication APIs
  - POST /api/auth/register
  - POST /api/auth/login
- JWT utility and auth protection middleware
- Basic auth input validation middleware
- Problem system APIs (protected)
  - GET /api/problems
  - POST /api/problems
  - PUT /api/problems/:id
  - DELETE /api/problems/:id
- Problem model fields: user, title, platform, difficulty, status, tags, notes, solutionLink
- Points system foundation
  - totalPoints in user model
  - points increment when a problem changes to Solved

### In Progress / Not Fully Exposed Yet

- Streak fields are present in local working tree but not fully wired into APIs
- Reminder utilities and cron/email helper files exist, but reminder preference APIs are not yet implemented

## Frontend Compatibility Check

### Working with current backend

- Auth flow endpoints used by frontend are available:
  - /api/auth/register
  - /api/auth/login
- Core problems CRUD used by Problems/Add pages is available:
  - /api/problems (GET, POST)
  - /api/problems/:id (PUT, DELETE)

### Missing for full frontend compatibility

- GET /api/problems/:id
- GET /api/problems/stats
- GET /api/badges
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/reminder-pref
- PATCH /api/users/reminder-pref

Until these are added, Dashboard, Profile, Badges, and reminder toggle sections will not fully function.

## Project Structure

```text
CodeTrack/
├── frontend/
└── backend/
        ├── src/
        │   ├── app.js
        │   ├── server.js
        │   ├── config/
        │   │   └── db.js
        │   ├── controllers/
        │   │   ├── authController.js
        │   │   └── problemController.js
        │   ├── middleware/
        │   │   ├── authMiddleware.js
        │   │   ├── errorHandler.js
        │   │   └── validateInput.js
        │   ├── models/
        │   │   ├── User.js
        │   │   ├── Problem.js
        │   │   └── UserProblem.js
        │   ├── routes/
        │   │   ├── authRoutes.js
        │   │   └── problemRoutes.js
        │   └── utils/
        │       ├── generateToken.js
        │       └── progressCalculator.js
        ├── jobs/
        └── utils/
```

## Environment Variables

Backend (.env):

- PORT
- NODE_ENV
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASS
- FRONTEND_URL

Frontend (.env):

- VITE_API_BASE_URL (default expected: http://localhost:5000/api)
- VITE_APP_NAME
- VITE_APP_VERSION

## Run Locally

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Next Backend Work (for full frontend support)

- Add stats endpoint for dashboard data aggregation
- Add user profile read/update endpoints
- Add reminder preference read/update endpoints
- Add badges endpoint
- Add problem by id endpoint
