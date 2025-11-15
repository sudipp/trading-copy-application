const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { Follow, CopiedTrade, Trade, Trader, Notification } = require('../models');
const { Op } = require('sequelize');

/**
 * Get dashboard summary
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get followed traders count
    const followedTradersCount = await Follow.count({ where: { userId } });

    // Get pending approvals count
    const pendingApprovalsCount = await CopiedTrade.count({
      where: { userId, status: 'pending' }
    });

    // Get recent trades from followed traders
    const follows = await Follow.findAll({
      where: { userId },
      attributes: ['traderId']
    });
    const traderIds = follows.map(f => f.traderId);

    const recentTrades = await Trade.findAll({
      where: {
        traderId: { [Op.in]: traderIds },
        timestamp: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      },
      include: [{
        model: Trader,
        as: 'trader',
        attributes: ['id', 'name']
      }],
      limit: 5,
      order: [['timestamp', 'DESC']]
    });

    // Get unread notifications count
    const unreadNotificationsCount = await Notification.count({
      where: { userId, isRead: false }
    });

    // Get portfolio performance (simplified - sum of executed trades)
    const executedTrades = await CopiedTrade.findAll({
      where: { userId, status: 'executed' }
    });

    const totalInvested = executedTrades.reduce((sum, trade) => {
      return sum + parseFloat(trade.positionSize);
    }, 0);

    res.json({
      summary: {
        followedTraders: followedTradersCount,
        pendingApprovals: pendingApprovalsCount,
        unreadNotifications: unreadNotificationsCount,
        totalInvested
      },
      recentTrades
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get portfolio performance
 */
router.get('/portfolio', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const executedTrades = await CopiedTrade.findAll({
      where: { userId, status: 'executed' },
      include: [{
        model: Trade,
        as: 'originalTrade',
        attributes: ['symbol', 'entryPrice']
      }]
    });

    // Calculate portfolio metrics (simplified)
    const totalInvested = executedTrades.reduce((sum, trade) => {
      return sum + parseFloat(trade.positionSize);
    }, 0);

    const totalTrades = executedTrades.length;
    const winningTrades = executedTrades.filter(trade => {
      // Simplified: assume trade is winning if current price > entry price
      // In production, you'd fetch current prices and calculate actual P&L
      return true; // Placeholder
    }).length;

    res.json({
      totalInvested,
      totalTrades,
      winningTrades,
      winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
      trades: executedTrades
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

