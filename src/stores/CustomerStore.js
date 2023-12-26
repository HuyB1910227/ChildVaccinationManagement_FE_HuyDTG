import { defineStore } from "pinia";
import CustomerService from "../services/customer.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";
import SMSService from "../services/sms.service";
const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useCustomerStore = defineStore("CustomerStore", {
  state: () => ({
    customers: [],
    total: 0,
  }),
  actions: {
    async create(data) {
      try {
        const result = await CustomerService.create(data);
        if (result && result.user) {
          let smsData = {
            destinationPhoneNumber: result.phone,
            message: `HE THONG TIEM CHUNG ANGELO!Tai khoan cua quy khach da duoc tao. Ten dang nhap: ${result.user.username} va Mat khau: MÃ SỐ CMND/CCCD. Quy khach vui long cai dat ung dung Angelo-TCTEVN va dang nhap vao tai khoan da duoc cung cap de su dung dich vu cua chung toi! De bao mat tai khoan, vui long thay doi mat khau sau khi dang nhap thanh cong. Xin chan thanh cam on`,
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
        const result = await CustomerService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async getAccount(id) {
      try {
        const result = await CustomerService.getAccount(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await CustomerService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async partialUpdate(id, data) {
      try {
        const result = await CustomerService.patch(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await CustomerService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async isInvalidUniqueValue(data) {
      try {
        const result = await CustomerService.isInvalidUniqueValue(data);
        return result;
      } catch (e) {
        console.log(e);
        return false;
      }
    },

    async count() {
      try {
        this.total = await CustomerService.count();
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

      if (searchOb.identityCard) {
        params["identityCard.equals"] = searchOb.identityCard.trim();
      }

      if (searchOb.phone) {
        params["phone.contains"] = searchOb.phone.trim();
      }

      if (searchOb.email) {
        params["email.contains"] = searchOb.email.trim();
      }

      if (searchOb.fullName) {
        params["fullName.contains"] = searchOb.fullName.trim();
      }

      if (searchOb.address) {
        params["address.contains"] = searchOb.address.trim();
      }

      if (searchOb.gender && searchOb.gender != "null") {
        params["gender.equals"] = searchOb.gender;
      }

      if (searchOb.dateOfBirth) {
        params["dateOfBirth.equals"] = searchOb.dateOfBirth;
      }

      if (searchOb.career) {
        params["career.contains"] = searchOb.career.trim();
      }

      return params;
    },

    async getFSelect() {
      try {
        const data = await CustomerService.getForSelect();
        return data;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },
  },
});
