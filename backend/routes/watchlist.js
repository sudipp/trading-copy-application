const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { Watchlist } = require('../models');

/**
 * Get user's watchlist
 * GET /api/watchlist
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const watchlist = await Watchlist.findAll({
      where: { userId },
      attributes: ['id', 'symbol', 'name', 'addedAt'],
      order: [['addedAt', 'DESC']]
    });

    res.json(watchlist);
  } catch (error) {
    next(error);
  }
});

/**
 * Add stock to watchlist
 * POST /api/watchlist
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { symbol, name } = req.body;

    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      where: { userId, symbol: symbol.toUpperCase() }
    });

    if (existing) {
      return res.status(409).json({ message: 'Stock already in watchlist' });
    }

    const watchlistItem = await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      name: name || symbol.toUpperCase()
    });

    res.status(201).json(watchlistItem);
  } catch (error) {
    next(error);
  }
});

/**
 * Remove stock from watchlist
 * DELETE /api/watchlist/:symbol
 */
router.delete('/:symbol', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { symbol } = req.params;

    const deleted = await Watchlist.destroy({
      where: { 
        userId, 
        symbol: symbol.toUpperCase() 
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Stock not found in watchlist' });
    }

    res.json({ message: 'Stock removed from watchlist' });
  } catch (error) {
    next(error);
  }
});

/**
 * Sync watchlist (bulk add/remove)
 * PUT /api/watchlist/sync
 */
router.put('/sync', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { symbols } = req.body;

    if (!Array.isArray(symbols)) {
      return res.status(400).json({ message: 'Symbols must be an array' });
    }

    // Get current watchlist
    const currentWatchlist = await Watchlist.findAll({
      where: { userId },
      attributes: ['symbol']
    });
    const currentSymbols = currentWatchlist.map(w => w.symbol);

    // Determine what to add and remove
    const normalizedSymbols = symbols.map(s => s.toUpperCase());
    const toAdd = normalizedSymbols.filter(s => !currentSymbols.includes(s));
    const toRemove = currentSymbols.filter(s => !normalizedSymbols.includes(s));

    // Remove stocks not in the new list
    if (toRemove.length > 0) {
      await Watchlist.destroy({
        where: {
          userId,
          symbol: toRemove
        }
      });
    }

    // Add new stocks
    if (toAdd.length > 0) {
      const newItems = toAdd.map(symbol => ({
        userId,
        symbol,
        name: symbol
      }));
      await Watchlist.bulkCreate(newItems, { ignoreDuplicates: true });
    }

    // Return updated watchlist
    const updatedWatchlist = await Watchlist.findAll({
      where: { userId },
      attributes: ['id', 'symbol', 'name', 'addedAt'],
      order: [['addedAt', 'DESC']]
    });

    res.json({
      message: 'Watchlist synced successfully',
      added: toAdd.length,
      removed: toRemove.length,
      watchlist: updatedWatchlist
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
