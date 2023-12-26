import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "/api/avatar",
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
const baseURL = "/api/avatar";
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

class AvatarService {
  async getImageUrl(fileName) {
    try {
      const response = await instance.get(`/${fileName}`);
      if (response.status === 200) {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        return url;
      } else {
        throw new Error("Failed to fetch image");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getImageUrlByToken() {
    try {
      const response = await instance.get(`/by-token`);
      if (response.status === 200) {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        return url;
      } else {
        throw new Error("Failed to fetch image");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateAvatar(data) {
    console.log(data);
    return (await axiosInstance.post(`/user`, data)).data;
  }
}

export default new AvatarService();
