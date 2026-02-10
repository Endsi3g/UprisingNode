import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    return api.post("/auth/register", { email, password, name });
  },

  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
};

export const leadsService = {
  create: async (url: string) => {
    const response = await api.post("/leads", { url });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/leads/stats");
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/leads");
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/leads/${id}`, data);
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
  getCommissions: async () => {
    const response = await api.get("/dashboard/commissions");
    return response.data;
  },
};

export const transactionsService = {
  createWithdrawal: async (amount: number) => {
    const response = await api.post("/transactions", {
      amount: parseFloat(amount.toString()),
      type: "WITHDRAWAL",
      description: "Virement vers compte",
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/transactions");
    return response.data;
  },
};

export const resourcesService = {
  getAll: async () => {
    const response = await api.get("/resources");
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },
};

export const usersService = {
  getPartners: async () => {
    const response = await api.get("/users/partners");
    return response.data;
  },
  getPartnerDetails: async (id: string) => {
    // We'll reuse the normal user profile or create a specific endpoint
    // For now, assuming we might need a specific public profile endpoint,
    // but let's try to filter from the partners list or fetch basic user info.
    // Actually, let's implement a getById in backend or just use find from list for now.
    // Waiting for backend endpoint implementation for specific partner details if needed.
    // For MVP, we likely just need the list.
    // PROPOSAL: Add getById to UsersService public/partner scope.
    // reusing getProfile is for "me".
    // Let's rely on list for now or add getPublicProfile to backend.
    // Let's add getPublicProfile(id) to backend controller.
    const response = await api.get(`/users/${id}/details`);
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },
  changePassword: async (data: any) => {
    const response = await api.put("/users/password", data);
    return response.data;
  },
  updatePreferences: async (data: any) => {
    const response = await api.patch("/users/preferences", data);
    return response.data;
  },
};
