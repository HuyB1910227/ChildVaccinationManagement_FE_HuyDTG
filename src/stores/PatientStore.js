import { defineStore } from "pinia";
import PatientService from "../services/patient.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const usePatientStore = defineStore("PatientStore", {
  state: () => ({
    patients: [],
    total: 0,
  }),
  actions: {
    async create(data) {
      try {
        const result = await PatientService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await PatientService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await PatientService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await PatientService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAllByCustomerId(customerId) {
      try {
        const response = await PatientService.getAllByCustomerId(customerId);
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
      if (searchOb.fullName) {
        params["fullName.contains"] = searchOb.fullName;
      }

      if (searchOb.address) {
        params["address.contains"] = searchOb.address;
      }

      if (searchOb.gender && searchOb.gender != "null") {
        params["gender.equals"] = searchOb.gender;
      }

      if (searchOb.dateOfBirth) {
        params["dateOfBirth.equals"] = searchOb.dateOfBirth;
      }

      if (searchOb.appointmentCard) {
        params["appointmentCardId.equals"] = searchOb.appointmentCard.id;
      }

      if (searchOb.customer) {
        params["customerId.equals"] = searchOb.customer.id;
      }

      return params;
    },

    async count() {
      try {
        this.total = await PatientService.count();
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getFSelect() {
      try {
        const data = await PatientService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
