# Product Requirements Document: Real Trading Data Integration for Influential Trader Discovery

## Document Information
- **Version:** 1.0
- **Date:** November 15, 2025
- **Status:** Draft
- **Owner:** Product Team

## Executive Summary

This document outlines requirements for integrating real trading data into the Trading Copy Application to accurately identify and rank influential traders based on actual trading performance. The system will connect to traders' brokerage accounts, capture daily trade snapshots, calculate real-time performance metrics, and display verified trading activity to help users discover truly successful traders.

**Problem:** Current system relies on manually entered or unverified trader data, making it impossible to guarantee accuracy of performance metrics used for trader discovery.

**Solution:** Implement secure brokerage API integrations to automatically capture real trading data, store daily snapshots, calculate verified performance metrics, and enable data-driven trader rankings.

## Goals

1. **Verify Trading Performance**: Connect to real brokerage accounts to validate trader claims and eliminate fraudulent performance reporting
2. **Automate Data Collection**: Capture daily snapshots of trader positions, trades, and account values without manual intervention
3. **Calculate Accurate Metrics**: Generate real-time performance metrics (win rate, returns, Sharpe ratio, drawdown) from actual trading data
4. **Enable Discovery**: Rank and surface influential traders based on verified, quantifiable trading performance
5. **Build Trust**: Provide transparency through verified badges and auditable trading history

## User Stories

### Traders (Supply Side)

1. **As a trader**, I want to securely connect my brokerage account so that my trading performance is automatically verified and displayed on the platform.

2. **As a trader**, I want daily snapshots of my trades and positions captured automatically so that I don't need to manually report my activity.

3. **As a trader**, I want my performance metrics (win rate, returns, drawdown) calculated accurately from real data so that potential followers can trust my track record.

4. **As a trader**, I want to receive a "Verified Trader" badge when my account is connected so that I stand out from unverified traders.

5. **As a trader**, I want to control what trading data is publicly visible (e.g., show win rate but hide exact position sizes) so that I maintain privacy while proving legitimacy.

6. **As a trader**, I want to see my historical performance charts and statistics so that I can track my own improvement over time.

### Followers (Demand Side)

7. **As a user**, I want to see only traders with verified trading data so that I can trust their performance claims are accurate.

8. **As a user**, I want to filter traders by real performance metrics (30-day returns, 90-day win rate, Sharpe ratio) so that I can find consistently profitable traders.

9. **As a user**, I want to see daily trading activity from traders I follow so that I can understand their trading frequency and style.

10. **As a user**, I want to view historical performance charts showing drawdowns and recovery periods so that I can assess risk before copying trades.

11. **As a user**, I want to compare multiple traders side-by-side using standardized metrics so that I can make informed decisions about who to follow.

12. **As a user**, I want to receive alerts when a followed trader's performance metrics decline significantly so that I can re-evaluate my following decisions.

### Platform Administrators

13. **As an administrator**, I want to monitor data synchronization status for all connected accounts so that I can identify and resolve integration issues quickly.

14. **As an administrator**, I want to flag suspicious trading patterns (e.g., unlikely win rates, impossible returns) for manual review so that we maintain platform integrity.

15. **As an administrator**, I want to generate aggregate platform statistics (total verified traders, total trading volume) so that I can track platform growth.

## Functional Requirements

### Brokerage Integration

**FR-1: Supported Brokerages**
- The system must support integration with major US brokerages including:
  - Interactive Brokers (primary target)
  - TD Ameritrade / Charles Schwab
  - E*TRADE
  - Robinhood
  - Alpaca (for trader testing/sandbox)
- The system must use OAuth 2.0 or equivalent secure authentication for account connections
- The system must support both live and paper trading accounts

**FR-2: Account Connection Flow**
- The system must provide a secure OAuth flow for traders to connect their brokerage accounts
- The system must request only read-only access to account data (no trade execution permissions)
- The system must display clear permission scopes during connection (positions, orders, account history)
- The system must allow traders to disconnect/revoke access at any time
- The system must store encrypted access tokens and refresh tokens securely

**FR-3: Account Verification**
- The system must verify account ownership by checking account holder name matches trader profile
- The system must require minimum account value ($5,000 recommended) for trader eligibility
- The system must require minimum trading history (30 days of activity) before displaying metrics
- The system must grant "Verified Trader" badge only after successful account connection and verification

### Data Collection & Snapshots

**FR-4: Daily Data Snapshots**
- The system must capture daily snapshots at market close (4:00 PM ET) for all connected accounts
- Each snapshot must include:
  - Account value (total equity)
  - Cash balance
  - Open positions (symbol, quantity, entry price, current price, unrealized P&L)
  - Closed trades since last snapshot (symbol, entry/exit prices, realized P&L, hold duration)
  - Total deposits/withdrawals since last snapshot
- The system must store raw snapshot data for audit and recalculation purposes
- The system must retain snapshot data for minimum 24 months

