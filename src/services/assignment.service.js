import createApiClient from "./api.service";
class AssignmentCard {
  constructor(baseUrl = "/api/assignments") {
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

  async delete(id) {
    return await this.api.delete(`/${id}`);
  }

  async patch(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }
}

export default new AssignmentCard();
