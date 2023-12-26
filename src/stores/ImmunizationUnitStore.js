import { defineStore } from "pinia";
import ImmunizationUnitService from "@/services/immunizationUnit.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useImmunizationUnitStore = defineStore("ImmunizationUnitStore", {
  state: () => ({
    immunizationUits: [],
    total: 0,
  }),
  actions: {
    async create(data) {
      try {
        const result = await ImmunizationUnitService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await ImmunizationUnitService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await ImmunizationUnitService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await ImmunizationUnitService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async isInvalidUniqueValue(data) {
      try {
        const result = await ImmunizationUnitService.isInvalidUniqueValue(data);
        return result;
      } catch (e) {
        console.log(e);
      }
    },

    getRequestParams(page, pageSize, searchOb) {
      let params = {};
      console.log(searchOb);
      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      if (searchOb.name) {
        params["name.contains"] = searchOb.name;
      }

      if (searchOb.address) {
        params["address.contains"] = searchOb.address;
      }

      if (searchOb.hotline) {
        params["hotline.equals"] = searchOb.hotline;
      }

      if (searchOb.isActive && searchOb.isActive != "null") {
        params["isActive.equals"] = searchOb.isActive;
      }

      if (searchOb.operatingLicence) {
        params["operatingLicence.contains"] = searchOb.operatingLicence;
      }

      if (searchOb.employee) {
        params["employeeId.equals"] = searchOb.employee.id;
      }

      if (searchOb.vaccineLot) {
        params["vaccineLotId.equals"] = searchOb.vaccineLot.id;
      }

      if (searchOb.fixedSchedule) {
        params["fixedScheduleId.equals"] = searchOb.fixedSchedule.id;
      }

      if (searchOb.appointmentCard) {
        params["appointmentCardId.equals"] = searchOb.appointmentCard.id;
      }

      return params;
    },

    async count() {
      try {
        this.total = await ImmunizationUnitService.count();
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getFSelect() {
      try {
        const data = await ImmunizationUnitService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
