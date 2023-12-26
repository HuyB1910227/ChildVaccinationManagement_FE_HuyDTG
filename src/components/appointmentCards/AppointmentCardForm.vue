<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, onMounted, computed } from "vue";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import VueSelect from "vue-select";
import moment from "moment";
import dayjs from "dayjs";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";
import { useAuthStore } from "@/stores/AuthStore";
const immunizationUnitStore = useImmunizationUnitStore();
const optionImmunizationUnits = ref(null);
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const props = defineProps({
  appointmentCard: {
    type: Object,
    required: true,
  },
  immunizationUnitId: {
    type: String,
    required: false,
  },
  patient: {
    type: Object,
    required: false,
  },
});
const authStore = useAuthStore();
const isAministrator = authStore.hasRole("ADMINISTRATOR");
const changeFromLocalDatetoDate = () => {
  if (props.appointmentCard.appointmentDate) {
    appointmentCardLocal.value.appointmentDate = dayjs(
      props.appointmentCard.appointmentDate
    ).format("YYYY-MM-DD HH:mm");
  }
  if (props.appointmentCard.appointmentDateConfirmed) {
    appointmentCardLocal.value.appointmentDateConfirmed = dayjs(
      props.appointmentCard.appointmentDateConfirmed
    ).format("YYYY-MM-DD HH:mm");
  }
};

const emits = defineEmits(["submit:appointmentCard"]);
const appointmentCardLocal = ref(props.appointmentCard);
appointmentCardLocal.value.immunizationUnit = !isAministrator
  ? { id: authStore.immunizationUnitId, name: "Cơ sở đang công tác" }
  : props.appointmentCard != {}
  ? props.appointmentCard.immunizationUnit
  : null;
const retriveOption = async () => {
  optionImmunizationUnits.value = await immunizationUnitStore.getFSelect();
  getImmunizationUnitObjectName(optionImmunizationUnits.value);
};
const appointmentCardForCreateFormSchema = yup.object().shape({
  appointmentDate: yup
    .date()
    .min(new Date(Date.now()), "Ngày đăng ký không được nhỏ hơn ngày hiện tại")
    .required("Chưa chọn ngày đăng ký tiêm")
    .nullable()
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
  appointmentDateConfirmed: yup
    .date()
    .test(
      "is-greater",
      "Thời gian xác nhận không được lớn hơn giờ yêu cầu",
      function (value) {
        const { appointmentDate } = this.parent;
        return moment(value, "DD-MM-YYYY").isSameOrAfter(
          moment(appointmentDate, "DD-MM-YYYY")
        );
      }
    )
    .test(
      "is-before-next-day",
      "Ngày hẹn không được lớn hơn ngày yêu cầu",
      function (value) {
        const { appointmentDate } = this.parent;
        const nextDay = moment(appointmentDate, "DD-MM-YYYY").add(1, "days");
        console.log("value:", value);
        console.log("nextDay:", nextDay.format("DD-MM-YYYY"));

        console.log(moment(value, "DD-MM-YYYY").isSameOrBefore(nextDay));
        return value && moment(value, "DD-MM-YYYY").isSameOrBefore(nextDay);
      }
    )
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
  note: yup.string().nullable(),
  immunizationUnit: yup.object().required("Vui lòng chọn cơ sở tiêm"),
});

const appointmentCardForUpdateFormSchema = yup.object().shape({
  appointmentDate: yup
    .date()
    .required("Chưa chọn ngày đăng ký tiêm")
    .nullable()
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
  appointmentDateConfirmed: yup
    .date()
    .required("Chưa chọn xác nhận lịch hẹn")
    .test(
      "is-greater",
      "Thời gian xác nhận không được trước giờ yêu cầu",
      function (value) {
        const { appointmentDate } = this.parent;
        return moment(value, "DD-MM-YYYY").isSameOrAfter(
          moment(appointmentDate, "DD-MM-YYYY")
        );
      }
    )
    .test(
      "is-before-next-day",
      "Ngày hẹn không được lớn hơn ngày yêu cầu",
      function (value) {
        const { appointmentDate } = this.parent;
        const nextDay = moment(appointmentDate, "DD-MM-YYYY").add(1, "days");
        console.log("value:", value);
        console.log("nextDay:", nextDay.format("DD-MM-YYYY"));

        console.log(moment(value, "DD-MM-YYYY").isSameOrBefore(nextDay));
        return value && moment(value, "DD-MM-YYYY").isSameOrBefore(nextDay);
      }
    )
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
  note: yup.string().nullable(),
  immunizationUnit: yup.object().required("Vui lòng chọn cơ sở tiêm"),
});

const generateStatus = computed(() => {
  if (
    appointmentCardLocal.value.appointmentDate &&
    !appointmentCardLocal.value.appointmentDateConfirmed
  ) {
    return "Đăng ký";
  }
  if (
    appointmentCardLocal.value.appointmentDate &&
    appointmentCardLocal.value.appointmentDateConfirmed
  ) {
    return "Hẹn tiêm";
  }
  return "Không xác định";
});

