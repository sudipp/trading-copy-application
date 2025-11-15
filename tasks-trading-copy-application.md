# Task List: Trading Copy Application

## Relevant Files

### Backend Files
- `backend/server.js` or `backend/index.js` - Main server entry point
- `backend/server.test.js` - Tests for server setup
- `backend/config/database.js` - Database connection configuration
- `backend/config/database.test.js` - Tests for database configuration
- `backend/models/User.js` - User model/schema
- `backend/models/User.test.js` - Tests for User model
- `backend/models/Trader.js` - Trader profile model/schema
- `backend/models/Trader.test.js` - Tests for Trader model
- `backend/models/Trade.js` - Trade model/schema
- `backend/models/Trade.test.js` - Tests for Trade model
- `backend/models/Follow.js` - User-Trader follow relationship model
- `backend/models/Follow.test.js` - Tests for Follow model
- `backend/models/CopiedTrade.js` - Copied trade model/schema
- `backend/models/CopiedTrade.test.js` - Tests for CopiedTrade model
- `backend/models/Notification.js` - Notification model/schema
- `backend/models/Notification.test.js` - Tests for Notification model
- `backend/routes/auth.js` - Authentication routes (login, register, OAuth)
- `backend/routes/auth.test.js` - Tests for authentication routes
- `backend/routes/traders.js` - Trader discovery and management routes
- `backend/routes/traders.test.js` - Tests for trader routes
- `backend/routes/trades.js` - Trade-related routes
- `backend/routes/trades.test.js` - Tests for trade routes
- `backend/routes/stockData.js` - Stock market data API routes
- `backend/routes/stockData.test.js` - Tests for stock data routes
- `backend/routes/dashboard.js` - Dashboard data routes
- `backend/routes/dashboard.test.js` - Tests for dashboard routes
- `backend/routes/notifications.js` - Notification routes
- `backend/routes/notifications.test.js` - Tests for notification routes
- `backend/controllers/authController.js` - Authentication business logic
- `backend/controllers/authController.test.js` - Tests for auth controller
- `backend/controllers/traderController.js` - Trader management business logic
- `backend/controllers/traderController.test.js` - Tests for trader controller
- `backend/controllers/tradeController.js` - Trade copying business logic
- `backend/controllers/tradeController.test.js` - Tests for trade controller
- `backend/controllers/stockDataController.js` - Stock data fetching logic
- `backend/controllers/stockDataController.test.js` - Tests for stock data controller
- `backend/middleware/auth.js` - Authentication middleware (JWT verification)
- `backend/middleware/auth.test.js` - Tests for auth middleware
- `backend/middleware/validation.js` - Input validation middleware
- `backend/middleware/validation.test.js` - Tests for validation middleware
- `backend/services/stockDataService.js` - Service for fetching stock data from external APIs
- `backend/services/stockDataService.test.js` - Tests for stock data service
- `backend/services/notificationService.js` - Service for sending notifications
- `backend/services/notificationService.test.js` - Tests for notification service
- `backend/services/oauthService.js` - OAuth provider integration service
- `backend/services/oauthService.test.js` - Tests for OAuth service
- `backend/utils/passwordUtils.js` - Password hashing and verification utilities
- `backend/utils/passwordUtils.test.js` - Tests for password utilities
- `backend/utils/jwtUtils.js` - JWT token generation and verification utilities
- `backend/utils/jwtUtils.test.js` - Tests for JWT utilities
- `backend/.env.example` - Example environment variables file
- `backend/package.json` - Backend dependencies and scripts
- `backend/.gitignore` - Git ignore file for backend

