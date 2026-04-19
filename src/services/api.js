import axios from 'axios';

const TOKEN_KEY = 'riq_token';
const USER_KEY = 'riq_user';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({ baseURL: `${SERVER_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(err);
  }
);

function unwrap(err) {
  const msg = err?.response?.data?.message || err?.response?.data?.error || err.message;
  throw new Error(typeof msg === 'string' ? msg : 'Request failed');
}

export async function analyzeCity({ city, category, menuItems, strategy }) {
  try {
    const { data } = await api.post('/analyze', { city, category, menuItems, strategy });
    return data;
  } catch (err) {
    unwrap(err);
  }
}

export async function getSavedLocations() {
  try {
    const { data } = await api.get('/saved-locations');
    return data;
  } catch (err) {
    unwrap(err);
  }
}

export async function saveLocation(location) {
  try {
    const { data } = await api.post('/saved-locations', location);
    return data;
  } catch (err) {
    unwrap(err);
  }
}

export async function deleteLocation(id) {
  try {
    const { data } = await api.delete(`/saved-locations/${id}`);
    return data;
  } catch (err) {
    unwrap(err);
  }
}

export async function getRentPressure({ lat, lng }) {
  try {
    const { data } = await api.post('/rent-pressure', { lat, lng });
    return data;
  } catch (err) {
    unwrap(err);
  }
}

export async function registerAuth({ name, email, password }) {
  try {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  } catch (err) {
    unwrap(err);
  }
}

export async function loginAuth({ email, password }) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  } catch (err) {
    unwrap(err);
  }
}

export default api;
