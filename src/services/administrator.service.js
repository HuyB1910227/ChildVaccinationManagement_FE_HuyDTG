import createApiClient from "./api.service";
class AdministratorService {
  constructor(baseUrl = "/api/administrators") {
    this.api = createApiClient(baseUrl);
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

  async getByToken() {
    return (await this.api.get("/token")).data;
  }

  async patch(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }

  async isInvalidUniqueValue(data) {
    return (await this.api.post("/is-invalid-unique-value", data)).data;
  }
}

export default new AdministratorService();
