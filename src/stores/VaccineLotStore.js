import { defineStore } from "pinia";
import VaccineLotService from "@/services/vaccineLot.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useVaccineLotStore = defineStore("VaccineLotStore", {
  state: () => ({
    providers: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await VaccineLotService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await VaccineLotService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await VaccineLotService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async partialUpdate(id, data) {
      try {
        const result = await VaccineLotService.partialUpdate(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await VaccineLotService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    getRequestParams(page, pageSize, searchOb) {
      let params = {};
      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      if (searchOb.lotCode) {
        params["lotCode.equals"] = searchOb.lotCode.trim();
      }

      if (searchOb.quantity) {
        params["quantity.greaterThan"] = searchOb.quantity;
      }

      if (searchOb.expiredDate) {
        params["expiredDate.greaterThanOrEqual"] = new Date(
          searchOb.expiredDate
        ).toISOString();
      }

      if (searchOb.transactionDate) {
        params["transactionDate.greaterThanOrEqual"] = new Date(
          searchOb.transactionDate
        ).toISOString();
      }

      if (searchOb.manufacturingDate) {
        params["manufacturingDate.greaterThanOrEqual"] = new Date(
          searchOb.manufacturingDate
        ).toISOString();
      }

      if (searchOb.status && searchOb.status != "null") {
        params["status.equals"] = searchOb.status;
      }

      if (searchOb.salePrice) {
        params["salePrice.greaterThanOrEqual"] = searchOb.salePrice;
      }

      if (searchOb.assignment) {
        params["assignmentId.in"] = searchOb.assignment.id;
      }

      if (searchOb.vaccine) {
        params["vaccineId.equals"] = searchOb.vaccine.id;
      }

      if (searchOb.provider) {
        params["providerId.equals"] = searchOb.provider.id;
      }

      if (searchOb.immunizationUnit) {
        params["immunizationUnitId.equals"] = searchOb.immunizationUnit.id;
      }

      if (searchOb.vaccinationType && searchOb.vaccinationType != "null") {
        params["vaccinationType.equals"] = searchOb.vaccinationType;
      }

      return params;
    },
  },
});