const submit = () => {
  const submitData = {};
  if (
    appointmentCardLocal.value.id == null ||
    appointmentCardLocal.value.id < 1
  ) {
    submitData.appointmentDate = new Date(
      appointmentCardLocal.value.appointmentDate
    ).toISOString();
    if (appointmentCardLocal.value.appointmentDateConfirmed) {
      submitData.appointmentDateConfirmed = new Date(
        appointmentCardLocal.value.appointmentDateConfirmed
      ).toISOString();
    } else {
      submitData.appointmentDateConfirmed = null;
    }

    submitData.note = appointmentCardLocal.value.note;
    submitData.immunizationUnit = props.immunizationUnitId
      ? { id: props.immunizationUnitId }
      : appointmentCardLocal.value.immunizationUnit;

    if (
      appointmentCardLocal.value.appointmentDate &&
      appointmentCardLocal.value.appointmentDateConfirmed
    ) {
      submitData.status = 1;
    } else {
      submitData.status = 0;
    }
    submitData.patient = props.patient;
    emits("submit:appointmentCard", submitData);
  } else {
    submitData.id = appointmentCardLocal.value.id;
    submitData.appointmentDate = new Date(
      appointmentCardLocal.value.appointmentDate
    ).toISOString();
    submitData.appointmentDateConfirmed = new Date(
      appointmentCardLocal.value.appointmentDateConfirmed
    ).toISOString();
    submitData.note = appointmentCardLocal.value.note;
    submitData.immunizationUnit = props.immunizationUnitId
      ? { id: props.immunizationUnitId }
      : appointmentCardLocal.value.immunizationUnit;

    if (
      appointmentCardLocal.value.appointmentDate &&
      appointmentCardLocal.value.appointmentDateConfirmed
    ) {
      submitData.status = 1;
    } else {
      submitData.status = 0;
    }
    submitData.patient = appointmentCardLocal.value.patient;
    emits("submit:appointmentCard", submitData);
  }
};
const getImmunizationUnitObjectName = (options) => {
  if (authStore.immunizationUnitId != "null") {
    const t = options.filter((op) => op.id == authStore.immunizationUnitId);
    console.log(t);
    appointmentCardLocal.value.immunizationUnit.name = t[0].name;
    console.log(appointmentCardLocal.value.immunizationUnit);
  }
};
onMounted(() => {
  retriveOption();
  changeFromLocalDatetoDate();
  console.log(props.appointmentCard);
});
</script>

<template>
  <Form
    @submit="submit"
    :validation-schema="
      appointmentCardLocal.id != null
        ? appointmentCardForUpdateFormSchema
        : appointmentCardForCreateFormSchema
    "
    class="space-y-4"
  >
    <div class="row">
      <div class="col-md-6 my-1" :class="{ 'd-none': appointmentCardLocal.id }">
        <label for="appointmentDate"
          >Ngày hẹn (yêu cầu)<span class="text-danger"> *</span></label
        >
        <Field
          type="datetime-local"
          name="appointmentDate"
          class="form-control my-1"
          v-model="appointmentCardLocal.appointmentDate"
          placeholder="Ngày đăng ký..."
        />
        <ErrorMessage
          name="appointmentDate"
          class="animated fadeIn text-danger"
        />
      </div>
      <div
        class="col-md-6 my-1"
        :class="{ 'd-none': appointmentCardLocal.id == null }"
      >
        <label for="appointmentDate"
          >Ngày hẹn (yêu cầu)<span class="text-danger"> *</span></label
        >
        <br />
        <input
          type="text"
          name="appointmentDate"
          class="form-control my-1"
          :value="
            formatDateFromInstantToDateTime(
              appointmentCardLocal.appointmentDate
            )
          "
          placeholder="Ngày đăng ký..."
          disabled
        />
      </div>

      <div class="col-md-6 my-1">
        <label for="appointmentDateConfirmed"
          >Ngày hẹn (xác nhận)<span
            class="text-danger"
            :class="{ 'd-none': appointmentCardLocal.id == null }"
          >
            *</span
          ></label
        >
        <Field
          type="datetime-local"
          name="appointmentDateConfirmed"
          class="form-control my-1"
          v-model="appointmentCardLocal.appointmentDateConfirmed"
          placeholder="Ngày hẹn..."
        />
        <ErrorMessage
          name="appointmentDateConfirmed"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-12 my-1">
        <label for="note">Ghi chú</label>
        <Field
          type="text"
          name="note"
          class="form-control my-1"
          v-model="appointmentCardLocal.note"
          v-slot="{ field }"
        >
          <textarea
            v-bind="field"
            cols="10"
            rows="2"
            class="form-control"
            placeholder="Ghi chú..."
          >
          </textarea>
        </Field>
        <ErrorMessage name="note" class="animated fadeIn text-danger" />
      </div>

      <!-- Đối với admin -->
      <template
        v-if="
          !appointmentCardLocal.immunizationUnit ||
          (isAministrator && appointmentCardLocal.immunizationUnit)
        "
      >
        <div class="col-md-8 my-1" v-if="optionImmunizationUnits">
          <label for="immunizationUnit"
            >Cơ sở <span class="text-danger">*</span></label
          >
          <Field
            name="immunizationUnit"
            class="form-control my-1"
            v-model="appointmentCardLocal.immunizationUnit"
            placeholder="Chọn cơ sở..."
          >
            <VueSelect
              v-model="appointmentCardLocal.immunizationUnit"
              :options="optionImmunizationUnits"
              placeholder="Chọn loại vắc xin.."
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
      <!-- Đối với manager -->
      <template v-else>
        <div
          class="col-md-8 my-1"
          v-if="
            appointmentCardLocal.immunizationUnit && optionImmunizationUnits
          "
        >
          <label for="immunizationUnit"
            >Cơ sở <span class="text-danger">*</span></label
          >
          <Field
            name="immunizationUnit"
            class="form-control my-1"
            placeholder="Chọn cơ sở..."
            v-model="appointmentCardLocal.immunizationUnit"
          >
            <VueSelect
              v-model="appointmentCardLocal.immunizationUnit"
              :options="[appointmentCardLocal.immunizationUnit]"
              placeholder="Chọn loại vắc xin.."
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
      <div class="col-md-4 my-1">
        Trạng thái
        <input
          class="form-control my-1"
          type="text"
          disabled
          :value="generateStatus"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!appointmentCard.id"
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
</style>
