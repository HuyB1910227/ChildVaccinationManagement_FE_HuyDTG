<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted } from "vue";
import { VaccinationType } from "@/data/vaccinationType";
import { WorkingDayType } from "@/data/workingDayType";
import { WorkingWeekType } from "@/data/workingWeekType";
import dayjs from "dayjs";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import VueSelect from "vue-select";
import moment from "moment";
import CustomCheckbox from "@/components/checkbox/CustomCheckBox.vue";
import { useAuthStore } from "@/stores/AuthStore";
const authStore = useAuthStore();
const isAministrator = authStore.hasRole("ADMINISTRATOR");
const props = defineProps({
  fixedSchedule: {
    type: Object,
    required: true,
  },
});

const immunizationUnitStore = useImmunizationUnitStore();
const optionImmunizationUnits = ref(null);
const selectedWorking = reactive({
  workingDay: null,
  workingWeek: null,
});
const isLoading = ref(false);
const emits = defineEmits(["submit:fixedSchedule"]);
const retriveOption = async () => {
  optionImmunizationUnits.value = await immunizationUnitStore.getFSelect();
};

const fixedScheduleLocal = ref(props.fixedSchedule);
fixedScheduleLocal.value.immunizationUnit = !isAministrator
  ? { id: authStore.immunizationUnitId, name: "Cơ sở đang công tác" }
  : props.fixedSchedule != {}
  ? props.fixedSchedule.immunizationUnit
  : null;

