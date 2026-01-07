import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    if (notification.relatedModel === 'Booking' && notification.relatedId) {
      navigate('/customer-dashboard');
    } else if (notification.relatedModel === 'Invoice' && notification.relatedId) {
      navigate(`/invoice/${notification.relatedId}`);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking: '📅',
      payment: '💳',
      invoice: '📄',
      status_change: '🔔',
      system: 'ℹ️'
    };
    return icons[type] || '🔔';
  };

  const formatTime = (date) => {
    const notifDate = new Date(date);
    return notifDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell size={28} className="text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-sm text-gray-600">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCheck size={18} />
                  Mark All Read
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Bell size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm mt-2">
                  {filter === 'unread' && 'You have no unread notifications'}
                  {filter === 'read' && 'You have no read notifications'}
                  {filter === 'all' && 'You have no notifications yet'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        onClick={() => handleNotificationClick(notification)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">
                              {notification.title}
                              {!notification.isRead && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </p>
                            <p className="text-gray-700 mt-1">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
