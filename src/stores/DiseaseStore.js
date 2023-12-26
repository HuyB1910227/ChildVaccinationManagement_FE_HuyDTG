import { defineStore } from "pinia";
import DiseaseService from "../services/disease.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useDiseaseStore = defineStore("DiseaseStore", {
  state: () => ({
    diseases: [],
  }),
  actions: {
    async create(data) {
      try {
        const disease = await DiseaseService.create(data);
        return disease;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async getDisease(id) {
      try {
        const disease = await DiseaseService.get(id);
        return disease;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const disease = await DiseaseService.update(id, data);
        return disease;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await DiseaseService.getAll(params);
        return response;
      } catch (error) {
        console.log("lỗi nè");
        console.log(error.response.data);
        console.log(error);
        handleErrorResponseData(error.response.data);
        console.log("lỗi nè 2");
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

      if (searchOb.description) {
        params["description.contains"] = searchOb.description;
      }

      return params;
    },

    async delete(id) {
      try {
        await DiseaseService.delete(id);
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getDiseaseFSelect() {
      try {
        const data = await DiseaseService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
