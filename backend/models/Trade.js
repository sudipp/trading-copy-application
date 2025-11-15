const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trade = sequelize.define('Trade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  traderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'traders',
      key: 'id'
    }
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entryPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  positionSize: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tradeType: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  rationale: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'trades',
  timestamps: true
});

module.exports = Trade;

