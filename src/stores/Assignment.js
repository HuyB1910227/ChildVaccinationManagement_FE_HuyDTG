import { defineStore } from "pinia";
import AssignmentService from "../services/assignment.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useAssignmentStore = defineStore("AssignmentStore", {
  state: () => ({
    assignments: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await AssignmentService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await AssignmentService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await AssignmentService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await AssignmentService.getAll(params);
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

      if (searchOb.route) {
        params["route.contains"] = searchOb.route;
      }

      if (searchOb.injectionTime) {
        params["injectionTime.equals"] = searchOb.injectionTime;
      }

      if (searchOb.appointmentCard) {
        params["appointmentCardId.equals"] = searchOb.appointmentCard.id;
      }

      if (searchOb.vaccineLot) {
        params["vaccineLotId.in"] = searchOb.vaccineLot.id;
      }

      // console.log(params);
      return params;
    },

    // async getFSelect() {
    //   try {
    //     const data = await AssignmentService.getForSelect();
    //     return data;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
});