**FR-5: Real-Time Trade Detection**
- The system must poll for new trades every 5-15 minutes during market hours
- The system must detect and record:
  - Trade execution (buy/sell, symbol, quantity, price, timestamp)
  - Order types (market, limit, stop-loss)
  - Trade status (filled, partial, cancelled)
- The system must notify followers within 5 minutes of trade execution for followed traders
- The system must handle rate limits imposed by brokerage APIs gracefully

**FR-6: Data Validation & Quality**
- The system must validate snapshot data for consistency (e.g., cash + positions = account value)
- The system must flag anomalies (e.g., account value drops >50% without corresponding trades)
- The system must detect and exclude deposits/withdrawals from performance calculations
- The system must handle corporate actions (splits, dividends, mergers) correctly in performance tracking

### Performance Metrics Calculation

**FR-7: Core Performance Metrics**
- The system must calculate and display the following metrics:
  - **Total Return (%)**: Percentage gain/loss from initial account value
  - **Win Rate (%)**: Percentage of profitable trades vs total closed trades
  - **Average Win/Loss**: Average profit on winning trades vs average loss on losing trades
  - **Trade Count**: Total number of trades executed
  - **Sharpe Ratio**: Risk-adjusted return (daily returns / standard deviation)
  - **Maximum Drawdown (%)**: Largest peak-to-trough decline in account value
  - **Current Drawdown (%)**: Current decline from recent peak
  - **Profit Factor**: Gross profit / gross loss
  - **Average Holding Period**: Mean duration of trades

**FR-8: Time-Based Metrics**
- The system must calculate metrics over multiple timeframes:
  - 7-day performance
  - 30-day performance
  - 90-day performance
  - Year-to-date (YTD) performance
  - All-time performance (since account connection)
- The system must recalculate metrics daily after market close
- The system must display last updated timestamp for each metric

**FR-9: Advanced Analytics**
- The system should calculate additional metrics for premium users:
  - **Alpha/Beta**: Performance relative to market (S&P 500) benchmark
  - **Win/Loss Streaks**: Longest consecutive winning/losing trades
  - **Best/Worst Trades**: Top 5 most profitable and unprofitable trades
  - **Sector Exposure**: Percentage of portfolio allocated to each sector
  - **Position Concentration**: Top holdings as percentage of portfolio
  - **Trading Frequency**: Average trades per day/week

**FR-10: Performance Attribution**
- The system must exclude deposits/withdrawals from return calculations
- The system must use time-weighted return (TWR) methodology for accurate performance
- The system must handle partial period calculations (e.g., trader connected mid-month)
- The system must display both absolute returns ($) and percentage returns (%)

### Trader Discovery & Ranking

**FR-11: Discovery Filters**
- The system must allow users to filter traders by:
  - Performance metrics (min/max win rate, min returns, max drawdown)
  - Timeframe (30-day returns, 90-day returns, YTD)
  - Verification status (verified only, all traders)
  - Trading style (day trader, swing trader, long-term investor)
  - Minimum trade count (ensure statistical significance)
  - Risk metrics (Sharpe ratio, max drawdown)
- The system must support multi-criteria filtering (AND logic)
- The system must display result count after applying filters

**FR-12: Ranking Algorithms**
- The system must provide multiple ranking options:
  - **Top Performers**: Highest returns over selected timeframe
  - **Most Consistent**: Highest Sharpe ratio + lowest drawdown
  - **Best Win Rate**: Highest win rate with minimum 20 trades
  - **Trending**: Best 7-day performance among established traders
  - **Rising Stars**: Newer traders with strong early performance
  - **Low Risk**: Lowest drawdown with positive returns
- The system must allow users to switch between ranking algorithms
- The system must display ranking methodology clearly to users

**FR-13: Trader Profile Display**
- Each trader profile must display:
  - Verified badge with connection date
  - Performance metrics dashboard (returns, win rate, Sharpe, drawdown)
  - Performance chart (account value over time)
  - Equity curve with drawdown visualization
  - Recent trades table (last 10-20 trades)
  - Win/loss distribution chart
  - Risk metrics summary
  - Follower count and social engagement
- The system must allow traders to hide sensitive data (exact dollar amounts, specific position sizes)
- The system must show percentages and ratios even if absolute values are hidden

**FR-14: Leaderboards**
- The system must display leaderboards for:
  - Top performers (30-day, 90-day, YTD)
  - Best win rates
  - Highest Sharpe ratios
  - Most followed traders
- The system must update leaderboards daily
- The system must display trader's rank movement (up/down arrows)
- The system must limit leaderboards to verified traders only

### Trade Activity Feed

**FR-15: Real-Time Trade Feed**
- The system must display real-time feed of trades from followed traders
- Each trade entry must show:
  - Trader name and profile picture
  - Trade action (bought/sold)
  - Symbol and company name
  - Quantity and price (or percentage of portfolio if dollar amounts hidden)
  - Timestamp
  - Current P&L for open positions
- The system must allow filtering feed by trader or symbol
- The system must support pagination for historical trades

**FR-16: Trade Notifications**
- The system must send notifications when followed traders execute trades
- Notification must include essential trade details (symbol, action, price)
- The system must support notification preferences (all trades, high-conviction only, position sizes above threshold)
- The system must batch notifications if trader executes multiple trades quickly

