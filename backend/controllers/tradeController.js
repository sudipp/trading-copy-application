const { Trade, CopiedTrade, Trader, Follow } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');

/**
 * Get trades from followed traders
 */
async function getTrades(req, res, next) {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get followed trader IDs
    const follows = await Follow.findAll({
      where: { userId },
      attributes: ['traderId']
    });

    const traderIds = follows.map(f => f.traderId);

    if (traderIds.length === 0) {
      return res.json({
        trades: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    const { count, rows: trades } = await Trade.findAndCountAll({
      where: {
        traderId: { [Op.in]: traderIds }
      },
      include: [{
        model: Trader,
        as: 'trader',
        attributes: ['id', 'name', 'isVerified']
      }],
      limit: parseInt(limit),
      offset,
      order: [['timestamp', 'DESC']]
    });

    res.json({
      trades,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get trade by ID
 */
async function getTradeById(req, res, next) {
  try {
    const { id } = req.params;

    const trade = await Trade.findByPk(id, {
      include: [{
        model: Trader,
        as: 'trader',
        attributes: ['id', 'name', 'isVerified', 'winRate', 'totalReturns']
      }]
    });

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    res.json({ trade });
  } catch (error) {
    next(error);
  }
}

/**
 * Copy a trade (create pending copied trade)
 */
async function copyTrade(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const trade = await Trade.findByPk(id);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Check if already copied
    const existingCopy = await CopiedTrade.findOne({
      where: {
        userId,
        originalTradeId: id
      }
    });

    if (existingCopy) {
      return res.status(400).json({ message: 'Trade already copied' });
    }

    // Create copied trade with pending status
    const copiedTrade = await CopiedTrade.create({
      userId,
      originalTradeId: id,
      symbol: trade.symbol,
      entryPrice: trade.entryPrice,
      positionSize: trade.positionSize,
      tradeType: trade.tradeType,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Trade copied successfully. Please approve to execute.',
      copiedTrade
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's copied trades
 */
async function getCopiedTrades(req, res, next) {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { userId };

    if (status) {
      where.status = status;
    }

    const { count, rows: copiedTrades } = await CopiedTrade.findAndCountAll({
      where,
      include: [{
        model: Trade,
        as: 'originalTrade',
        include: [{
          model: Trader,
          as: 'trader',
          attributes: ['id', 'name']
        }]
      }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      copiedTrades,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTrades,
  getTradeById,
  copyTrade,
  getCopiedTrades
};

