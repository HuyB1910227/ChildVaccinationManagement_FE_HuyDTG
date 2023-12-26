import { defineStore } from "pinia";
import AdministratorService from "../services/administrator.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useAdministratorStore = defineStore("AdministratorStore", {
  state: () => ({
    administrator: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await AdministratorService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await AdministratorService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await AdministratorService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await AdministratorService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async partialUpdate(id, data) {
      try {
        const result = await AdministratorService.patch(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async isInvalidUniqueValue(data) {
      try {
        const result = await AdministratorService.isInvalidUniqueValue(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
        return false;
      }
    },
  },
});