### Data Privacy & Control

**FR-17: Trader Privacy Settings**
- The system must allow traders to configure visibility:
  - Public profile (visible to all users)
  - Private profile (invitation only)
  - Hide dollar amounts (show percentages only)
  - Hide position sizes (show symbols only)
  - Hide specific symbols from public view
- The system must respect privacy settings when displaying data to followers
- The system must allow traders to pause data sync temporarily without disconnecting

**FR-18: Data Security**
- The system must encrypt all brokerage credentials at rest (AES-256)
- The system must use TLS 1.3 for all API communications with brokerages
- The system must implement token rotation for long-lived access tokens
- The system must audit access to sensitive trading data
- The system must comply with financial data regulations (SOC 2, FINRA if applicable)

**FR-19: Account Disconnection**
- The system must allow traders to disconnect their brokerage account at any time
- Upon disconnection:
  - Verified badge must be removed immediately
  - Historical metrics must remain visible (marked as "last verified on [date]")
  - Real-time trade feed must stop updating
  - Trader must be removed from active leaderboards
- The system must retain historical snapshot data for audit purposes (subject to retention policy)

### System Administration

**FR-20: Sync Monitoring**
- The system must provide admin dashboard showing:
  - Connected accounts count
  - Successful/failed sync attempts (last 24 hours)
  - Average sync duration
  - API rate limit usage per brokerage
  - Accounts requiring attention (auth expired, consecutive failures)
- The system must alert admins when sync failure rate exceeds 5%
- The system must provide tools to manually trigger re-sync for specific accounts

**FR-21: Fraud Detection**
- The system must flag suspicious patterns:
  - Win rate >95% with >50 trades
  - Returns >500% in 30 days without proportional risk
  - Trades only in pre-market/after-hours (potential backdating)
  - Account value increases without corresponding trades
  - Identical trades across multiple trader accounts (collusion)
- The system must queue flagged accounts for manual review
- The system must provide tools to temporarily suspend trader profiles

**FR-22: Data Quality Assurance**
- The system must generate daily reports on:
  - Data completeness (% of expected snapshots captured)
  - Snapshot consistency (% passing validation checks)
  - Metric calculation accuracy (spot checks vs manual calculation)
- The system must provide tools to recalculate metrics if formula changes

## Non-Functional Requirements

### Performance

**NFR-1: Scalability**
- The system must support 10,000+ connected brokerage accounts
- The system must handle 100,000+ daily snapshot captures
- The system must process trader discovery queries in <2 seconds
- The system must display trader profiles in <1 second

**NFR-2: Reliability**
- The system must achieve 99.5% uptime for data sync operations
- The system must retry failed sync attempts with exponential backoff
- The system must queue snapshots for later processing if brokerage API is temporarily unavailable
- The system must maintain data consistency even during partial failures

**NFR-3: Data Freshness**
- Daily snapshots must complete within 2 hours of market close
- Real-time trades must appear in feed within 5 minutes of execution
- Performance metrics must update within 1 hour of market close
- Leaderboards must update within 2 hours of market close

### Security & Compliance

**NFR-4: Authentication & Authorization**
- The system must use industry-standard OAuth 2.0 for brokerage connections
- The system must implement principle of least privilege (read-only access)
- The system must support token expiration and refresh
- The system must log all access to sensitive trading data

**NFR-5: Data Protection**
- The system must encrypt brokerage credentials at rest (AES-256)
- The system must encrypt data in transit (TLS 1.3)
- The system must implement database encryption for trading data
- The system must perform regular security audits

