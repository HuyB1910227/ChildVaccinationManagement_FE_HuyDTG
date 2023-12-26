<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted, computed } from "vue";
import { WorkingDayType } from "@/data/workingDayType";
import { WorkingWeekType } from "@/data/workingWeekType";
import { useFixedScheduleStore } from "@/stores/FixedScheduleStore";
import dayjs from "dayjs";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useTranslateWorkingDay } from "../../reuse/useTranslateWorkingDay";
import { useTranslateWorkingWeek } from "../../reuse/useTranslateWorkingWeek";
const { translateToWorkingDayVN } = useTranslateWorkingDay();
const { translateToWorkingWeekVN } = useTranslateWorkingWeek();
import moment from "moment";
const { formatDateFromInstantToTime, formatInstantFromJavascriptTime } =
  useChangeDateFormat();
const fixedScheduleStore = useFixedScheduleStore();
const props = defineProps({
  fixedSchedule: {
    type: Object,
    required: true,
  },
});

watch(
  () => props.fixedSchedule,
  (newVal) => {
    fixedScheduleLocal.value = newVal;
  }
);

const duplicateSchedules = ref([]);

const checkValidSchedule = async (data) => {
  try {
    duplicateSchedules.value = await fixedScheduleStore.checkValidSchedule(
      data
    );
  } catch (error) {
    console.log(error);
    duplicateSchedules.value = [];
  }
};

const selectedWorking = reactive({
  workingDay: null,
  workingWeek: null,
});
const isLoading = ref(false);
const emits = defineEmits([
  "submit:add:fixedSchedule",
  "submit:update:fixedSchedule",
]);

const fixedScheduleLocal = ref(props.fixedSchedule);

const fixedScheduleAttributesToCheck = computed(() => {
  const fixedSchedule = fixedScheduleLocal.value;
  return {
    workingDay: fixedSchedule.workingDay,
    workingWeek: fixedSchedule.workingWeek,
    vaccinationType: fixedSchedule.vaccinationType,
    startTime: fixedSchedule.startTime,
    endTime: fixedSchedule.endTime,
    immunizationUnit: fixedSchedule.immunizationUnit,
  };
});

watch(fixedScheduleAttributesToCheck, (newAttributes) => {
  console.log("Attributes changed:", newAttributes);
  if (
    newAttributes.workingDay &&
    newAttributes.workingWeek &&
    newAttributes.vaccinationType &&
    newAttributes.startTime &&
    newAttributes.endTime &&
    newAttributes.immunizationUnit
  ) {
    let needToCheckData = {
      workingDay: newAttributes.workingDay,
      workingWeek: newAttributes.workingWeek,
      vaccinationType: newAttributes.vaccinationType,
      startTime: generateInstanceFromTime(newAttributes.startTime),
      endTime: generateInstanceFromTime(newAttributes.endTime),
      immunizationUnit: newAttributes.immunizationUnit,
    };
    checkValidSchedule(needToCheckData);
  }
});

const fixedScheduleFormSchema = yup.object().shape({
  workingDay: yup
    .string()
    .required("Chưa chọn ngày làm việc")
    .min(1, "Chưa chọn ngày làm việc"),
  workingWeek: yup
    .string()
    .required("Chưa chọn tuần làm việc")
    .min(1, "Chưa chọn tuần làm việc"),
  note: yup.string(),
  startTime: yup.string().required("Chưa chọn thời gian bắt đầu"),
  endTime: yup
    .string()
    .required("Chưa chọn thời gian kết thúc")
    .test(
      "is-greater",
      "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
      function (value) {
        const { startTime } = this.parent;
        return moment(value, "HH:mm").isSameOrAfter(moment(startTime, "HH:mm"));
      }
    ),
});

const changeFromLocalDatetoDate = () => {
  if (props.fixedSchedule.startTime) {
    fixedScheduleLocal.value.startTime = dayjs(
      props.fixedSchedule.startTime
    ).format("HH:mm");
  }
  if (props.fixedSchedule.endTime) {
    fixedScheduleLocal.value.endTime = dayjs(
      props.fixedSchedule.endTime
    ).format("HH:mm");
  }
};

const generateInstanceFromTime = (timeString) => {
  let defaultDate = new Date("2000-01-01");
  const [hours, minutes] = timeString.split(":");
  defaultDate.setHours(hours);
  defaultDate.setMinutes(minutes);
  return formatInstantFromJavascriptTime(defaultDate);
};

