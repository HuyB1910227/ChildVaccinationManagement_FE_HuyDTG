import createApiClient from "./api.service";
class RoleService {
  constructor(baseUrl = "/api/roles") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("")).data;
  }

}

export default new RoleService();