const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { authenticate } = require('../middleware/auth');
const { getUserNotifications } = require('../services/notificationService');

/**
 * Get user notifications
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const result = await getUserNotifications(req.user.userId, {
      page,
      limit,
      unreadOnly: unreadOnly === 'true'
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Mark notification as read
 */
router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    next(error);
  }
});

/**
 * Mark all notifications as read
 */
router.put('/read-all', authenticate, async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.userId, isRead: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

