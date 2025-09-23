import axiox from "axios";

const axiosInstance = axiox.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api/v1" : "/api/v1",
  withCredentials: true,
});

export default axiosInstance;