# Trading Copy Application

A web-based trading application that enables users to discover, follow, and copy trades from influential traders.

## Features

- **User Authentication**: Email/password and OAuth (Google, Apple) authentication
- **Trader Discovery**: Browse and search for influential traders with performance metrics
- **Real-time Stock Data**: Live stock prices and historical charts
- **Trade Copying**: Review and manually approve trades from followed traders
- **Dashboard**: Portfolio summary, pending approvals, and recent activity
- **Notifications**: Real-time notifications for new trades and updates

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL with Sequelize ORM
- JWT authentication
- Socket.io for real-time updates
- Jest for testing

### Frontend
- React with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API calls
- Socket.io-client for WebSocket connections
- Recharts for data visualization

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and API keys:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_copy_app
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
STOCK_API_KEY=your-stock-api-key
```

5. Create the PostgreSQL database:
```sql
CREATE DATABASE trading_copy_app;
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file if needed (default should work):
```env
VITE_API_URL=http://localhost:3001/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
.
├── backend/
│   ├── config/          # Database and configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth and validation middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   └── utils/           # Utility functions
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── layouts/    # Layout components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── utils/      # Utility functions
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Traders
- `GET /api/traders` - List traders with filters
- `GET /api/traders/:id` - Get trader details
- `GET /api/traders/:id/trades` - Get trader's trades
- `POST /api/traders/:id/follow` - Follow a trader
- `DELETE /api/traders/:id/follow` - Unfollow a trader

### Trades
- `GET /api/trades` - Get trades from followed traders
- `GET /api/trades/:id` - Get trade details
- `POST /api/trades/:id/copy` - Copy a trade
- `GET /api/trades/copied` - Get user's copied trades

### Stock Data
- `GET /api/stock/:symbol` - Get current stock price
- `GET /api/stock/:symbol/history` - Get historical data
- `GET /api/stock/search` - Search stocks

### Dashboard
- `GET /api/dashboard` - Get dashboard summary
- `GET /api/dashboard/portfolio` - Get portfolio performance

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Development

- Backend uses `nodemon` for auto-reload during development
- Frontend uses Vite's hot module replacement
- Database models will auto-sync in development mode

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## License

MIT

