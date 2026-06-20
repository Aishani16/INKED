import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");

      toast.error(
  "Session expired. Please login again."
);

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;