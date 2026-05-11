 
const BASE_URL = "http://localhost:5000/api";

 
const getToken = () => localStorage.getItem("crowdlift_token") || localStorage.getItem("token");

 
const getHeaders = (isFormData = false) => {
  const headers = {};

  // FormData ke liye Content-Type set mat karo (browser khud set karda)
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Agar token hai ta Authorization header add karo
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

 
export const authAPI = {

 
  register: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  
  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateProfile: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/update`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),  
    });
    return res.json();
  },

  updatePassword: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/update-password`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
};

 
export const campaignAPI = {

  // Saari campaigns lao (filters + search + pagination)
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/campaigns?${query}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

 
  getFeatured: async () => {
    const res = await fetch(`${BASE_URL}/campaigns/featured`, {
      headers: getHeaders(),
    });
    return res.json();
  },

 
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/campaigns/${id}?t=${Date.now()}`, { 
      headers: getHeaders(),
    });
    return res.json();
  },

 
  create: async (formData) => {
    const res = await fetch(`${BASE_URL}/campaigns`, {
      method: "POST",
      headers: getHeaders(true), 
      body: formData, 
    });
    return res.json();
  },

 
  update: async (id, formData) => {
    const res = await fetch(`${BASE_URL}/campaigns/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: formData,
    });
    return res.json();
  },

 
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/campaigns/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  
  back: async (id, paymentData) => {
    const res = await fetch(`${BASE_URL}/campaigns/${id}/back`, {
      method: "POST",
      headers: getHeaders(),
    
      body: JSON.stringify(paymentData), 
    });
    return res.json();
  },

  // Apni campaigns lao
  getMy: async () => {
    const res = await fetch(`${BASE_URL}/campaigns/my`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  
};

 

export const saveToken = (token) => {
  localStorage.setItem("crowdlift_token", token);
  localStorage.setItem("token", token);  
};

export const removeToken = () => {
  localStorage.removeItem("crowdlift_token");
  localStorage.removeItem("token");
};

export const isLoggedIn = () => !!getToken();