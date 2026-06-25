# ActiveCheck — Server

Backend API for **ActiveCheck**, a fitness app that connects trainees and coaches.
Built with Node.js, Express and MongoDB (Mongoose).

## Tech stack

- Node.js + Express 4 (CommonJS)
- MongoDB Atlas + Mongoose
- Structure: `routers/` → `controllers/` → `models/`
- Manual CORS middleware, minimal token auth (bcryptjs)

## Project structure

```
activecheck-server/
├── index.js            # app setup, DB connection, route mounting
├── routers/            # one express.Router() per resource
├── controllers/        # request handlers
├── models/             # Mongoose schemas
├── middleware/         # cors + auth
├── .env.example        # sample environment variables
└── package.json
```

## Environment variables

Create a `.env` file in the project root (see `.env.example`):

```
PORT=8080
MONGO_URI=<your MongoDB Atlas connection string>
```

## Run locally

```bash
npm install
npm run dev      # nodemon
# or
npm start        # node index.js
```

The server starts on `http://localhost:8080`. Health check: `GET /api/health`.

## Deploy (Render)

1. Push this repo to GitHub.
2. Render → New → Web Service → connect the repo.
3. Build Command: `npm install` · Start Command: `node index.js`
4. Add environment variable `MONGO_URI` (and optionally `PORT`).
5. In MongoDB Atlas, allow network access from anywhere (`0.0.0.0/0`).

## API overview

Base path: `/api`. Protected routes require an `Authorization: Bearer <token>` header.

| Resource | Routes |
|----------|--------|
| Users | `POST /users/register`, `POST /users/login`, `POST /users/logout`, `GET/PUT /users/me`, `GET /users/coaches` |
| Workouts | `GET/POST /workouts`, `GET/PUT/DELETE /workouts/:id`, `GET /workouts/stats` |
| Measurements | `GET/POST /measurements`, `DELETE /measurements/:id` |
| Requests | `POST /requests`, `GET /requests/pending`, `GET /requests/my-trainees`, `GET /requests/trainee/:id`, `PUT /requests/:id` |
| Programs | `GET/POST /programs`, `PUT/DELETE /programs/:id` |

## Group members

- Omer Labinsky
- Alex Tkachenkov
