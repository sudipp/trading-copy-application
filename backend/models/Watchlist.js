const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Watchlist = sequelize.define('Watchlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  symbol: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'watchlists',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'symbol']
    },
    {
      fields: ['userId']
    }
  ]
});

module.exports = Watchlist;
