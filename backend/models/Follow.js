const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Follow = sequelize.define('Follow', {
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
  traderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'traders',
      key: 'id'
    }
  },
  followedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'follows',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'traderId']
    }
  ]
});

module.exports = Follow;

