import createApiClient from "./api.service";
import { VaccinationType } from "../data/vaccinationType";
class FixedScheduleService {
  constructor(baseUrl = "/api/fixed-schedules") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(params) {
    return await this.api.get("", { params });
  }

  async getAllV2(params) {
    return await this.api.get("/all", { params });
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

  async checkValidSchedule(data) {
    return (await this.api.post("/duplicate-fixed-schedule", data)).data;
  }

  async getWorkingSchedule(request) {
    let vaccinationTypeUrl = "";
    if (request.vaccinationType == VaccinationType.DICH_VU) {
      vaccinationTypeUrl = "TCDV";
    } else if (request.vaccinationType == VaccinationType.MO_RONG) {
      vaccinationTypeUrl = "TCMR";
    } else {
      vaccinationTypeUrl = "all";
    }
    return (
      await this.api.get(
        `/work-schedule/${vaccinationTypeUrl}/${request.immunizationUnitId}/${request.month}/${request.year}`
      )
    ).data;
  }

  async findWorkingScheduleByRange(vaccinationType, request) {
    let vaccinationTypeUrl = "";
    if (vaccinationType == VaccinationType.DICH_VU) {
      vaccinationTypeUrl = "TCDV";
    } else if (vaccinationType == VaccinationType.MO_RONG) {
      vaccinationTypeUrl = "TCMR";
    } else {
      vaccinationTypeUrl = "all";
    }
    return (
      await this.api.post(`/work-schedule/${vaccinationTypeUrl}`, request)
    ).data;
  }
}

export default new FixedScheduleService();
