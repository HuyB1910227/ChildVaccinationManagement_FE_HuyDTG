import { defineStore } from "pinia";
import InjectionService from "../services/injection.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useInjectionStore = defineStore("InjectionStore", {
  state: () => ({
    injections: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await InjectionService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await InjectionService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await InjectionService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await InjectionService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
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

      if (searchOb.injectionTime) {
        params["injectionTime.equals"] = searchOb.injectionTime;
      }

      if (searchOb.distanceFromPrevious) {
        params["distanceFromPrevious.equals"] = searchOb.distanceFromPrevious;
      }

      if (searchOb.distanceFromPreviousType) {
        params["distanceFromPreviousType.equals"] =
          searchOb.distanceFromPreviousType;
      }

      if (searchOb.age) {
        params["ageId.equals"] = searchOb.age.id;
      }

      if (searchOb.ages && searchOb.ages.length > 0) {
        const ageIds = searchOb.ages.map((age) => age.id).join(",");
        params["ageId.in"] = ageIds;
      }

      if (searchOb.ageIds && searchOb.ageIds.length > 0) {
        const arr = searchOb.ageIds.join(",");
        params["ageId.in"] = arr;
      }

      console.log(params);

      return params;
    },
  },
});
