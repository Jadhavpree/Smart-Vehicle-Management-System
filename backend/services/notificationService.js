const Notification = require('../models/Notification');

class NotificationService {
  async createNotification(userId, type, title, message, relatedId = null, relatedModel = null) {
    try {
      const notification = new Notification({
        user: userId,
        type,
        title,
        message,
        relatedId,
        relatedModel
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async createBookingNotification(booking, status) {
    const messages = {
      pending: `Your booking for ${booking.serviceType} has been submitted and is pending approval.`,
      approved: `Great news! Your booking for ${booking.serviceType} has been approved.`,
      rejected: `Your booking for ${booking.serviceType} has been rejected.`,
      in_progress: `Your ${booking.serviceType} service is now in progress.`,
      completed: `Your ${booking.serviceType} service has been completed.`
    };

    return this.createNotification(
      booking.customer,
      'booking',
      `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      messages[status],
      booking._id,
      'Booking'
    );
  }

  async createPaymentNotification(invoice, userId) {
    return this.createNotification(
      userId,
      'payment',
      'Payment Successful',
      `Your payment of ₹${invoice.totalAmount} has been processed successfully.`,
      invoice._id,
      'Invoice'
    );
  }

  async createInvoiceNotification(invoice, userId) {
    return this.createNotification(
      userId,
      'invoice',
      'New Invoice Generated',
      `A new invoice of ₹${invoice.totalAmount} has been generated for your service.`,
      invoice._id,
      'Invoice'
    );
  }

  async getUserNotifications(userId, limit = 50) {
    return Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getUnreadCount(userId) {
    return Notification.countDocuments({ user: userId, isRead: false });
  }

  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
  }

  async deleteNotification(notificationId, userId) {
    return Notification.findOneAndDelete({ _id: notificationId, user: userId });
  }
}

module.exports = new NotificationService();
