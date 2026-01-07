const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Generic HTTP methods
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  patch: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (name: string, email: string, password: string, role: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return response.json();
  },

  resetPassword: async (email: string, newPassword: string) => {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    return response.json();
  },

  // Users
  getUserProfile: async (token: string) => {
    const response = await fetch(`${API_BASE}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateProfile: async (token: string, profileData: any) => {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(profileData)
    });
    return response.json();
  },

  changePassword: async (token: string, currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE}/users/change-password`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return response.json();
  },

  // Vehicles
  getVehicles: async (token: string) => {
    const response = await fetch(`${API_BASE}/vehicles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  addVehicle: async (token: string, vehicle: any) => {
    const response = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(vehicle)
    });
    return response.json();
  },

  updateVehicle: async (token: string, vehicleId: string, vehicleData: any) => {
    const response = await fetch(`${API_BASE}/vehicles/${vehicleId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(vehicleData)
    });
    return response.json();
  },

  deleteVehicle: async (token: string, vehicleId: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getVehicleHistory: async (token: string, vehicleId: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vehicleId}/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Bookings
  getBookings: async (token: string) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createBooking: async (token: string, booking: any) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(booking)
    });
    return response.json();
  },

  // Service Center
  getServiceCenters: async (token: string) => {
    const response = await fetch(`${API_BASE}/servicecenter/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getServiceCenterBookings: async (token: string) => {
    const response = await fetch(`${API_BASE}/servicecenter/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateBookingStatus: async (token: string, bookingId: string, status: string) => {
    const response = await fetch(`${API_BASE}/servicecenter/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    return response.json();
  },

  getServiceCenterStats: async (token: string) => {
    const response = await fetch(`${API_BASE}/servicecenter/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Job Cards
  createJobCard: async (token: string, jobCardData: any) => {
    const response = await fetch(`${API_BASE}/jobcards`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(jobCardData)
    });
    return response.json();
  },

  getJobCards: async (token: string) => {
    const response = await fetch(`${API_BASE}/jobcards`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateJobCardProgress: async (token: string, jobCardId: string, progress: number, description: string) => {
    const response = await fetch(`${API_BASE}/jobcards/${jobCardId}/progress`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ progress, description })
    });
    return response.json();
  },

  // Inventory
  getInventory: async (token: string) => {
    const response = await fetch(`${API_BASE}/inventory`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  addInventoryItem: async (token: string, item: any) => {
    const response = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(item)
    });
    return response.json();
  },

  useInventoryItem: async (token: string, itemId: string, quantity: number) => {
    const response = await fetch(`${API_BASE}/inventory/${itemId}/use`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ quantity })
    });
    return response.json();
  },

  getLowStockItems: async (token: string) => {
    const response = await fetch(`${API_BASE}/inventory/low-stock`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Add part to job card (auto-decrements inventory)
  addPartToJobCard: async (token: string, jobCardId: string, inventoryItemId: string, quantity: number) => {
    const response = await fetch(`${API_BASE}/jobcards/${jobCardId}/add-part`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ inventoryItemId, quantity })
    });
    return response.json();
  },

  // Stock Requests
  createStockRequest: async (token: string, requestData: any) => {
    const response = await fetch(`${API_BASE}/stock-requests`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(requestData)
    });
    return response.json();
  },

  getMyStockRequests: async (token: string) => {
    const response = await fetch(`${API_BASE}/stock-requests/my-requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getAllStockRequests: async (token: string) => {
    const response = await fetch(`${API_BASE}/stock-requests/admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateStockRequestStatus: async (token: string, requestId: string, status: string, adminNotes?: string) => {
    const response = await fetch(`${API_BASE}/stock-requests/${requestId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status, adminNotes })
    });
    return response.json();
  },

  // Invoices
  createInvoice: async (token: string, jobCardId: string) => {
    const response = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ jobCardId })
    });
    return response.json();
  },

  getInvoices: async (token: string) => {
    const response = await fetch(`${API_BASE}/invoices`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  processPayment: async (token: string, invoiceId: string, paymentData: any) => {
    const response = await fetch(`${API_BASE}/invoices/${invoiceId}/process-payment`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  // Admin
  getAdminStats: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getAllUsers: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getAllBookings: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getAnalytics: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Digital Vehicle Inspection
  addInspectionNote: async (token: string, jobCardId: string, data: any) => {
    const response = await fetch(`${API_BASE}/inspection/${jobCardId}/inspection-note`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getInspectionNotes: async (token: string, jobCardId: string) => {
    const response = await fetch(`${API_BASE}/inspection/${jobCardId}/inspection-notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  sendInspectionToCustomer: async (token: string, jobCardId: string, inspectionId: string) => {
    const response = await fetch(`${API_BASE}/inspection/${jobCardId}/send-inspection/${inspectionId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.json();
  },

  approveInspection: async (token: string, jobCardId: string, inspectionId: string) => {
    const response = await fetch(`${API_BASE}/inspection/${jobCardId}/approve-inspection/${inspectionId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.json();
  },

  // SMS/WhatsApp Notifications
  sendSMS: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE}/notifications/send-sms`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  sendWhatsApp: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE}/notifications/send-whatsapp`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  sendStatusUpdate: async (token: string, jobCardId: string, data: any) => {
    const response = await fetch(`${API_BASE}/notifications/status-update/${jobCardId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getCommunicationHistory: async (token: string, jobCardId: string) => {
    const response = await fetch(`${API_BASE}/notifications/history/${jobCardId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Labor Tracking
  clockIn: async (token: string, jobCardId: string, taskId: string) => {
    const response = await fetch(`${API_BASE}/labor-tracking/${jobCardId}/task/${taskId}/clock-in`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.json();
  },

  clockOut: async (token: string, jobCardId: string, taskId: string) => {
    const response = await fetch(`${API_BASE}/labor-tracking/${jobCardId}/task/${taskId}/clock-out`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.json();
  },

  getLaborAnalytics: async (token: string, jobCardId: string) => {
    const response = await fetch(`${API_BASE}/labor-tracking/${jobCardId}/labor-analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getTechnicianPerformance: async (token: string, technicianId: string, startDate?: string, endDate?: string) => {
    let url = `${API_BASE}/labor-tracking/technician-performance/${technicianId}`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  addLaborTask: async (token: string, jobCardId: string, data: any) => {
    const response = await fetch(`${API_BASE}/labor-tracking/${jobCardId}/add-task`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Team Management
  getTeamMembers: async (token: string) => {
    const response = await fetch(`${API_BASE}/team`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch team members');
    return data;
  },

  addTeamMember: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE}/team`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to add team member');
    return result;
  },

  updateTeamMember: async (token: string, memberId: string, data: any) => {
    const response = await fetch(`${API_BASE}/team/${memberId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update team member');
    return result;
  },

  deleteTeamMember: async (token: string, memberId: string) => {
    const response = await fetch(`${API_BASE}/team/${memberId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete team member');
    return result;
  },

  getTeamMemberPerformance: async (token: string, memberId: string) => {
    const response = await fetch(`${API_BASE}/team/${memberId}/performance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch performance');
    return data;
  },

  getMechanicsPerformance: async (token: string) => {
    const response = await fetch(`${API_BASE}/team/performance/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch mechanics performance');
    return data;
  },

  getAdminMechanics: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/mechanics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch mechanics');
    return data;
  },

  // Inventory Management
  getInventory: async (token: string) => {
    const response = await fetch(`${API_BASE}/inventory`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch inventory');
    return result;
  },

  addInventoryItem: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to add inventory item');
    return result;
  },

  updateInventoryItem: async (token: string, itemId: string, data: any) => {
    const response = await fetch(`${API_BASE}/inventory/${itemId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  useInventoryItem: async (token: string, itemId: string, quantity: number) => {
    const response = await fetch(`${API_BASE}/inventory/${itemId}/use`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ quantity })
    });
    return response.json();
  },

  addStock: async (token: string, itemId: string, quantity: number) => {
    const response = await fetch(`${API_BASE}/inventory/${itemId}/add-stock`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ quantity })
    });
    return response.json();
  },

  getLowStockAlerts: async (token: string) => {
    const response = await fetch(`${API_BASE}/inventory/low-stock`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Stock Requests
  createStockRequest: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE}/stock-requests`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getMyStockRequests: async (token: string) => {
    const response = await fetch(`${API_BASE}/stock-requests/my-requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateStockRequestStatus: async (token: string, requestId: string, status: string, adminNotes?: string) => {
    const response = await fetch(`${API_BASE}/stock-requests/${requestId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status, adminNotes })
    });
    return response.json();
  },

  // Admin Stock Management
  getAllStockRequests: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/stock-requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getAdminInventory: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/admin-inventory`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  addAdminInventoryItem: async (token: string, data: any) => {
    const response = await fetch(`${API_BASE}/admin/admin-inventory`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateAdminInventoryItem: async (token: string, itemId: string, data: any) => {
    const response = await fetch(`${API_BASE}/admin/admin-inventory/${itemId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getAdminLowStockAlerts: async (token: string) => {
    const response = await fetch(`${API_BASE}/admin/low-stock-alerts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

export default api;