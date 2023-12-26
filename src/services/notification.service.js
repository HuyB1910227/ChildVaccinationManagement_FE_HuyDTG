import createApiClient from "./api.service";
class NotificationService {
  constructor(baseUrl = "/api/notifications") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/for-customer", data)).data;
  }
}

export default new NotificationService();