**NFR-6: Regulatory Compliance**
- The system must comply with SEC regulations for trade data display
- The system must include required disclaimers (past performance doesn't guarantee future results)
- The system must implement data retention policies per regulatory requirements
- The system should prepare for SOC 2 Type II compliance

### Usability

**NFR-7: User Experience**
- Trader account connection flow must complete in <5 minutes
- Discovery filters must return results in <2 seconds
- Performance charts must load in <1 second
- The system must provide clear error messages when sync fails

**NFR-8: Transparency**
- The system must clearly indicate when data was last updated
- The system must display methodology for calculated metrics
- The system must show confidence intervals for metrics (if sample size small)
- The system must disclose any limitations in data accuracy

## Technical Architecture

### System Components

**1. Brokerage Integration Service**
- OAuth authentication module
- API client libraries for each supported brokerage
- Rate limiting and retry logic
- Webhook handlers for real-time trade notifications (if supported)

**2. Data Collection Pipeline**
- Scheduled jobs for daily snapshots (cron at 4:30 PM ET)
- Real-time polling service for trade detection
- Data validation and normalization layer
- Dead letter queue for failed sync attempts

**3. Metrics Calculation Engine**
- Daily batch processor for performance metrics
- Time-series data aggregation
- Statistical analysis functions (Sharpe, drawdown, etc.)
- Benchmark comparison engine (S&P 500 data)

**4. Discovery & Ranking Service**
- Query engine for trader search and filtering
- Ranking algorithm implementations
- Caching layer for frequently accessed data (Redis)
- Leaderboard generation and updates

**5. Data Storage**
- **PostgreSQL**: Relational data (traders, trades, accounts)
- **TimescaleDB**: Time-series data (daily snapshots, metrics history)
- **Redis**: Cache for leaderboards, frequently accessed profiles
- **S3**: Long-term storage for raw snapshot data (archival)

**6. API Layer**
- RESTful endpoints for trader discovery
- WebSocket for real-time trade feed
- GraphQL for complex trader profile queries (optional)
- Rate limiting per user

### Data Models

**TraderAccount**
```javascript
{
  id: UUID,
  traderId: UUID,
  brokerage: 'INTERACTIVE_BROKERS' | 'TD_AMERITRADE' | 'ETRADE' | 'ROBINHOOD' | 'ALPACA',
  accountNumber: String (encrypted),
  accountType: 'LIVE' | 'PAPER',
  isConnected: Boolean,
  isVerified: Boolean,
  connectedAt: Timestamp,
  lastSyncAt: Timestamp,
  lastSyncStatus: 'SUCCESS' | 'FAILED' | 'PARTIAL',
  syncFailureCount: Integer,
  accessToken: String (encrypted),
  refreshToken: String (encrypted),
  tokenExpiresAt: Timestamp,
  privacySettings: {
    showDollarAmounts: Boolean,
    showPositionSizes: Boolean,
    hiddenSymbols: [String]
  }
}
```

**DailySnapshot**
```javascript
{
  id: UUID,
  traderAccountId: UUID,
  snapshotDate: Date,
  timestamp: Timestamp,
  accountValue: Decimal,
  cashBalance: Decimal,
  positionsValue: Decimal,
  openPositions: [{
    symbol: String,
    quantity: Decimal,
    entryPrice: Decimal,
    currentPrice: Decimal,
    unrealizedPnL: Decimal,
    unrealizedPnLPercent: Decimal
  }],
  closedTrades: [{
    symbol: String,
    entryDate: Timestamp,
    exitDate: Timestamp,
    quantity: Decimal,
    entryPrice: Decimal,
    exitPrice: Decimal,
    realizedPnL: Decimal,
    realizedPnLPercent: Decimal,
    holdDuration: Integer (days),
    isWin: Boolean
  }],
  depositsWithdrawals: Decimal,
  rawData: JSON (full API response for audit)
}
```

**PerformanceMetrics**
```javascript
{
  id: UUID,
  traderAccountId: UUID,
  calculatedAt: Timestamp,
  timeframe: '7D' | '30D' | '90D' | 'YTD' | 'ALL',
  totalReturn: Decimal,
  totalReturnPercent: Decimal,
  winRate: Decimal,
  tradeCount: Integer,
  winCount: Integer,
  lossCount: Integer,
  avgWin: Decimal,
  avgLoss: Decimal,
  profitFactor: Decimal,
  sharpeRatio: Decimal,
  maxDrawdown: Decimal,
  currentDrawdown: Decimal,
  avgHoldingPeriod: Decimal,
  bestTrade: Decimal,
  worstTrade: Decimal,
  alpha: Decimal (optional),
  beta: Decimal (optional)
}
```

**Trade**
```javascript
{
  id: UUID,
  traderAccountId: UUID,
  traderId: UUID (denormalized),
  symbol: String,
  action: 'BUY' | 'SELL',
  quantity: Decimal,
  price: Decimal,
  orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT',
  executedAt: Timestamp,
  detectedAt: Timestamp,
  status: 'FILLED' | 'PARTIAL' | 'CANCELLED',
  commission: Decimal,
  positionType: 'OPEN' | 'CLOSE' | 'ADD' | 'REDUCE',
  notificationSent: Boolean,
  visibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'HIDDEN'
}
```

**TraderRanking**
```javascript
{
  id: UUID,
  traderId: UUID,
  rankingType: 'TOP_PERFORMERS' | 'BEST_WIN_RATE' | 'HIGHEST_SHARPE' | 'TRENDING',
  timeframe: '7D' | '30D' | '90D' | 'YTD',
  rank: Integer,
  score: Decimal,
  previousRank: Integer,
  calculatedAt: Timestamp
}
```

### Brokerage API Integration

**Supported APIs:**

1. **Interactive Brokers (Primary)**
   - API: Client Portal Web API
   - Auth: OAuth 2.0 or API Gateway
   - Rate Limits: 50 requests/second
   - Real-time: WebSocket for live data
   - Documentation: https://interactivebrokers.github.io/cpwebapi/

2. **TD Ameritrade / Schwab**
   - API: TD Ameritrade API (transitioning to Schwab)
   - Auth: OAuth 2.0
   - Rate Limits: 120 requests/minute
   - Real-time: WebSocket available
   - Documentation: https://developer.tdameritrade.com/

3. **E*TRADE**
   - API: E*TRADE Developer Platform
   - Auth: OAuth 1.0a
   - Rate Limits: Variable by endpoint
   - Real-time: Limited support
   - Documentation: https://developer.etrade.com/

4. **Robinhood**
   - API: Unofficial API (use with caution)
   - Auth: Token-based
   - Rate Limits: Undocumented
   - Real-time: Limited
   - Note: Consider Alpaca as alternative

5. **Alpaca**
   - API: Alpaca Trading API
   - Auth: API Key / OAuth 2.0
   - Rate Limits: 200 requests/minute
   - Real-time: WebSocket for trades
   - Documentation: https://alpaca.markets/docs/
   - Supports both live and paper trading

### Data Sync Strategy

**Daily Snapshot Flow:**
```
1. Cron job triggers at 4:30 PM ET daily
2. Fetch list of all connected accounts
3. For each account:
   a. Check if token is valid (refresh if needed)
   b. Fetch account summary (balances, positions)
   c. Fetch order history (trades since last sync)
   d. Validate data consistency
   e. Store raw snapshot + parsed data
   f. Update lastSyncAt timestamp
4. After all snapshots complete:
   a. Calculate performance metrics for all traders
   b. Update leaderboards
   c. Generate admin reports
```

**Real-Time Trade Detection Flow:**
```
1. Polling service runs every 5-15 minutes during market hours
2. For each connected account:
   a. Fetch recent orders (last 30 minutes)
   b. Compare with previously detected trades
   c. Identify new trade executions
   d. Store trade records
   e. Determine if notification should be sent
3. For new trades requiring notification:
   a. Fetch trader's followers
   b. Queue notification jobs
   c. Publish to real-time feed
```

**Error Handling:**
- Auth failures: Attempt token refresh, notify trader if refresh fails
- Rate limit exceeded: Exponential backoff, queue for retry
- Incomplete data: Store partial snapshot, flag for manual review
- Validation failures: Alert admins, exclude from metric calculations
- API downtime: Queue for retry, use cached data for display

## API Endpoints

### Trader Account Management

**POST /api/traders/account/connect**
```javascript
Request: {
  brokerage: 'INTERACTIVE_BROKERS',
  authCode: 'oauth_auth_code_from_redirect'
}
Response: {
  traderAccountId: 'uuid',
  status: 'CONNECTED',
  verificationStatus: 'PENDING' | 'VERIFIED',
  message: 'Account connected successfully. Verification in progress.'
}
```

**GET /api/traders/account/status**
```javascript
Response: {
  isConnected: true,
  brokerage: 'INTERACTIVE_BROKERS',
  accountType: 'LIVE',
  lastSyncAt: '2025-11-15T20:30:00Z',
  lastSyncStatus: 'SUCCESS',
  verificationStatus: 'VERIFIED',
  connectedSince: '2025-01-15T10:00:00Z'
}
```

**DELETE /api/traders/account/disconnect**
```javascript
Response: {
  message: 'Account disconnected successfully',
  effectiveDate: '2025-11-15T21:00:00Z'
}
```

**PUT /api/traders/account/privacy**
```javascript
Request: {
  showDollarAmounts: false,
  showPositionSizes: true,
  hiddenSymbols: ['AAPL']
}
Response: {
  message: 'Privacy settings updated'
}
```

### Trader Discovery

**GET /api/traders/discover**
```javascript
Query Parameters:
  ?verified=true
  &minWinRate=70
  &maxDrawdown=20
  &timeframe=30D
  &minTrades=20
  &sortBy=returns
  &sortOrder=desc
  &page=1
  &limit=20

Response: {
  traders: [{
    id: 'uuid',
    name: 'Trader Name',
    isVerified: true,
    verifiedSince: '2025-01-15',
    metrics: {
      timeframe: '30D',
      totalReturn: 25.5,
      winRate: 72.5,
      sharpeRatio: 1.8,
      maxDrawdown: 12.3,
      tradeCount: 45
    },
    followerCount: 1250,
    lastTradeAt: '2025-11-15T15:45:00Z'
  }],
  pagination: { ... }
}
```

**GET /api/traders/:id/performance**
```javascript
Query Parameters:
  ?timeframe=90D

Response: {
  traderId: 'uuid',
  metrics: {
    '7D': { totalReturn: 3.2, winRate: 75.0, ... },
    '30D': { totalReturn: 15.5, winRate: 70.5, ... },
    '90D': { totalReturn: 42.3, winRate: 68.0, ... },
    'YTD': { totalReturn: 85.2, winRate: 69.5, ... }
  },
  equityCurve: [
    { date: '2025-08-15', value: 100000 },
    { date: '2025-08-16', value: 101250 },
    ...
  ],
  drawdownHistory: [
    { date: '2025-08-15', drawdown: 0 },
    { date: '2025-09-01', drawdown: -5.2 },
    ...
  ]
}
```

**GET /api/traders/:id/trades**
```javascript
Query Parameters:
  ?startDate=2025-10-01
  &endDate=2025-11-15
  &status=CLOSED
  &page=1
  &limit=50

Response: {
  trades: [{
    id: 'uuid',
    symbol: 'AAPL',
    action: 'BUY',
    quantity: 100,  // or null if hidden
    entryPrice: 175.50,
    exitPrice: 182.30,  // if closed
    realizedPnL: 680.00,  // or percentage
    realizedPnLPercent: 3.87,
    executedAt: '2025-11-10T14:30:00Z',
    closedAt: '2025-11-14T15:45:00Z',
    holdDuration: 4,  // days
    isWin: true
  }],
  summary: {
    totalTrades: 45,
    wins: 32,
    losses: 13,
    winRate: 71.1,
    totalPnL: 15500.00
  },
  pagination: { ... }
}
```

### Leaderboards

**GET /api/leaderboards/:type**
```javascript
Path Parameters:
  type: 'top-performers' | 'best-win-rate' | 'highest-sharpe' | 'trending'

Query Parameters:
  ?timeframe=30D
  &limit=100

Response: {
  leaderboardType: 'top-performers',
  timeframe: '30D',
  updatedAt: '2025-11-15T20:30:00Z',
  leaders: [{
    rank: 1,
    previousRank: 3,
    traderId: 'uuid',
    name: 'Trader Name',
    isVerified: true,
    score: 45.5,  // e.g., % return
    metrics: { ... },
    followerCount: 2500
  }]
}
```

### Trade Feed

**GET /api/feed/trades**
```javascript
Query Parameters:
  ?traderIds=uuid1,uuid2
  &symbols=AAPL,TSLA
  &since=2025-11-15T00:00:00Z
  &limit=50

Response: {
  trades: [{
    id: 'uuid',
    traderId: 'uuid',
    traderName: 'Trader Name',
    symbol: 'AAPL',
    action: 'BUY',
    price: 175.50,
    quantity: 100,  // or null
    percentOfPortfolio: 5.2,  // if quantity hidden
    executedAt: '2025-11-15T14:30:00Z',
    currentPrice: 176.20,
    unrealizedPnL: 70.00
  }]
}
```

**WebSocket /ws/trades**
```javascript
Subscribe: {
  action: 'subscribe',
  traderIds: ['uuid1', 'uuid2']
}

Message: {
  type: 'trade',
  trade: { ... }  // same format as GET /api/feed/trades
}
```

## User Interface Requirements

### Trader Account Connection Page

**Layout:**
- Prominent "Connect Brokerage Account" button
- List of supported brokerages with logos
- Clear explanation of permissions requested (read-only)
- Security badges (encryption, SOC 2)
- FAQ section addressing common concerns

**Flow:**
1. Trader selects brokerage
2. Redirect to brokerage OAuth page
3. Trader authorizes read-only access
4. Redirect back to platform
5. Show "Verification in progress" message
6. Email notification when verification complete

### Trader Discovery Page

**Layout:**
- Filter panel (left sidebar)
  - Performance filters (win rate, returns, drawdown)
  - Timeframe selector (7D, 30D, 90D, YTD)
  - Verification filter (verified only toggle)
  - Risk filters (Sharpe ratio, max drawdown)
- Sort options dropdown (top performers, best win rate, etc.)
- Trader grid/list (main area)
  - Trader card with key metrics
  - Verified badge
  - Follow button
  - Quick stats (30D return, win rate, followers)
- Pagination controls

**Trader Card:**
```
[Profile Picture] [Verified Badge]
Trader Name
30D Return: +25.5%  Win Rate: 72.5%
Sharpe: 1.8  Max DD: -12.3%
1,250 followers  |  [Follow Button]
```

### Trader Profile Page

**Sections:**

1. **Header**
   - Profile picture, name, verified badge
   - Follow/Unfollow button
   - Follower count
   - "Connected since [date]"

2. **Performance Dashboard**
   - Metric cards for each timeframe (7D, 30D, 90D, YTD)
   - Total return, win rate, Sharpe ratio, max drawdown
   - Color-coded (green for positive, red for negative)

3. **Equity Curve Chart**
   - Line chart showing account value over time
   - Drawdown overlay (shaded red areas)
   - Benchmark comparison (S&P 500)
   - Zoom controls (1M, 3M, 6M, 1Y, ALL)

4. **Statistics Grid**
   - Win/loss breakdown
   - Avg win vs avg loss
   - Profit factor
   - Best/worst trades
   - Avg holding period
   - Current positions count

5. **Recent Trades Table**
   - Symbol, action, entry/exit, P&L, date
   - Sortable columns
   - Filter by win/loss
   - "View All Trades" link

6. **Risk Metrics**
   - Max drawdown history
   - Current drawdown
   - Volatility chart
   - Sharpe ratio explanation

### Leaderboard Page

**Layout:**
- Tab navigation (Top Performers, Best Win Rate, Highest Sharpe, Trending)
- Timeframe selector (7D, 30D, 90D, YTD)
- Podium visualization for top 3
- Ranked list table
  - Rank, name, key metric, change indicator
  - Click to view full profile
- "Verified Only" toggle
- Auto-refresh timer ("Updated 2 hours ago")

### Real-Time Trade Feed

**Layout:**
- Filter by followed traders or all verified traders
- Filter by symbols
- Live updating list of recent trades
- Each trade shows:
  - Trader avatar and name
  - "Bought/Sold [quantity] shares of [SYMBOL] at $[price]"
  - Timestamp ("2 minutes ago")
  - Current P&L if position still open
  - "Copy Trade" button (if following)

**WebSocket Indicator:**
- Connection status indicator (green dot = live)
- Reconnection message if disconnected

## Security & Compliance

### Data Security Measures

1. **Encryption**
   - All brokerage credentials encrypted at rest (AES-256)
   - TLS 1.3 for all API communications
   - Database-level encryption for trading data
   - Encrypted backups

2. **Access Control**
   - Role-based access control (RBAC)
   - Principle of least privilege
   - Audit logs for all sensitive data access
   - Multi-factor authentication for admin accounts

3. **Token Management**
   - Secure token storage (encrypted)
   - Automatic token rotation
   - Token expiration enforcement
   - Refresh token flow

4. **API Security**
   - Rate limiting per user/IP
   - Input validation and sanitization
   - SQL injection prevention
   - CSRF protection

### Compliance Requirements

1. **Regulatory Disclaimers**
   - "Past performance does not guarantee future results"
   - "Trading involves risk of loss"
   - "Verify all trades before execution"
   - Clear disclosure that platform is not a registered investment advisor

2. **Data Retention**
   - Maintain trading data for minimum 7 years (SEC requirement)
   - Secure archival of deleted account data
   - Right to deletion (GDPR) with regulatory exceptions

3. **Financial Regulations**
   - Comply with SEC regulations for trade data display
   - No trade execution without proper broker-dealer registration
   - Clear separation between data display and trade execution
   - Consider FINRA membership if facilitating trades

4. **Privacy Compliance**
   - GDPR compliance for EU users
   - CCPA compliance for California users
   - Clear privacy policy
   - User consent for data collection
   - Data portability features

### Audit & Monitoring

1. **System Audits**
   - Monthly security audits
   - Quarterly penetration testing
   - Annual SOC 2 audit (recommended)
   - Regular code security reviews

2. **Data Quality Audits**
   - Weekly spot checks of metric calculations
   - Monthly reconciliation of snapshot data
   - Quarterly review of flagged anomalies
   - Annual comprehensive data audit

3. **Monitoring**
   - Real-time alerts for sync failures
   - Performance monitoring (response times, error rates)
   - Security monitoring (unusual access patterns)
   - Compliance monitoring (regulatory requirement adherence)

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)

