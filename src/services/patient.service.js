import createApiClient from "./api.service";
class CustomerService {
  constructor(baseUrl = "/api/patients") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(params) {
    return await this.api.get("", { params });
  }

  async getAllByCustomerId(customerId) {
    const tAPI = createApiClient("/api");
    return (await tAPI.get(`/customers/${customerId}/patients`)).data;
  }
  async create(data) {
    return (await this.api.post("", data)).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async getForSelect() {
    return (await this.api.get(`/select`)).data;
  }

  async count() {
    return (await this.api.get("/count")).data;
  }
}

export default new CustomerService();
