import { defineStore } from "pinia";
import EmployeeService from "../services/employee.service";
import SMSService from "../services/sms.service";

import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useEmployeeStore = defineStore("EmployeeStore", {
  state: () => ({
    employees: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await EmployeeService.create(data);
        if (result && result.user) {
          let smsData = {
            destinationPhoneNumber: result.phone,
            message: `HE THONG TIEM CHUNG ANGELO!Tai khoan cua nhan vien da duoc tao. Ten dang nhap: ${result.user.username} va Mat khau: MÃ SỐ CMND/CCCD. Thanh vien vui long thay doi mat khau sau khi dang nhap lan dau tien!`,
          };
          console.log(smsData);
          await SMSService.sendMessageCreatedAccount(smsData);
        }
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await EmployeeService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async getAccount(id) {
      try {
        const result = await EmployeeService.getAccount(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async getPhysicianInImmunizationUnit() {
      try {
        const result = await EmployeeService.getPhysicianInImmunizationUnit();
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await EmployeeService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async partialUpdate(id, data) {
      try {
        const result = await EmployeeService.patch(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await EmployeeService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async isInvalidUniqueValue(data) {
      try {
        const result = await EmployeeService.isInvalidUniqueValue(data);
        return result;
      } catch (e) {
        console.log(e);
        return false;
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

      if (searchOb.employeeId) {
        params["employeeId.equals"] = searchOb.employeeId;
      }

      if (searchOb.identityCard) {
        params["identityCard.equals"] = searchOb.identityCard;
      }

      if (searchOb.phone) {
        params["phone.contains"] = searchOb.phone;
      }

      if (searchOb.email) {
        params["email.contains"] = searchOb.email;
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

      if (searchOb.immunizationUnit) {
        params["immunizationUnitId.equals"] = searchOb.immunizationUnit.id;
      }

      if (searchOb.user) {
        params["userId.equals"] = searchOb.user.id;
      }

      return params;
    },

    async getFSelect() {
      try {
        const data = await EmployeeService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