**Deliverables:**
- Brokerage integration framework
- OAuth flow for 1-2 primary brokerages (Interactive Brokers, Alpaca)
- Basic account connection UI
- Database schema for accounts and snapshots
- Daily snapshot collection (cron job)

**Success Criteria:**
- 10 test accounts connected successfully
- Daily snapshots captured for 7 consecutive days
- Zero security vulnerabilities identified in code review

### Phase 2: Metrics & Discovery (Weeks 5-8)

**Deliverables:**
- Performance metrics calculation engine
- Core metrics implementation (return, win rate, Sharpe, drawdown)
- Trader discovery API with filtering
- Trader profile page with performance dashboard
- Admin dashboard for sync monitoring

**Success Criteria:**
- Metrics calculated accurately (validated against manual calculations)
- Discovery queries return results in <2 seconds
- 50+ traders onboarded with verified data

### Phase 3: Real-Time & Feed (Weeks 9-12)

**Deliverables:**
- Real-time trade detection (polling service)
- Trade notification system
- Real-time trade feed (WebSocket)
- Leaderboard implementation
- Advanced filtering and ranking algorithms

**Success Criteria:**
- Trades detected within 5 minutes of execution
- Notifications sent within 10 minutes
- WebSocket maintains stable connections for 100+ concurrent users
- Leaderboards update daily without manual intervention

