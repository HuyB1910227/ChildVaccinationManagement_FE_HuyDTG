import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const createApiClient = (baseURL) => {
  const axiosInstance = axios.create({
    baseURL,
    ...commonConfig,
  });

  return axiosInstance;
};

class ProvinceService {
  constructor(baseUrl = "https://provinces.open-api.vn/api/") {
    this.api = createApiClient(baseUrl);
  }

  async getAllProvinces(params) {
    return (await this.api.get("p/", { params })).data;
  }

  async getProvince(code, params) {
    return (await this.api.get(`p/${code}`, { params })).data;
  }

  async getDistrict(code, params) {
    return (await this.api.get(`d/${code}`, { params })).data;
  }
}

export default new ProvinceService();
