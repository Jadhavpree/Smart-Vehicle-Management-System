import { api } from '../lib/api';

export interface SystemFlowData {
  userId: string;
  vehicleId?: string;
  bookingId?: string;
  jobCardId?: string;
  invoiceId?: string;
}

export class SystemFlow {
  // Phase A: Onboarding
  static async registerVehicle(userId: string, vehicleData: any) {
    const response = await api.post('/vehicles', { ...vehicleData, owner: userId });
    return response.data;
  }

  // Phase B: Service Trigger
  static async createBooking(vehicleId: string, bookingData: any) {
    const response = await api.post('/bookings', { ...bookingData, vehicle: vehicleId });
    return response.data;
  }

  static async approveBooking(bookingId: string) {
    const response = await api.patch(`/bookings/${bookingId}`, { status: 'confirmed' });
    return response.data;
  }

  // Phase C: Workshop Core
  static async createJobCard(bookingId: string) {
    const response = await api.post('/jobcards', { booking: bookingId });
    await api.patch(`/bookings/${bookingId}`, { status: 'job_card_created' });
    return response.data;
  }

  static async addPartToJobCard(jobCardId: string, partData: any) {
    const response = await api.post(`/jobcards/${jobCardId}/parts`, partData);
    await api.patch(`/inventory/${partData.partId}`, {
      $inc: { currentStock: -partData.quantity }
    });
    return response.data;
  }

  static async updateJobCardProgress(jobCardId: string, status: string) {
    const response = await api.patch(`/jobcards/${jobCardId}`, { status });
    if (status === 'completed') {
      const jobCard = await api.get(`/jobcards/${jobCardId}`);
      await api.patch(`/bookings/${jobCard.data.booking}`, { status: 'ready_for_billing' });
    }
    return response.data;
  }

  // Phase D: Financials
  static async generateInvoice(jobCardId: string) {
    const response = await api.post('/invoices', { jobCard: jobCardId });
    return response.data;
  }

  static async processPayment(invoiceId: string, paymentData: any) {
    const response = await api.patch(`/invoices/${invoiceId}`, {
      paymentStatus: 'paid',
      paymentMethod: paymentData.method,
      paidDate: new Date()
    });
    const invoice = await api.get(`/invoices/${invoiceId}`);
    const jobCard = await api.get(`/jobcards/${invoice.data.jobCard}`);
    await api.patch(`/bookings/${jobCard.data.booking}`, { status: 'paid' });
    return response.data;
  }

  // Role-based redirects
  static getDefaultRoute(userRole: string): string {
    switch (userRole) {
      case 'admin': return '/admin';
      case 'mechanic': return '/service-center';
      case 'customer':
      default: return '/customer';
    }
  }
}