### Phase 4: Scale & Polish (Weeks 13-16)

**Deliverables:**
- Additional brokerage integrations (TD Ameritrade, E*TRADE)
- Advanced analytics (alpha, beta, sector exposure)
- Privacy controls for traders
- Fraud detection system
- Performance optimizations (caching, query optimization)
- Comprehensive testing and bug fixes

**Success Criteria:**
- System supports 1,000+ connected accounts
- 99.5% sync success rate
- <1% false positive rate on fraud detection
- All critical bugs resolved

### Phase 5: Production Launch (Week 17+)

**Deliverables:**
- Security audit and penetration testing
- Load testing and performance validation
- Documentation (API docs, user guides)
- Marketing materials (trader onboarding guide)
- Monitoring and alerting setup
- Soft launch to beta users

**Success Criteria:**
- Pass security audit
- Handle 10,000 concurrent users
- <0.1% error rate in production
- Positive feedback from 50+ beta users

## Success Metrics

### Trader Adoption

- **Connected Accounts**: 1,000+ connected accounts within 6 months
- **Verification Rate**: >80% of connected accounts successfully verified
- **Retention**: >70% of verified traders remain connected after 90 days
- **Sync Success**: >99% daily snapshot success rate

### User Engagement

- **Discovery Usage**: >50% of users use trader discovery feature
- **Profile Views**: Average 10+ trader profile views per user per session
- **Following**: Average 5+ verified traders followed per active user
- **Trade Feed**: >30% of users check trade feed daily

