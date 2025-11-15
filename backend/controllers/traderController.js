const { Trader, Follow, Trade, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get list of traders with pagination and filtering
 */
async function getTraders(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      minWinRate,
      minReturns,
      isVerified,
      sortBy = 'totalReturns',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (minWinRate) {
      where.winRate = { [Op.gte]: parseFloat(minWinRate) };
    }

    if (minReturns) {
      where.totalReturns = { [Op.gte]: parseFloat(minReturns) };
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified === 'true';
    }

    const validSortFields = ['totalReturns', 'winRate', 'tradeCount', 'socialFollowers', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'totalReturns';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: traders } = await Trader.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortField, order]],
      include: [{
        model: Follow,
        as: 'followers',
        attributes: ['id']
      }]
    });

    // Add follower count to each trader
    const tradersWithCounts = traders.map(trader => ({
      ...trader.toJSON(),
      followerCount: trader.followers ? trader.followers.length : 0
    }));

    res.json({
      traders: tradersWithCounts,
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
 * Get trader by ID with detailed information
 */
async function getTraderById(req, res, next) {
  try {
    const { id } = req.params;

    const trader = await Trader.findByPk(id, {
      include: [
        {
          model: Follow,
          as: 'followers',
          attributes: ['id', 'userId']
        },
        {
          model: Trade,
          as: 'trades',
          limit: 10,
          order: [['timestamp', 'DESC']]
        }
      ]
    });

    if (!trader) {
      return res.status(404).json({ message: 'Trader not found' });
    }

    // Check if current user is following this trader
    let isFollowing = false;
    if (req.user) {
      const follow = await Follow.findOne({
        where: {
          userId: req.user.userId,
          traderId: id
        }
      });
      isFollowing = !!follow;
    }

    res.json({
      ...trader.toJSON(),
      followerCount: trader.followers ? trader.followers.length : 0,
      isFollowing
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get trader's trade history
 */
async function getTraderTrades(req, res, next) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const trader = await Trader.findByPk(id);
    if (!trader) {
      return res.status(404).json({ message: 'Trader not found' });
    }

    const { count, rows: trades } = await Trade.findAndCountAll({
      where: { traderId: id },
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
 * Follow a trader
 */
async function followTrader(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const trader = await Trader.findByPk(id);
    if (!trader) {
      return res.status(404).json({ message: 'Trader not found' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      where: { userId, traderId: id }
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this trader' });
    }

    const follow = await Follow.create({
      userId,
      traderId: id
    });

    res.status(201).json({
      message: 'Successfully followed trader',
      follow
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Unfollow a trader
 */
async function unfollowTrader(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const follow = await Follow.findOne({
      where: { userId, traderId: id }
    });

    if (!follow) {
      return res.status(404).json({ message: 'Not following this trader' });
    }

    await follow.destroy();

    res.json({ message: 'Successfully unfollowed trader' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get list of traders user is following
 */
async function getFollowingTraders(req, res, next) {
  try {
    const userId = req.user.userId;

    const follows = await Follow.findAll({
      where: { userId },
      include: [{
        model: Trader,
        as: 'trader'
      }]
    });

    const traders = follows.map(follow => follow.trader);

    res.json({ traders });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTraders,
  getTraderById,
  getTraderTrades,
  followTrader,
  unfollowTrader,
  getFollowingTraders
};