### Frontend Files
- `frontend/src/App.js` or `frontend/src/App.tsx` - Main application component
- `frontend/src/App.test.js` or `frontend/src/App.test.tsx` - Tests for App component
- `frontend/src/index.js` or `frontend/src/index.tsx` - Application entry point
- `frontend/src/components/auth/LoginForm.js` or `frontend/src/components/auth/LoginForm.tsx` - Login form component
- `frontend/src/components/auth/LoginForm.test.js` or `frontend/src/components/auth/LoginForm.test.tsx` - Tests for LoginForm
- `frontend/src/components/auth/RegisterForm.js` or `frontend/src/components/auth/RegisterForm.tsx` - Registration form component
- `frontend/src/components/auth/RegisterForm.test.js` or `frontend/src/components/auth/RegisterForm.test.tsx` - Tests for RegisterForm
- `frontend/src/components/auth/OAuthButton.js` or `frontend/src/components/auth/OAuthButton.tsx` - OAuth login button component
- `frontend/src/components/auth/OAuthButton.test.js` or `frontend/src/components/auth/OAuthButton.test.tsx` - Tests for OAuthButton
- `frontend/src/components/traders/TraderList.js` or `frontend/src/components/traders/TraderList.tsx` - List of traders component
- `frontend/src/components/traders/TraderList.test.js` or `frontend/src/components/traders/TraderList.test.tsx` - Tests for TraderList
- `frontend/src/components/traders/TraderCard.js` or `frontend/src/components/traders/TraderCard.tsx` - Individual trader card component
- `frontend/src/components/traders/TraderCard.test.js` or `frontend/src/components/traders/TraderCard.test.tsx` - Tests for TraderCard
- `frontend/src/components/traders/TraderProfile.js` or `frontend/src/components/traders/TraderProfile.tsx` - Trader profile detail component
- `frontend/src/components/traders/TraderProfile.test.js` or `frontend/src/components/traders/TraderProfile.test.tsx` - Tests for TraderProfile
- `frontend/src/components/traders/TraderFilters.js` or `frontend/src/components/traders/TraderFilters.tsx` - Trader search and filter component
- `frontend/src/components/traders/TraderFilters.test.js` or `frontend/src/components/traders/TraderFilters.test.tsx` - Tests for TraderFilters
- `frontend/src/components/trades/TradeReview.js` or `frontend/src/components/trades/TradeReview.tsx` - Trade review and approval component
- `frontend/src/components/trades/TradeReview.test.js` or `frontend/src/components/trades/TradeReview.test.tsx` - Tests for TradeReview
- `frontend/src/components/trades/TradeList.js` or `frontend/src/components/trades/TradeList.tsx` - List of trades component
- `frontend/src/components/trades/TradeList.test.js` or `frontend/src/components/trades/TradeList.test.tsx` - Tests for TradeList
- `frontend/src/components/trades/TradeCard.js` or `frontend/src/components/trades/TradeCard.tsx` - Individual trade card component
- `frontend/src/components/trades/TradeCard.test.js` or `frontend/src/components/trades/TradeCard.test.tsx` - Tests for TradeCard
- `frontend/src/components/stock/StockPrice.js` or `frontend/src/components/stock/StockPrice.tsx` - Real-time stock price display component
- `frontend/src/components/stock/StockPrice.test.js` or `frontend/src/components/stock/StockPrice.test.tsx` - Tests for StockPrice
- `frontend/src/components/stock/StockChart.js` or `frontend/src/components/stock/StockChart.tsx` - Stock price chart component
- `frontend/src/components/stock/StockChart.test.js` or `frontend/src/components/stock/StockChart.test.tsx` - Tests for StockChart
- `frontend/src/components/stock/StockSearch.js` or `frontend/src/components/stock/StockSearch.tsx` - Stock search component
- `frontend/src/components/stock/StockSearch.test.js` or `frontend/src/components/stock/StockSearch.test.tsx` - Tests for StockSearch
- `frontend/src/components/dashboard/Dashboard.js` or `frontend/src/components/dashboard/Dashboard.tsx` - Main dashboard component
- `frontend/src/components/dashboard/Dashboard.test.js` or `frontend/src/components/dashboard/Dashboard.test.tsx` - Tests for Dashboard
- `frontend/src/components/dashboard/PortfolioSummary.js` or `frontend/src/components/dashboard/PortfolioSummary.tsx` - Portfolio performance summary component
- `frontend/src/components/dashboard/PortfolioSummary.test.js` or `frontend/src/components/dashboard/PortfolioSummary.test.tsx` - Tests for PortfolioSummary
- `frontend/src/components/notifications/NotificationCenter.js` or `frontend/src/components/notifications/NotificationCenter.tsx` - Notification center component
- `frontend/src/components/notifications/NotificationCenter.test.js` or `frontend/src/components/notifications/NotificationCenter.test.tsx` - Tests for NotificationCenter
- `frontend/src/components/notifications/NotificationItem.js` or `frontend/src/components/notifications/NotificationItem.tsx` - Individual notification item component
- `frontend/src/components/notifications/NotificationItem.test.js` or `frontend/src/components/notifications/NotificationItem.test.tsx` - Tests for NotificationItem
- `frontend/src/layouts/MainLayout.js` or `frontend/src/layouts/MainLayout.tsx` - Main application layout with navigation
- `frontend/src/layouts/MainLayout.test.js` or `frontend/src/layouts/MainLayout.test.tsx` - Tests for MainLayout
- `frontend/src/pages/LoginPage.js` or `frontend/src/pages/LoginPage.tsx` - Login page
- `frontend/src/pages/LoginPage.test.js` or `frontend/src/pages/LoginPage.test.tsx` - Tests for LoginPage
- `frontend/src/pages/RegisterPage.js` or `frontend/src/pages/RegisterPage.tsx` - Registration page
- `frontend/src/pages/RegisterPage.test.js` or `frontend/src/pages/RegisterPage.test.tsx` - Tests for RegisterPage
- `frontend/src/pages/TradersPage.js` or `frontend/src/pages/TradersPage.tsx` - Traders discovery page
- `frontend/src/pages/TradersPage.test.js` or `frontend/src/pages/TradersPage.test.tsx` - Tests for TradersPage
- `frontend/src/pages/DashboardPage.js` or `frontend/src/pages/DashboardPage.tsx` - User dashboard page
- `frontend/src/pages/DashboardPage.test.js` or `frontend/src/pages/DashboardPage.test.tsx` - Tests for DashboardPage
- `frontend/src/services/api.js` or `frontend/src/services/api.ts` - API client service
- `frontend/src/services/api.test.js` or `frontend/src/services/api.test.ts` - Tests for API service
- `frontend/src/services/stockDataService.js` or `frontend/src/services/stockDataService.ts` - Frontend stock data service
- `frontend/src/services/stockDataService.test.js` or `frontend/src/services/stockDataService.test.ts` - Tests for stock data service
- `frontend/src/services/websocketService.js` or `frontend/src/services/websocketService.ts` - WebSocket connection service for real-time updates
- `frontend/src/services/websocketService.test.js` or `frontend/src/services/websocketService.test.ts` - Tests for WebSocket service
- `frontend/src/context/AuthContext.js` or `frontend/src/context/AuthContext.tsx` - Authentication context for state management
- `frontend/src/context/AuthContext.test.js` or `frontend/src/context/AuthContext.test.tsx` - Tests for AuthContext
- `frontend/src/hooks/useAuth.js` or `frontend/src/hooks/useAuth.ts` - Custom hook for authentication
- `frontend/src/hooks/useAuth.test.js` or `frontend/src/hooks/useAuth.test.ts` - Tests for useAuth hook
- `frontend/src/utils/constants.js` or `frontend/src/utils/constants.ts` - Application constants
- `frontend/src/utils/helpers.js` or `frontend/src/utils/helpers.ts` - Utility helper functions
- `frontend/src/utils/helpers.test.js` or `frontend/src/utils/helpers.test.ts` - Tests for helper functions
- `frontend/package.json` - Frontend dependencies and scripts
- `frontend/.gitignore` - Git ignore file for frontend