const fixedScheduleFormSchema = yup.object().shape({
  workingDay: yup
    .array()
    .of(yup.string().required("Chưa chọn ngày làm việc"))
    .required("Chưa chọn ngày làm việc")
    .min(1, "Chưa chọn ngày làm việc"),
  workingWeek: yup
    .array()
    .of(yup.string().required("Chưa chọn tuần làm việc"))
    .required("Chưa chọn tuần làm việc")
    .min(1, "Chưa chọn tuần làm việc"),
  vaccinationType: yup.string().required("Chưa chọn ngày loại hình tiêm chủng"),
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
  immunizationUnit: yup.object().required("Chưa chọn cơ sở tiêm chủng"),
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
  let combinedDateTimeString = `${defaultDate
    .toISOString()
    .slice(0, 10)} ${timeString}`;
  let dateTimeObject = new Date(combinedDateTimeString);
  return dateTimeObject.toISOString();
};

const submitFixedSchedule = () => {
  const submitData = {};
  if (fixedScheduleLocal.value.id == null || fixedScheduleLocal.value.id < 1) {
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
    submitData.isEnable = 0;
    submitData.startTime = generateInstanceFromTime(
      fixedScheduleLocal.value.startTime
    );
    submitData.endTime = generateInstanceFromTime(
      fixedScheduleLocal.value.endTime
    );
    submitData.immunizationUnit = fixedScheduleLocal.value.immunizationUnit;
    submitData.workingDayType = fixedScheduleLocal.value.workingDayType;
    submitData.workingWeekType = fixedScheduleLocal.value.workingWeekType;
    emits("submit:fixedSchedule", submitData);
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
    emits("submit:fixedSchedule", submitData);
  }
};

const generateStringDate = (value) => {
  return "D" + value;
};

const generateStringWeek = (value) => {
  return "W" + value;
};

const vaccinationTypeOption = reactive([
  {
    name: "Dịch vụ",
    value: VaccinationType.DICH_VU,
  },
  {
    name: "Mở rộng",
    value: VaccinationType.MO_RONG,
  },
]);

const handleSelectWorkingDay = (value) => {
  fixedScheduleLocal.value.workingDay = value;
  selectedWorking.workingDay = null;
  console.log(fixedScheduleLocal.value.workingDay);
};

const handleSelectWorkingWeek = (value) => {
  fixedScheduleLocal.value.workingWeek = value;
  selectedWorking.workingWeek = null;
};

const handleDefaultWeekBtn = (val) => {
  fixedScheduleLocal.value.workingWeekType = val;
  selectedWorking.workingWeek = null;
  let buttons = document.querySelectorAll(
    "button.bg-success-light.btn-name-workingWeek"
  );
  buttons.forEach((button) => {
    button.click();
  });
};

const handleInitWorking = () => {
  if (fixedScheduleLocal.value && !fixedScheduleLocal.value.workingWeekType) {
    fixedScheduleLocal.value.workingWeekType = WorkingWeekType.MAC_DINH;
  }
  if (
    fixedScheduleLocal.value.workingDay &&
    typeof fixedScheduleLocal.value.workingDay === "string"
  ) {
    selectedWorking.workingDay =
      fixedScheduleLocal.value.workingDay.split(" ; ");
    fixedScheduleLocal.value.workingDay = selectedWorking.workingDay;
    console.log(selectedWorking);
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

// checked value
const getResultFromWorkingDay = (val) => {
  console.log(selectedWorking.workingDay);
  if (isLoading.value == true) {
    if (Array.isArray(selectedWorking.workingDay)) {
      if (selectedWorking.workingDay.includes(val)) {
        console.log("kết quả: true" + val);
        return true;
      }
    } else {
      console.log("kết quả: false" + val);
      return false;
    }
  }
};

const getResultFromWorkingWeek = (val) => {
  if (isLoading.value == true) {
    if (Array.isArray(selectedWorking.workingWeek)) {
      if (selectedWorking.workingWeek.includes(val)) {
        return true;
      }
    } else {
      return false;
    }
  }
};

onMounted(() => {
  retriveOption();
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
      <div class="col-md-12 my-1">
        <label for="workingDay"
          >Ngày làm việc <span class="text-danger">*</span>
        </label>

        <div class="row mt-2">
          <div class="col-6">
            <BaseBlock title="Thứ trong tuần">
              <div class="d-flex flex-wrap">
                <CustomCheckbox
                  name="workingDay"
                  value="Mon"
                  displayValue="Thứ
                Hai"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('Mon')"
                />
                {{ getResultFromWorkingDay("Mon") }}
                <CustomCheckbox
                  name="workingDay"
                  value="Tue"
                  displayValue="Thứ Ba"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('Tue')"
                />
                <CustomCheckbox
                  name="workingDay"
                  value="Web"
                  displayValue="Thứ Tư"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('Web')"
                />
                <CustomCheckbox
                  name="workingDay"
                  value="Thu"
                  displayValue="Thứ Năm"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('Thu')"
                />
                <CustomCheckbox
                  name="workingDay"
                  value="Fri"
                  displayValue="Thứ Sáu"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('Fri')"
                />
                <CustomCheckbox
                  name="workingDay"
                  value="Sat"
                  displayValue="Thứ Bảy"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('Sat')"
                />
                <CustomCheckbox
                  name="workingDay"
                  value="Sun"
                  displayValue="Chủ Nhật"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('Sun')"
                />
              </div>
            </BaseBlock>
          </div>
          <div class="col-6">
            <BaseBlock title="Ngày trong tháng">
              <div class="d-flex flex-wrap">
                <CustomCheckbox
                  v-for="i in 31"
                  :key="i"
                  name="workingDay"
                  :value="generateStringDate(i)"
                  :displayValue="' ' + i"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('D' + i)"
                />
                <CustomCheckbox
                  name="workingDay"
                  value="END_OF_MONTH"
                  displayValue="Cuối tháng"
                  @required:update="handleSelectWorkingDay(values.workingDay)"
                  :checkedValue="getResultFromWorkingDay('END_OF_MONTH')"
                />
              </div>
            </BaseBlock>
          </div>
        </div>
        <ErrorMessage name="workingDay" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-12 my-1">
        <label for="workingWeek"
          >Tuần làm việc <span class="text-danger">*</span></label
        >
        <br />
        <button
          type="button"
          class="btn p-2 mx-1"
          :class="[
            fixedScheduleLocal.workingWeekType == WorkingWeekType.MAC_DINH
              ? 'btn-alt-primary'
              : 'btn-outline-secondary',
          ]"
          @click="handleDefaultWeekBtn(WorkingWeekType.MAC_DINH)"
        >
          Mặc định
        </button>
        |
        <button
          type="button"
          class="btn p-2 mx-1"
          :class="[
            fixedScheduleLocal.workingWeekType == WorkingWeekType.MAC_DINH
              ? 'btn-outline-secondary'
              : 'btn-alt-primary',
          ]"
          @click="handleDefaultWeekBtn(WorkingWeekType.TUY_CHON)"
        >
          Tùy chỉnh
        </button>

        <div
          class="d-flex flex-wrap"
          v-if="fixedScheduleLocal.workingWeekType == WorkingWeekType.MAC_DINH"
        >
          <CustomCheckbox
            name="workingWeek"
            value="ALL"
            displayValue="Hàng tuần"
            @required:update="handleSelectWorkingWeek(values.workingWeek)"
            :checkedValue="getResultFromWorkingWeek('ALL')"
          />
          <CustomCheckbox
            class="d-none"
            disabled
            name="workingWeek"
            value="ALL1"
            displayValue="Hàng tuầtn"
            @required:update="handleSelectWorkingWeek(values.workingWeek)"
          />
        </div>
        <div class="d-flex flex-wrap" v-else>
          <CustomCheckbox
            v-for="i in 4"
            :key="i"
            name="workingWeek"
            :value="generateStringWeek(i)"
            :displayValue="'Tuần ' + i"
            @required:update="handleSelectWorkingWeek(values.workingWeek)"
            :checkedValue="getResultFromWorkingWeek('W' + i)"
          />
        </div>

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

      <div class="col-md-6 my-1" v-if="vaccinationTypeOption">
        <label for="vaccinationType"
          >Hình thức<span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="vaccinationType"
          as="select"
          class="form-select"
          v-model="fixedScheduleLocal.vaccinationType"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in vaccinationTypeOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(vaccinationTypeOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage
          name="vaccinationType"
          class="animated fadeIn text-danger"
        />
      </div>

      <template
        v-if="
          !fixedScheduleLocal.immunizationUnit ||
          (isAministrator && fixedScheduleLocal.immunizationUnit)
        "
      >
        <div class="col-md-6 my-1" v-if="optionImmunizationUnits">
          <label for="immunizationUnit"
            >Cơ sở lưu trữ <span class="text-danger">*</span></label
          >
          <Field
            name="immunizationUnit"
            class="form-control my-1"
            v-model="fixedScheduleLocal.immunizationUnit"
            placeholder="Chọn cơ sở..."
          >
            <VueSelect
              v-model="fixedScheduleLocal.immunizationUnit"
              :options="optionImmunizationUnits"
              placeholder="Chọn cơ sở.."
              label="name"
              class="my-1"
              name="immunizationUnit"
            ></VueSelect>
          </Field>
          <ErrorMessage
            name="immunizationUnit"
            class="animated fadeIn text-danger"
          />
        </div>
      </template>
      <template v-else>
        <div class="col-md-6 my-1" v-if="fixedScheduleLocal.immunizationUnit">
          <label for="immunizationUnit"
            >Cơ sở lưu trữ <span class="text-danger">*</span></label
          >
          <Field
            name="immunizationUnit"
            class="form-control my-1"
            placeholder="Chọn cơ sở..."
            v-model="fixedScheduleLocal.immunizationUnit"
          >
            <VueSelect
              v-model="fixedScheduleLocal.immunizationUnit"
              :options="[fixedScheduleLocal.immunizationUnit]"
              placeholder="Chọn cơ sở.."
              label="name"
              class="my-1"
              disabled
              name="immunizationUnit"
            ></VueSelect>
          </Field>
          <ErrorMessage
            name="immunizationUnit"
            class="animated fadeIn text-danger"
          />
        </div>
      </template>

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

      Value:
      {{ values }}
      Local
      {{ fixedScheduleLocal }}
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
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