watch(
  () => fixedScheduleLocal.value.workingDay,
  (newVal) => {
    const arrayDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (newVal) {
      if (arrayDays.includes(newVal)) {
        fixedScheduleLocal.value.workingDayType = WorkingDayType.THU_TRONG_TUAN;
      } else {
        fixedScheduleLocal.value.workingDayType =
          WorkingDayType.NGAY_TRONG_THANG;
      }
    } else {
      fixedScheduleLocal.value.workingDayType = null;
    }
  }
);

watch(
  () => fixedScheduleLocal.value.workingWeek,
  (newVal) => {
    if (newVal) {
      if (newVal == "ALL") {
        fixedScheduleLocal.value.workingWeekType = WorkingWeekType.MAC_DINH;
      } else {
        fixedScheduleLocal.value.workingWeekType = WorkingWeekType.TUY_CHON;
      }
    }
  }
);
const submitFixedSchedule = () => {
  const submitData = {};
  if (fixedScheduleLocal.value.id == null || fixedScheduleLocal.value.id < 1) {
    submitData.workingDay = fixedScheduleLocal.value.workingDay;
    submitData.workingWeek = fixedScheduleLocal.value.workingWeek;
    submitData.vaccinationType = fixedScheduleLocal.value.vaccinationType;
    submitData.note = fixedScheduleLocal.value.note;
    submitData.isEnable = fixedScheduleLocal.value.isEnable;
    submitData.startTime = generateInstanceFromTime(
      fixedScheduleLocal.value.startTime
    );
    submitData.endTime = generateInstanceFromTime(
      fixedScheduleLocal.value.endTime
    );
    submitData.immunizationUnit = fixedScheduleLocal.value.immunizationUnit;
    submitData.workingDayType = fixedScheduleLocal.value.workingDayType;
    submitData.workingWeekType = fixedScheduleLocal.value.workingWeekType;
    emits("submit:add:fixedSchedule", submitData);
  } else {
    submitData.id = fixedScheduleLocal.value.id;
    submitData.workingDay =
      fixedScheduleLocal.value.workingDay.length > 0
        ? fixedScheduleLocal.value.workingDay.join(" ; ")
        : null;
    submitData.workingWeek =
      fixedScheduleLocal.value.workingWeek.length > 0
        ? fixedScheduleLocal.value.workingWeek.join(" ; ")
        : null;
    submitData.vaccinationType = fixedScheduleLocal.value.vaccinationType;
    submitData.note = fixedScheduleLocal.value.note;
    submitData.isEnable = fixedScheduleLocal.value.isEnable;
    submitData.startTime = generateInstanceFromTime(
      fixedScheduleLocal.value.startTime
    );
    submitData.endTime = generateInstanceFromTime(
      fixedScheduleLocal.value.endTime
    );
    submitData.immunizationUnit = fixedScheduleLocal.value.immunizationUnit;
    submitData.workingDayType = fixedScheduleLocal.value.workingDayType;
    submitData.workingWeekType = fixedScheduleLocal.value.workingWeekType;
    emits("submit:update:fixedSchedule", submitData);
  }
};

const workingDayOption = reactive([
  {
    name: "Thứ hai",
    value: "Mon",
  },
  {
    name: "Thứ ba",
    value: "Tue",
  },
  {
    name: "Thứ tư",
    value: "Wed",
  },
  {
    name: "Thứ năm",
    value: "Thu",
  },
  {
    name: "Thứ sáu",
    value: "Fri",
  },
  {
    name: "Thứ bảy",
    value: "Sat",
  },
  {
    name: "Chủ nhật",
    value: "Sun",
  },
]);
const workingWeekOption = reactive([
  {
    name: "Tất cả tuần trong tháng",
    value: "ALL",
  },
  {
    name: "Tuần 1",
    value: "W1",
  },
  {
    name: "Tuần 2",
    value: "W2",
  },
  {
    name: "Tuần 3",
    value: "W3",
  },
  {
    name: "Tuần 4",
    value: "W4",
  },
]);

const handleInitWorking = () => {
  if (fixedScheduleLocal.value && !fixedScheduleLocal.value.workingWeekType) {
    fixedScheduleLocal.value.workingWeekType = WorkingWeekType.MAC_DINH;
  }
  if (
    fixedScheduleLocal.value.workingWeek &&
    typeof fixedScheduleLocal.value.workingWeek === "string"
  ) {
    selectedWorking.workingWeek =
      fixedScheduleLocal.value.workingWeek.split(" ; ");
    fixedScheduleLocal.value.workingWeek = selectedWorking.workingWeek;
    console.log(selectedWorking);
  }
  isLoading.value = true;
};

