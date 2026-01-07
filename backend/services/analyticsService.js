const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const JobCard = require('../models/JobCard');
const Inventory = require('../models/Inventory');

class AnalyticsService {
  async getOverviewAnalytics(serviceCenterId = null) {
    const filter = serviceCenterId ? { serviceCenter: serviceCenterId } : {};
    
    const [revenue, bookings, customers, inventory] = await Promise.all([
      this.getRevenueAnalytics(serviceCenterId),
      this.getBookingAnalytics(serviceCenterId),
      this.getCustomerAnalytics(),
      this.getInventoryAnalytics(serviceCenterId)
    ]);

    return { revenue, bookings, customers, inventory };
  }

  async getRevenueAnalytics(serviceCenterId = null) {
    const filter = serviceCenterId ? { serviceCenter: serviceCenterId, status: 'paid' } : { status: 'paid' };
    
    const invoices = await Invoice.find(filter).populate('serviceCenter');
    const total = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    // Current month revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyInvoices = invoices.filter(inv => new Date(inv.createdAt) >= startOfMonth);
    const monthly = monthlyInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    // Last month revenue for growth calculation
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthInvoices = invoices.filter(inv => {
      const date = new Date(inv.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastMonthTotal = lastMonthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const growth = lastMonthTotal > 0 ? ((monthly - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 0;

    // Last 6 months trend
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthInvoices = invoices.filter(inv => {
        const date = new Date(inv.createdAt);
        return date >= monthDate && date <= monthEnd;
      });
      const amount = monthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      trend.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        amount: parseFloat(amount.toFixed(2))
      });
    }

    return { total, monthly, growth: parseFloat(growth), trend };
  }

  async getBookingAnalytics(serviceCenterId = null) {
    const filter = serviceCenterId ? { serviceCenter: serviceCenterId } : {};
    
    const bookings = await Booking.find(filter);
    const total = bookings.length;

    const byStatus = {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };

    // Last 6 months trend
    const now = new Date();
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthBookings = bookings.filter(b => {
        const date = new Date(b.createdAt);
        return date >= monthDate && date <= monthEnd;
      });
      trend.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        count: monthBookings.length
      });
    }

    // Service type distribution
    const serviceTypes = {};
    bookings.forEach(b => {
      const type = b.serviceType || 'Other';
      serviceTypes[type] = (serviceTypes[type] || 0) + 1;
    });

    const topServices = Object.entries(serviceTypes)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { total, byStatus, trend, topServices };
  }

  async getCustomerAnalytics() {
    const customers = await User.find({ role: 'customer' });
    const total = customers.length;

    // New customers this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = customers.filter(c => new Date(c.createdAt) >= startOfMonth).length;

    // Last 6 months growth
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthCustomers = customers.filter(c => {
        const date = new Date(c.createdAt);
        return date >= monthDate && date <= monthEnd;
      });
      trend.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        count: monthCustomers.length
      });
    }

    return { total, newThisMonth, trend };
  }

  async getInventoryAnalytics(serviceCenterId = null) {
    const filter = serviceCenterId ? { serviceCenter: serviceCenterId } : {};
    
    const items = await Inventory.find(filter);
    const lowStock = items.filter(item => item.quantity <= item.minStockLevel).length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalItems = items.length;

    return { lowStock, totalValue, totalItems };
  }
}

module.exports = new AnalyticsService();
