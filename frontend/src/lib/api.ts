import {
  User,
  Category,
  MenuItem,
  Order,
  Reservation,
  DashboardStats,
  OrderStatus,
  ReservationStatus,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dinedesk_token');
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data: T }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json;
}

// ------------------------------------------
// Auth API
// ------------------------------------------
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    return apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  getMe: async () => {
    return apiRequest<User>('/auth/me');
  },
};

// ------------------------------------------
// Menu & Category API
// ------------------------------------------
export const menuApi = {
  getCategories: async () => {
    return apiRequest<Category[]>('/menu/categories');
  },
  getMenu: async (params?: {
    category?: string;
    search?: string;
    isVeg?: boolean;
    isPopular?: boolean;
    isFeatured?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.isVeg !== undefined) query.append('isVeg', String(params.isVeg));
    if (params?.isPopular !== undefined) query.append('isPopular', String(params.isPopular));
    if (params?.isFeatured !== undefined) query.append('isFeatured', String(params.isFeatured));

    const qs = query.toString();
    return apiRequest<MenuItem[]>(`/menu${qs ? `?${qs}` : ''}`);
  },
  getMenuItemById: async (id: string) => {
    return apiRequest<MenuItem>(`/menu/${id}`);
  },
  createMenuItem: async (itemData: Partial<MenuItem>) => {
    return apiRequest<MenuItem>('/menu', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },
  updateMenuItem: async (id: string, itemData: Partial<MenuItem>) => {
    return apiRequest<MenuItem>(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },
  deleteMenuItem: async (id: string) => {
    return apiRequest<void>(`/menu/${id}`, {
      method: 'DELETE',
    });
  },
  toggleAvailability: async (id: string, isAvailable: boolean) => {
    return apiRequest<MenuItem>(`/menu/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    });
  },
  createCategory: async (categoryData: Partial<Category>) => {
    return apiRequest<Category>('/menu/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
  updateCategory: async (id: string, categoryData: Partial<Category>) => {
    return apiRequest<Category>(`/menu/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },
  deleteCategory: async (id: string) => {
    return apiRequest<void>(`/menu/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// ------------------------------------------
// Orders API
// ------------------------------------------
export const ordersApi = {
  createOrder: async (orderPayload: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    orderType: 'DELIVERY' | 'DINE_IN';
    paymentMethod: 'CARD' | 'UPI' | 'CASH';
    specialInstructions?: string;
    items: { menuItemId: string; quantity: number }[];
  }) => {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  },
  getOrderById: async (idOrNumber: string) => {
    return apiRequest<Order>(`/orders/${idOrNumber}`);
  },
  getMyOrders: async () => {
    return apiRequest<Order[]>('/orders/my-orders');
  },
  getAllOrders: async (status?: OrderStatus) => {
    const qs = status ? `?status=${status}` : '';
    return apiRequest<Order[]>(`/orders${qs}`);
  },
  updateOrderStatus: async (id: string, orderStatus: OrderStatus) => {
    return apiRequest<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus }),
    });
  },
};

// ------------------------------------------
// Reservations API
// ------------------------------------------
export const reservationsApi = {
  createReservation: async (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
  }) => {
    return apiRequest<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getMyReservations: async () => {
    return apiRequest<Reservation[]>('/reservations/my-reservations');
  },
  getAllReservations: async () => {
    return apiRequest<Reservation[]>('/reservations');
  },
  updateReservationStatus: async (id: string, status: ReservationStatus) => {
    return apiRequest<Reservation>(`/reservations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// ------------------------------------------
// Admin API
// ------------------------------------------
export const adminApi = {
  getDashboardStats: async () => {
    return apiRequest<DashboardStats>('/admin/stats');
  },
  getUsers: async () => {
    return apiRequest<User[]>('/admin/users');
  },
  updateUserRole: async (id: string, role: string) => {
    return apiRequest<User>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};
