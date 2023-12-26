import { defineStore } from "pinia";
import ProviderService from "../services/provider.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useProviderStore = defineStore("ProviderStore", {
  state: () => ({
    providers: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await ProviderService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await ProviderService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await ProviderService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await ProviderService.getAll(params);
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

    async getFSelect() {
      try {
        const data = await ProviderService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
