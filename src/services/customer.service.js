import createApiClient from "./api.service";
class CustomerService {
  constructor(baseUrl = "/api/customers") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(params) {
    return await this.api.get("", { params });
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

  async getAccount(id) {
    return (await this.api.get(`/${id}/account`)).data;
  }

  async getForSelect() {
    return (await this.api.get(`/select`)).data;
  }

  async isInvalidUniqueValue(data) {
    return (await this.api.post("/is-invalid-unique-value", data)).data;
  }

  async patch(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }

  async count() {
    return (await this.api.get("/count")).data;
  }
}

export default new CustomerService();
