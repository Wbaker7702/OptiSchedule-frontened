# OptiSchedule API

Backend API for OptiSchedule Pro, built with Node.js, Express, and Prisma.
This service is currently intended for Walmart-only internal use.

## Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)

## Project Structure

```text
.
├── config/
│   └── env.js
├── middleware/
│   └── auth.js
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── routes/
│   ├── auth.js
│   └── shifts.js
├── rules/
│   ├── index.js
│   ├── MI.js
│   ├── mi.js
│   └── server.js
├── server.js
├── seed.js
└── FL.js
```

## Available Routes

Route paths (base URL is environment-specific):

- `GET /health`  
  Returns API health status.

- `GET /api/protected`  
  Test protected route response.

- `GET /api/shifts/test`  
  Test shift route wiring.

- `POST /api/shifts`  
  Echo endpoint for shift POST payload testing.

## Notes

- `routes/auth.js` and `middleware/auth.js` are present, but auth routes are not currently mounted in `server.js`.
- State compliance rule engines are located in `rules/` (for example, `MI.js` and `FL.js`).
