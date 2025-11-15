const { Notification } = require('../models');

/**
 * Create a notification
 */
async function createNotification({ userId, type, message, relatedTradeId = null }) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      relatedTradeId,
      isRead: false
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Get user notifications
 */
async function getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = { userId };

  if (unreadOnly) {
    where.isRead = false;
  }

  const { count, rows: notifications } = await Notification.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    notifications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / parseInt(limit))
    }
  };
}

module.exports = {
  createNotification,
  getUserNotifications
};

