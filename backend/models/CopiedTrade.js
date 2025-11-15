const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CopiedTrade = sequelize.define('CopiedTrade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  originalTradeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'trades',
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
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'executed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  executedAt: {
    type: DataTypes.DATE,
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
  tableName: 'copied_trades',
  timestamps: true
});

module.exports = CopiedTrade;

