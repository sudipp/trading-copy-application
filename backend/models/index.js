const { sequelize } = require('../config/database');
const User = require('./User');
const Trader = require('./Trader');
const Trade = require('./Trade');
const Follow = require('./Follow');
const CopiedTrade = require('./CopiedTrade');
const Notification = require('./Notification');
const Watchlist = require('./Watchlist');

// Define associations
User.hasMany(Follow, { foreignKey: 'userId', as: 'follows' });
Follow.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Follow.belongsTo(Trader, { foreignKey: 'traderId', as: 'trader' });

Trader.hasMany(Follow, { foreignKey: 'traderId', as: 'followers' });
Trader.hasMany(Trade, { foreignKey: 'traderId', as: 'trades' });

Trade.belongsTo(Trader, { foreignKey: 'traderId', as: 'trader' });
Trade.hasMany(CopiedTrade, { foreignKey: 'originalTradeId', as: 'copies' });

User.hasMany(CopiedTrade, { foreignKey: 'userId', as: 'copiedTrades' });
CopiedTrade.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CopiedTrade.belongsTo(Trade, { foreignKey: 'originalTradeId', as: 'originalTrade' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Watchlist, { foreignKey: 'userId', as: 'watchlist' });
Watchlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Trader,
  Trade,
  Follow,
  CopiedTrade,
  Notification,
  Watchlist
};

