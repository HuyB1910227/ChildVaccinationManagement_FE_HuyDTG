import createApiClient from "./api.service";
class AppointmentCardService {
  constructor(baseUrl = "/api/appointment-cards") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(params) {
    return await this.api.get("", { params });
  }

  async getAllNoValidateRole(params) {
    return await this.api.get("/normal", { params });
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

  async patch(id, data) {
    return (await this.api.patch(`/${id}`, data)).data;
  }

  async updateDiagnosis(id, data) {
    return (await this.api.patch(`/complete-diagnosis/${id}`, data)).data;
  }

  async getAllAssignments(assignmentId) {
    return (await this.api.get(`/${assignmentId}/assignments`)).data;
  }

  async getForSelect() {
    return (await this.api.get(`/select`)).data;
  }
}

export default new AppointmentCardService();
