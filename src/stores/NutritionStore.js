import { defineStore } from "pinia";
import NutritionService from "@/services/nutrition.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useNutritionStore = defineStore("NutritionStore", {
  state: () => ({
    nutritions: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await NutritionService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await NutritionService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await NutritionService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await NutritionService.getAll(params);
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

      if (searchOb.id) {
        params["id.equals"] = searchOb.id;
      }

      if (searchOb.weight) {
        params["weight.greaterThan"] = searchOb.weight;
      }

      if (searchOb.height) {
        params["height.greaterThan"] = searchOb.height;
      }

      if (searchOb.measurementDate) {
        params["measurementDate.equals"] = searchOb.measurementDate;
      }

      if (searchOb.status) {
        params["status.contains"] = searchOb.status;
      }

      if (searchOb.patientId) {
        params["patientId.equals"] = searchOb.patientId;
      }

      return params;
    },
  },
});
