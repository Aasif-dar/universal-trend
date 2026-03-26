import axios from "axios";

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

customFetch.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default customFetch;