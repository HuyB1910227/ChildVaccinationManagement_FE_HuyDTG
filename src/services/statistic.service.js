import createApiClient from "./api.service";
class StatisticService {
  constructor(baseUrl = "/api/statistics") {
    this.api = createApiClient(baseUrl);
  }
  async getAppointmentCardStatisticForCompareThisWeekToLastWeek() {
    return (await this.api.get("/appointment-cards/compare-last-two-weeks"))
      .data;
  }

  async getNewCustomerInMonthAgo(theNumberOfLastMonth) {
    return (
      await this.api.get(`/customers/count-last-month/${theNumberOfLastMonth}`)
    ).data;
  }
}

export default new StatisticService();
