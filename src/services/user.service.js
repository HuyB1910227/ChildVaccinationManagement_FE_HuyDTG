import createApiClient from "./api.service";
class UserService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
    this.api2 = createApiClient("/api/users");
  }

  async create(data) {
    return (await this.api2.post("", data)).data;
  }

  async get(id) {
    return (await this.api2.get(`/${id}`)).data;
  }

  async getByToken() {
    return (await this.api2.get(`/token`)).data;
  }

  async update(id, data) {
    return (await this.api2.put(`/${id}`, data)).data;
  }

  async patch(id, data) {
    return (await this.api2.patch(`/${id}`, data)).data;
  }

  async changePassword(data) {
    return (await this.api2.post(`/change-password/token`, data)).data;
  }

  async getAll(params) {
    return await this.api2.get("", { params });
  }

  async login(data) {
    return (await this.api.post("/organization/login", data)).data;
  }

  async logout() {
    return (await this.api.post("/signout")).data;
  }

  async isInvalidUniqueValue(data) {
    const apiHelper = createApiClient("/api/users");
    return (await apiHelper.post("/is-invalid-unique-value", data)).data;
  }
}

export default new UserService();
