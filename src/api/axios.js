import axios from "axios";

// ================== CREATE INSTANCE ==================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // required for cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ================== TOKEN HELPER ==================
const getAccessToken = () =>
  localStorage.getItem("access_token") ||
  sessionStorage.getItem("access_token");

const setAccessToken = (token) => {
  if (localStorage.getItem("access_token")) {
    localStorage.setItem("access_token", token);
  } else {
    sessionStorage.setItem("access_token", token);
  }
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
};

// ================== REQUEST INTERCEPTOR ==================
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ================== REFRESH CONTROL ==================
let isRefreshing = false;
let failedQueue = [];

// Process waiting requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ================== RESPONSE INTERCEPTOR ==================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401 → reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Avoid refreshing for login or refresh endpoint
    if (
      originalRequest.url.includes("/login") ||
      originalRequest.url.includes("/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // ================== HANDLE QUEUE ==================
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // FORCE include cookies
      const res = await api.post(
        "/refresh-token",
        {},
        { withCredentials: true },
      );

      const newToken = res.data?.data?.access_token;

      if (!newToken) {
        throw new Error("No access token returned");
      }

      //  Save token
      setAccessToken(newToken);

      //  Update default header
      api.defaults.headers.Authorization = `Bearer ${newToken}`;

      //  Process queued requests
      processQueue(null, newToken);

      //  Retry original request
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      clearTokens();
      window.location.href = "/auth/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
