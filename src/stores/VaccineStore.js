import { defineStore } from "pinia";
import VaccineService from "../services/vaccine.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useVaccineStore = defineStore("VaccineStore", {
  state: () => ({
    vaccines: [],
    total: 0,
  }),
  actions: {
    async create(data) {
      try {
        const vaccineType = await VaccineService.create(data);
        return vaccineType;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const vaccineType = await VaccineService.get(id);
        return vaccineType;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const vaccineType = await VaccineService.update(id, data);
        return vaccineType;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await VaccineService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async count() {
      try {
        this.total = await VaccineService.count();
        console.log(this.total);
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

      if (searchOb.name) {
        params["name.contains"] = searchOb.name;
      }

      if (searchOb.commonReaction) {
        params["commonReaction.contains"] = searchOb.commonReaction;
      }

      if (searchOb.dosage > 0.0 && searchOb.dosage) {
        params["dosage.equals"] = searchOb.dosage;
      }

      if (searchOb.diseases && searchOb.diseases.length > 0) {
        const diseaseIds = searchOb.diseases
          .map((disease) => disease.id)
          .join(",");
        params["diseaseId.in"] = diseaseIds;
      }

      if (searchOb.vaccineType) {
        params["vaccineTypeId.equals"] = searchOb.vaccineType.id;
      }

      return params;
    },

    async getFSelect() {
      try {
        const data = await VaccineService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
