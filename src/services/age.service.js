import createApiClient from "./api.service";
class AgeService {
  constructor(baseUrl = "/api/ages") {
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

  async getAllAgeByVaccine(vaccineId) {
    return (await this.api.get(`/by-vaccine/${vaccineId}`)).data;
  }
}

export default new AgeService();
