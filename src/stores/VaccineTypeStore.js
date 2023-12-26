import { defineStore } from "pinia";
import VaccineTypeService from "../services/vaccineType.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useVaccineTypeStore = defineStore("VaccineTypeStore", {
  state: () => ({
    vaccineTypes: [],
  }),
  actions: {
    async create(data) {
      try {
        const vaccineType = await VaccineTypeService.create(data);
        return vaccineType;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const vaccineType = await VaccineTypeService.get(id);
        return vaccineType;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const vaccineType = await VaccineTypeService.update(id, data);
        return vaccineType;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await VaccineTypeService.getAll(params);
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

      if (searchOb.name) {
        params["name.contains"] = searchOb.name;
      }

      return params;
    },

    async getVaccineTypeFSelect() {
      try {
        const data = await VaccineTypeService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