### Data Quality

- **Sync Timeliness**: >95% of daily snapshots complete within 2 hours of market close
- **Metric Accuracy**: <1% variance in spot checks vs manual calculations
- **Data Completeness**: >98% of expected data points captured
- **Fraud Detection**: <5% false positive rate on flagged accounts

### Platform Health

- **Uptime**: >99.5% uptime for sync operations
- **API Performance**: <2 second response time for 95th percentile
- **Error Rate**: <0.5% error rate across all API endpoints
- **Security**: Zero data breaches or unauthorized access incidents

### Business Impact

- **User Retention**: >60% of users who follow verified traders remain active after 30 days
- **Trade Copy Rate**: >20% of trade notifications result in copy attempts
- **Platform Trust**: >4.5/5 user satisfaction rating for data accuracy
- **Growth**: 20% month-over-month growth in verified trader count

## Open Questions & Risks

### Open Questions

1. **Brokerage Approval**: Have we confirmed all target brokerages allow third-party read-only access? Are there application/approval processes?

2. **Real-Time Data Costs**: What are the costs for real-time market data subscriptions for each brokerage API?

3. **Position Sizing for Copy Trades**: How should the system recommend position sizes when user copies a trade? Same dollar amount, same % of portfolio, or user-defined?

4. **Minimum Trading History**: What's the minimum number of trades required before displaying a trader's metrics publicly? (Recommendation: 20-30 trades for statistical significance)

