import React from 'react';
import api from '../../services/api';
import './NotificationItem.css';

interface NotificationItemProps {
  notification: any;
  onRead: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
  const handleMarkRead = async () => {
    try {
      await api.put(`/notifications/${notification.id}/read`);
      onRead();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div
      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
      onClick={handleMarkRead}
    >
      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;

