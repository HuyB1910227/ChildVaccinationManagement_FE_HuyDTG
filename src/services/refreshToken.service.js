import createApiClient from "./api.noAuth.service";
class RefreshTokenService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async refreshRequest(data) {
    return (await this.api.post("/user/refresh-token", data)).data;
  }
}

export default new RefreshTokenService();
