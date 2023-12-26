import { defineStore } from "pinia";
import AgeService from "../services/age.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useAgeStore = defineStore("AgeStore", {
  state: () => ({
    ages: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await AgeService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await AgeService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await AgeService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await AgeService.getAll(params);
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

      if (searchOb.minAge) {
        params["minAge.equals"] = searchOb.minAge;
      }

      if (searchOb.minAgeType) {
        params["minAgeType.equals"] = searchOb.minAgeType;
      }

      if (searchOb.maxAge) {
        params["maxAge.equals"] = searchOb.maxAge;
      }

      if (searchOb.maxAgeType) {
        params["maxAgeType.equals"] = searchOb.maxAgeType;
      }

      if (searchOb.vaccine) {
        params["vaccineId.equals"] = searchOb.vaccine.id;
      }

      return params;
    },

    async getAllAgeByVaccine(vaccineId) {
      try {
        const response = await AgeService.getAllAgeByVaccine(vaccineId);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
