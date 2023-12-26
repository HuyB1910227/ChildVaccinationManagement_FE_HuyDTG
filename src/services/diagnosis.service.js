import createApiClient from "./api.service";
class DiagnosisService {
  constructor(baseUrl = "/api/diagnosis") {
    this.api = createApiClient(baseUrl);
  }
  async getSuggestionForSelect(appointmentCardId) {
    return (
      await this.api.get(
        `/suggestion-select/by-appointment-card/${appointmentCardId}`
      )
    ).data;
  }

  async getSuggestionDetailByDisease(appointmentCardId, diseaseId) {
    return (
      await this.api.get(
        `/suggestion-details/by-appointment-card/${appointmentCardId}/require-disease/${diseaseId}`
      )
    ).data;
  }

  async checkVaccineLot(vaccineLotId, appointmentCardId) {
    return (
      await this.api.get(
        `/check-selected-vaccine-lot/${vaccineLotId}/in-appointment-card/${appointmentCardId}`
      )
    ).data;
  }

  async findEligibleInjection(vaccineId, appointmentCardId) {
    return (
      await this.api.get(
        `/finding-injection/${vaccineId}/in-appointment-card/${appointmentCardId}`
      )
    ).data;
  }
}

export default new DiagnosisService();