const clearForm = () => {
  fixedScheduleLocal.value.workingDay = null;
  fixedScheduleLocal.value.workingWeek = null;
  fixedScheduleLocal.value.startTime = null;
  fixedScheduleLocal.value.endTime = null;
};

defineExpose({
  clearForm,
});

onMounted(() => {
  handleInitWorking();
  changeFromLocalDatetoDate();
});
</script>

<template>
  <Form
    @submit="submitFixedSchedule"
    :validation-schema="fixedScheduleFormSchema"
    class="space-y-4"
    v-slot="{ values }"
  >
    <div class="row">
      <div class="col-md-6 my-1" v-if="workingDayOption">
        <label for="workingDay"
          >Ngày làm việc<span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="workingDay"
          as="select"
          class="form-select"
          v-model="fixedScheduleLocal.workingDay"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in workingDayOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(workingDayOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="workingDay" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1" v-if="workingWeekOption">
        <label for="workingWeek"
          >Tuần làm việc <span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="workingWeek"
          as="select"
          class="form-select"
          v-model="fixedScheduleLocal.workingWeek"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in workingWeekOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(workingWeekOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="workingWeek" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label class="" for="startTime"
          >Bắt đầu <span class="text-danger">*</span></label
        >

        <Field
          type="time"
          name="startTime"
          class="form-control my-1"
          v-model="fixedScheduleLocal.startTime"
          placeholder="Mã nhân viên..."
        />
        <ErrorMessage name="startTime" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-6 my-1">
        <label class="" for="endTime"
          >Kết thúc <span class="text-danger">*</span></label
        >
        <Field
          type="time"
          name="endTime"
          class="form-control my-1"
          v-model="fixedScheduleLocal.endTime"
          placeholder="Mã nhân viên..."
        />
        <ErrorMessage name="endTime" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-12 my-1">
        <label class="" for="note">Ghi chú </label>
        <Field
          type="text"
          name="note"
          v-model="fixedScheduleLocal.note"
          v-slot="{ field }"
        >
          <textarea
            v-bind="field"
            cols="10"
            rows="5"
            class="form-control"
            placeholder="Ghi chú thêm..."
          >
          </textarea>
        </Field>
        <ErrorMessage name="note" class="animated fadeIn text-danger" />
      </div>
    </div>
    <div
      class="row p-2"
      v-if="duplicateSchedules && duplicateSchedules.length > 0"
    >
      <div class="col-12 p-2 bg-danger rounded-1">
        <p class="text-center text-white">TRÙNG THỜI ĐIỂM LỊCH LÀM VIỆC</p>
        <p class="text-white">
          Lưu ý: Nhà quản lý cần chọn các thời điểm khác với thời điểm tiêm đã
          được đăng ký!
        </p>
        <div class="p-2 bg-white rounded-1">
          <table class="table" style="max-height: 500px; overflow-y: auto">
            <tr>
              <th>Ngày</th>
              <th>Tuần</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
            </tr>
            <tr
              v-for="duplicateSchedule in duplicateSchedules"
              :key="duplicateSchedule._id"
            >
              <td>
                {{ translateToWorkingDayVN(duplicateSchedule.workingDay) }}
              </td>
              <td>
                {{ translateToWorkingWeekVN(duplicateSchedule.workingWeek) }}
              </td>

              <td>
                {{ formatDateFromInstantToTime(duplicateSchedule.startTime) }}
              </td>
              <td>
                {{ formatDateFromInstantToTime(duplicateSchedule.endTime) }}
              </td>
              <td>
                {{ duplicateSchedule.note }}
              </td>
              <td>
                <span
                  v-if="duplicateSchedule.isEnable == 1"
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info"
                >
                  Hoạt động
                </span>
                <span
                  v-else
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                >
                  Ngừng hoạt động
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button
          v-if="duplicateSchedules.length == 0"
          type="submit"
          class="btn btn-primary mx-1"
        >
          Lưu
        </button>
        <button v-else class="btn btn-primary mx-1" disabled>Lưu</button>

        <button
          v-if="!fixedSchedule.id"
          class="btn btn-outline-secondary mr-0"
          type="reset"
        >
          Đặt lại
        </button>
      </div>
    </div>
  </Form>
</template>
<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
@import "flatpickr/dist/flatpickr.css";
@import "@/assets/scss/vendor/flatpickr";
</style>
