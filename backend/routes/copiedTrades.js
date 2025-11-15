const express = require('express');
const router = express.Router();
const { CopiedTrade } = require('../models');
const { authenticate } = require('../middleware/auth');
const { createNotification } = require('../services/notificationService');

/**
 * Approve a copied trade
 */
router.put('/:id/approve', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const copiedTrade = await CopiedTrade.findOne({
      where: { id, userId, status: 'pending' }
    });

    if (!copiedTrade) {
      return res.status(404).json({ message: 'Pending copied trade not found' });
    }

    copiedTrade.status = 'approved';
    copiedTrade.approvedAt = new Date();
    await copiedTrade.save();

    // Create notification
    await createNotification({
      userId,
      type: 'trade_approved',
      message: `Trade ${copiedTrade.symbol} approved and ready for execution`,
      relatedTradeId: copiedTrade.originalTradeId
    });

    res.json({
      message: 'Trade approved successfully',
      copiedTrade
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Reject a copied trade
 */
router.put('/:id/reject', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const copiedTrade = await CopiedTrade.findOne({
      where: { id, userId, status: 'pending' }
    });

    if (!copiedTrade) {
      return res.status(404).json({ message: 'Pending copied trade not found' });
    }

    copiedTrade.status = 'rejected';
    await copiedTrade.save();

    // Create notification
    await createNotification({
      userId,
      type: 'trade_rejected',
      message: `Trade ${copiedTrade.symbol} was rejected`,
      relatedTradeId: copiedTrade.originalTradeId
    });

    res.json({
      message: 'Trade rejected successfully',
      copiedTrade
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

