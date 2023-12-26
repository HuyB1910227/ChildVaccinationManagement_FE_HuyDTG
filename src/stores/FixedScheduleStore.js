import { defineStore } from "pinia";
import FixedScheduleService from "../services/fixedSchedule.service";
import { useHandleErrorFromResponseData } from "../reuse/useHandleErrorFromResponseData";

const { handleErrorResponseData } = useHandleErrorFromResponseData();
export const useFixedScheduleStore = defineStore("FixedScheduleStore", {
  state: () => ({
    fixedSchedules: [],
  }),
  actions: {
    async create(data) {
      try {
        const result = await FixedScheduleService.create(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async checkValidSchedule(data) {
      try {
        console.log(data);
        const result = await FixedScheduleService.checkValidSchedule(data);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async get(id) {
      try {
        const result = await FixedScheduleService.get(id);
        return result;
      } catch (e) {
        console.log(e);
        handleErrorResponseData(e.response.data);
      }
    },

    async update(id, data) {
      try {
        const result = await FixedScheduleService.update(id, data);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAll(params) {
      try {
        const response = await FixedScheduleService.getAll(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getAllV2(params) {
      try {
        const response = await FixedScheduleService.getAllV2(params);
        return response;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async patch(id, data) {
      try {
        const result = await FixedScheduleService.patch(id, data);
        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async getWorkingSchedule(vaccinationType, immunizationUnitId, month, year) {
      const request = {
        vaccinationType: vaccinationType,
        immunizationUnitId: immunizationUnitId,
        month: month,
        year: year,
      };
      try {
        const result = await FixedScheduleService.getWorkingSchedule(request);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    async findWorkingScheduleByRange(
      vaccinationType,
      immunizationUnitId,
      isEnable,
      fromDate,
      toDate
    ) {
      const request = {
        immunizationUnitId: immunizationUnitId,
        isEnable: isEnable,
        fromDate: fromDate,
        toDate: toDate,
      };
      console.log(request);
      try {
        const result = await FixedScheduleService.findWorkingScheduleByRange(
          vaccinationType,
          request
        );
        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
        handleErrorResponseData(error.response.data);
      }
    },

    generateInstanceFromTime(timeString) {
      let defaultDate = new Date("2000-01-01");
      let combinedDateTimeString = `${defaultDate
        .toISOString()
        .slice(0, 10)} ${timeString}`;
      let dateTimeObject = new Date(combinedDateTimeString);
      return dateTimeObject.toISOString();
    },

    getRequestParams(page, pageSize, searchOb) {
      let params = {};

      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      if (searchOb.workingDay && searchOb.workingDay != "null") {
        params["workingDay.contains"] = searchOb.workingDay;
      }

      if (searchOb.workingWeek && searchOb.workingWeek != "null") {
        params["workingWeek.contains"] = searchOb.workingWeek;
      }

      if (searchOb.scheduleType) {
        params["scheduleType.equals"] = searchOb.scheduleType;
      }

      if (searchOb.vaccinationType && searchOb.vaccinationType != "null") {
        params["vaccinationType.equals"] = searchOb.vaccinationType;
      }

      if (searchOb.isEnable && searchOb.isEnable != "null") {
        params["isEnable.equals"] = searchOb.isEnable;
      }

      if (searchOb.note) {
        params["note.contains"] = searchOb.note;
      }

      if (searchOb.startTime) {
        params["startTime.greaterThanOrEqual"] = this.generateInstanceFromTime(
          searchOb.startTime
        );
      }

      if (searchOb.endTime) {
        params["endTime.lessThanOrEqual"] = this.generateInstanceFromTime(
          searchOb.endTime
        );
      }

      if (searchOb.immunizationUnit) {
        params["immunizationUnitId.equals"] = searchOb.immunizationUnit.id;
      }

      return params;
    },
  },
});
