import axios from "axios";
import Cookies from "js-cookie";
const instance = axios.create({
  baseURL: "/api/",
  responseType: "blob",
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const commonConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
  },
};

const baseURL = "/api/";
const axiosInstance = axios.create({
  baseURL,
  ...commonConfig,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class PDFService {
  async getAppointmentCardPDF(appointmentCardId) {
    try {
      const response = await instance.get(
        `appointment-cards/appointment-card-pdf/${appointmentCardId}`
      );
      if (response.status === 200) {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        return url;
      } else {
        throw new Error("Failed to fetch pdf file");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new PDFService();