### Configuration Files
- `.gitignore` - Root git ignore file
- `README.md` - Project documentation
- `docker-compose.yml` - Docker configuration for local development (optional)
- `.env.example` - Example environment variables

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- The file extensions (.js/.ts/.jsx/.tsx) depend on your chosen technology stack. Adjust accordingly.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/trading-copy-application`)

- [ ] 1.0 Set up project structure and development environment
  - [ ] 1.1 Initialize backend project (Node.js/Python/etc.) with package manager (npm/yarn/pip)
  - [ ] 1.2 Initialize frontend project (React/Vue/etc.) with build tool (Create React App/Vite/etc.)
  - [ ] 1.3 Set up project directory structure (backend/, frontend/, tasks/, etc.)
  - [ ] 1.4 Configure environment variables files (.env.example) for both backend and frontend
  - [ ] 1.5 Set up database (PostgreSQL/MySQL) and create connection configuration
  - [ ] 1.6 Install and configure testing framework (Jest/Mocha/etc.) for backend
  - [ ] 1.7 Install and configure testing framework (Jest/React Testing Library/etc.) for frontend
  - [ ] 1.8 Set up code linting and formatting tools (ESLint, Prettier, etc.)
  - [ ] 1.9 Create .gitignore files for backend, frontend, and root directory
  - [ ] 1.10 Set up basic server configuration (port, CORS, middleware setup)
  - [ ] 1.11 Create README.md with project setup instructions

- [ ] 2.0 Implement authentication and user management system
  - [ ] 2.1 Create User database model/schema with fields: id, email, password (hashed), name, createdAt, updatedAt
  - [ ] 2.2 Implement password hashing utility functions (bcrypt or similar)
  - [ ] 2.3 Create user registration endpoint (POST /api/auth/register) with email and password validation
  - [ ] 2.4 Create user login endpoint (POST /api/auth/login) that returns JWT token
  - [ ] 2.5 Implement JWT token generation and verification utilities
  - [ ] 2.6 Create authentication middleware to verify JWT tokens on protected routes
  - [ ] 2.7 Implement OAuth service for Google authentication
  - [ ] 2.8 Implement OAuth service for Apple authentication
  - [ ] 2.9 Create OAuth callback endpoints (GET /api/auth/oauth/google/callback, /api/auth/oauth/apple/callback)
  - [ ] 2.10 Create password reset request endpoint (POST /api/auth/forgot-password)
  - [ ] 2.11 Create password reset confirmation endpoint (POST /api/auth/reset-password)
  - [ ] 2.12 Create logout endpoint (POST /api/auth/logout)
  - [ ] 2.13 Create user account settings endpoint (GET/PUT /api/auth/me)
  - [ ] 2.14 Build frontend LoginForm component with email/password inputs
  - [ ] 2.15 Build frontend RegisterForm component with validation
  - [ ] 2.16 Build frontend OAuthButton components for Google and Apple login
  - [ ] 2.17 Create frontend AuthContext for managing authentication state
  - [ ] 2.18 Create useAuth custom hook for easy access to auth state and methods
  - [ ] 2.19 Build LoginPage and RegisterPage components
  - [ ] 2.20 Implement protected route wrapper component for frontend
  - [ ] 2.21 Create frontend API service functions for authentication endpoints
  - [ ] 2.22 Write unit tests for all authentication backend routes
  - [ ] 2.23 Write unit tests for all authentication frontend components
  - [ ] 2.24 Write integration tests for authentication flow

- [ ] 3.0 Build real-time stock market data integration
  - [ ] 3.1 Research and select stock market data provider API (Alpha Vantage, IEX Cloud, Polygon.io, etc.)
  - [ ] 3.2 Set up API keys and configure stock data service with provider credentials
  - [ ] 3.3 Create stockDataService to fetch real-time stock prices from external API
  - [ ] 3.4 Implement caching mechanism for stock data to reduce API calls
  - [ ] 3.5 Create backend endpoint (GET /api/stock/:symbol) to fetch current stock price
  - [ ] 3.6 Create backend endpoint (GET /api/stock/:symbol/history) to fetch historical price data
  - [ ] 3.7 Create backend endpoint (GET /api/stock/search) to search stocks by symbol or name
  - [ ] 3.8 Implement WebSocket server setup for real-time stock price updates
  - [ ] 3.9 Create WebSocket event handlers for subscribing/unsubscribing to stock symbols
  - [ ] 3.10 Implement polling mechanism as fallback if WebSocket is unavailable
  - [ ] 3.11 Add error handling and rate limiting for stock data API calls
  - [ ] 3.12 Create frontend stockDataService to call backend stock endpoints
  - [ ] 3.13 Create frontend WebSocket service to connect to real-time updates
  - [ ] 3.14 Build StockPrice component to display real-time stock price with color-coded changes
  - [ ] 3.15 Build StockChart component to display historical price charts (using a charting library)
  - [ ] 3.16 Build StockSearch component for searching stocks by symbol or name
  - [ ] 3.17 Implement market hours detection and display (open/closed/pre-market/after-hours)
  - [ ] 3.18 Add loading states and error handling for stock data components
  - [ ] 3.19 Write unit tests for stock data service and API endpoints
  - [ ] 3.20 Write unit tests for stock data frontend components

- [ ] 4.0 Create influential trader discovery and management features
  - [ ] 4.1 Create Trader database model/schema with fields: id, name, bio, performance metrics (winRate, totalReturns, tradeCount), socialFollowers, isVerified, createdAt
  - [ ] 4.2 Create Follow database model/schema to track user-trader relationships (userId, traderId, followedAt)
  - [ ] 4.3 Create Trade database model/schema with fields: id, traderId, symbol, entryPrice, positionSize, tradeType (buy/sell), timestamp, rationale, createdAt
  - [ ] 4.4 Create backend endpoint (GET /api/traders) to list all traders with pagination
  - [ ] 4.5 Implement trader search functionality (search by name, filter by performance, verification status, social following)
  - [ ] 4.6 Create backend endpoint (GET /api/traders/:id) to get detailed trader profile
  - [ ] 4.7 Create backend endpoint (GET /api/traders/:id/trades) to get trader's trade history
  - [ ] 4.8 Create backend endpoint (POST /api/traders/:id/follow) to follow a trader (requires authentication)
  - [ ] 4.9 Create backend endpoint (DELETE /api/traders/:id/follow) to unfollow a trader
  - [ ] 4.10 Create backend endpoint (GET /api/traders/following) to get list of traders user is following
  - [ ] 4.11 Implement trader ranking/ordering logic (by performance, followers, etc.)
  - [ ] 4.12 Build frontend TraderList component to display list of traders
  - [ ] 4.13 Build frontend TraderCard component to display individual trader information
  - [ ] 4.14 Build frontend TraderProfile component to show detailed trader profile with performance metrics
  - [ ] 4.15 Build frontend TraderFilters component for searching and filtering traders
  - [ ] 4.16 Implement follow/unfollow functionality in frontend components
  - [ ] 4.17 Create TradersPage component that combines TraderList, TraderFilters, and navigation
  - [ ] 4.18 Create frontend API service functions for trader endpoints
  - [ ] 4.19 Add pagination UI for trader list
  - [ ] 4.20 Write unit tests for trader backend routes and models
  - [ ] 4.21 Write unit tests for trader frontend components

- [ ] 5.0 Implement trade copying system with manual approval
  - [ ] 5.1 Create CopiedTrade database model/schema with fields: id, userId, originalTradeId, symbol, entryPrice, positionSize, tradeType, status (pending/approved/rejected/executed), approvedAt, executedAt, createdAt
  - [ ] 5.2 Create backend endpoint (GET /api/trades) to get trades from followed traders (requires authentication)
  - [ ] 5.3 Create backend endpoint (GET /api/trades/:id) to get detailed trade information
  - [ ] 5.4 Create backend endpoint (POST /api/trades/:id/copy) to create a copy trade request (status: pending)
  - [ ] 5.5 Create backend endpoint (PUT /api/copied-trades/:id/approve) to approve a pending copied trade
  - [ ] 5.6 Create backend endpoint (PUT /api/copied-trades/:id/reject) to reject a pending copied trade
  - [ ] 5.7 Create backend endpoint (GET /api/copied-trades) to get user's copied trades history
  - [ ] 5.8 Implement trade execution logic (for MVP, this may be simulated or require manual execution)
  - [ ] 5.9 Create notification trigger when a followed trader makes a new trade
  - [ ] 5.10 Build frontend TradeList component to display trades from followed traders
  - [ ] 5.11 Build frontend TradeCard component to display individual trade information
  - [ ] 5.12 Build frontend TradeReview component with trade details, current stock price, and approve/reject buttons
  - [ ] 5.13 Implement side-by-side comparison in TradeReview (trader's rationale vs current market data)
  - [ ] 5.14 Add confirmation dialogs for approve/reject actions
  - [ ] 5.15 Implement visual indicators for trade urgency (price movement since trade was made)
  - [ ] 5.16 Create frontend API service functions for trade and copied-trade endpoints
  - [ ] 5.17 Add status badges and filters for copied trades (pending, approved, rejected, executed)
  - [ ] 5.18 Display performance metrics for executed copied trades
  - [ ] 5.19 Write unit tests for trade copying backend routes and models
  - [ ] 5.20 Write unit tests for trade copying frontend components

- [ ] 6.0 Build user dashboard and notification system
  - [ ] 6.1 Create Notification database model/schema with fields: id, userId, type, message, relatedTradeId (optional), isRead, createdAt
  - [ ] 6.2 Create backend endpoint (GET /api/notifications) to get user's notifications (requires authentication)
  - [ ] 6.3 Create backend endpoint (PUT /api/notifications/:id/read) to mark notification as read
  - [ ] 6.4 Create backend endpoint (PUT /api/notifications/read-all) to mark all notifications as read
  - [ ] 6.5 Create backend endpoint (GET /api/dashboard) to get dashboard summary data (followed traders, pending approvals, portfolio performance)
  - [ ] 6.6 Implement notification creation service that creates notifications when events occur (new trade, trade executed, etc.)
  - [ ] 6.7 Set up WebSocket or Server-Sent Events for real-time notification delivery
  - [ ] 6.8 Create backend endpoint (GET /api/dashboard/portfolio) to get portfolio performance metrics
  - [ ] 6.9 Build frontend Dashboard component as main dashboard page
  - [ ] 6.10 Build frontend PortfolioSummary component to display portfolio value and performance
  - [ ] 6.11 Build frontend NotificationCenter component to display list of notifications
  - [ ] 6.12 Build frontend NotificationItem component for individual notification display
  - [ ] 6.13 Implement notification badge/counter for unread notifications
  - [ ] 6.14 Add notification preferences endpoint and UI (GET/PUT /api/notifications/preferences)
  - [ ] 6.15 Create MainLayout component with navigation, notification center, and user menu
  - [ ] 6.16 Create DashboardPage component that combines dashboard sections
  - [ ] 6.17 Implement real-time notification updates using WebSocket connection
  - [ ] 6.18 Add "Mark as read" functionality for individual and all notifications
  - [ ] 6.19 Display recent activity from followed traders on dashboard
  - [ ] 6.20 Display pending trade approvals on dashboard with quick action buttons
  - [ ] 6.21 Create frontend API service functions for dashboard and notification endpoints
  - [ ] 6.22 Write unit tests for notification and dashboard backend routes
  - [ ] 6.23 Write unit tests for dashboard and notification frontend components
  - [ ] 6.24 Implement responsive design for dashboard and all components
