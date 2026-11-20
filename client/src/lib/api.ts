import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(undefined, (error) => {
  if (isAxiosError(error) && error.response?.data?.message) {
    error.message = error.response.data.message;
  }
  return Promise.reject(error);
});

export default api;
