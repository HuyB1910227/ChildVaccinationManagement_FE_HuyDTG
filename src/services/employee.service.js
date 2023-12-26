import createApiClient from "./api.service";
class EmployeeService {
  constructor(baseUrl = "/api/employees") {
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

  async getAccount(id) {
    return (await this.api.get(`/${id}/account`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return await this.api.delete(`/${id}`);
  }

  async getForSelect() {
    return (await this.api.get(`/select`)).data;
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

  async getPhysicianInImmunizationUnit() {
    return (await this.api.get("/find-physician/by-token")).data;
  }
}

export default new EmployeeService();
