import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ================== REQUEST INTERCEPTOR ==================
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================== RESPONSE INTERCEPTOR (AUTO REFRESH) ==================
let isRefreshing = false;
let failedQueue = [];

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token")
    ) {
      if (error.response?.status === 401 && !originalRequest._retry) {
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
          const res = await api.post("/refresh-token");

          // ✅ FIX: Token is inside res.data.data.access_token
          const newToken = res.data?.data?.access_token;

          if (!newToken) {
            throw new Error(
              "No new access token returned from refresh endpoint"
            );
          }

          // Store new token
          if (localStorage.getItem("access_token")) {
            localStorage.setItem("access_token", newToken);
          } else {
            sessionStorage.setItem("access_token", newToken);
          }
          // Update Axios default
          api.defaults.headers.Authorization = `Bearer ${newToken}`;

          processQueue(null, newToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Clear and redirect to login
          localStorage.removeItem("access_token");
          sessionStorage.removeItem("access_token");
          window.location.href = "/auth/login";

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