5. **Performance Benchmark**: Should we use S&P 500 as default benchmark for alpha/beta calculations, or allow users to select benchmarks?

6. **Trader Compensation**: Should top-performing traders receive compensation or revenue share? How does this affect platform economics?

7. **Paper Trading**: Should we allow traders to connect paper trading accounts, or only live accounts?

8. **Multi-Account Support**: Can a single trader connect multiple brokerage accounts? How should metrics be aggregated?

9. **International Expansion**: What's the timeline for supporting non-US brokerages and international markets?

10. **Trade Execution**: Does the platform facilitate trade execution, or is this purely informational? If facilitating, what broker-dealer partnerships are needed?

### Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Brokerage API Changes** | High | Medium | Build abstraction layer; maintain relationships with brokerage developer support; monitor API deprecation notices |
| **Data Privacy Breach** | Critical | Low | Implement robust encryption; regular security audits; cyber insurance; incident response plan |
| **Sync Failures at Scale** | High | Medium | Queue-based architecture; retry logic; graceful degradation; monitoring and alerts |
| **Fraudulent Trading Data** | High | Medium | Anomaly detection; manual review of suspicious patterns; community reporting; trader verification |
| **Regulatory Compliance** | Critical | Medium | Legal counsel review; SOC 2 compliance; clear disclaimers; avoid investment advice |
| **API Rate Limiting** | Medium | High | Implement caching; batch requests; respect rate limits; upgrade to premium API tiers |
| **User Privacy Concerns** | Medium | Medium | Transparent privacy policy; granular privacy controls; opt-out options; clear data usage disclosure |
| **Market Data Accuracy** | High | Low | Use reputable data sources; validation checks; display data source and timestamp; handle corporate actions |
| **Scalability Bottlenecks** | High | Medium | Horizontal scaling; database sharding; caching layer; performance testing; CDN for static assets |
| **Trader Churn** | Medium | High | Incentivize top traders; showcase benefits; streamline connection process; excellent support |

## Appendix

### Glossary

- **Win Rate**: Percentage of closed trades that resulted in profit
- **Sharpe Ratio**: Risk-adjusted return metric (excess return / standard deviation)
- **Maximum Drawdown**: Largest peak-to-trough decline in account value
- **Profit Factor**: Ratio of gross profit to gross loss
- **Alpha**: Excess return compared to benchmark (market)
- **Beta**: Volatility relative to benchmark
- **Time-Weighted Return (TWR)**: Return calculation that eliminates impact of deposits/withdrawals
- **Position**: Open stock holding in a portfolio
- **Realized P&L**: Profit or loss from a closed trade
- **Unrealized P&L**: Current profit or loss on an open position

### References

- SEC Rule 17a-4: Record retention requirements
- FINRA Rule 2210: Communications with the public
- Brokerage API Documentation:
  - Interactive Brokers: https://interactivebrokers.github.io/cpwebapi/
  - TD Ameritrade: https://developer.tdameritrade.com/
  - Alpaca: https://alpaca.markets/docs/
- Time-Weighted Return Calculation: https://www.cfainstitute.org/
- Sharpe Ratio Methodology: https://web.stanford.edu/~wfsharpe/

### Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-15 | Product Team | Initial draft |

---

**Document Status**: Draft for Review  
**Next Review Date**: 2025-11-22  
**Approvals Required**: Engineering Lead, Security Team, Legal/Compliance
