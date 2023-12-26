<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
const props = defineProps({
  immunizationUnitId: {
    type: String,
    required: false,
  },
  patient: {
    type: Object,
    required: false,
  },
});

const appointmentCardLocal = ref({});

const appointmentCardForCreateFormSchema = yup.object().shape({
  appointmentDate: yup
    .date()
    .min(new Date(Date.now()), "Ngày đăng ký không được nhỏ hơn ngày hiện tại")
    .required("Chưa chọn ngày đăng ký tiêm")
    .nullable()
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
  note: yup.string(),
});
import UseAppointmentCardService from "../../services/useService/useAppointmentCardService";
const create = async (data) => {
  let appointmentCardUpdated = null;
  appointmentCardUpdated = await UseAppointmentCardService.create(data);

  if (appointmentCardUpdated) {
    console.log("đã gửi lịch hẹn!");
  } else {
    alert("Thêm thông tin thất bại");
  }
};
const submit = async () => {
  const submitData = {};
  if (
    appointmentCardLocal.value.id == null ||
    appointmentCardLocal.value.id < 1
  ) {
    submitData.appointmentDate = new Date(
      appointmentCardLocal.value.appointmentDate
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
    submitData.patient = props.patient;

    try {
      await appointmentCardForCreateFormSchema.validate(
        appointmentCardLocal.value
      );
      create(submitData);
    } catch (error) {
      alert("Kiểm tra lịch hẹn: " + error.message);
    }
  }
};

const invalidMessage = async () => {
  try {
    await appointmentCardForCreateFormSchema.validate(
      appointmentCardLocal.value
    );
    return null;
  } catch (error) {
    return "Vui lòng kiểm tra lại lịch hẹn!";
  }
};
defineExpose({
  invalidMessage,
  submit,
});
</script>

<template>
  <Form
    @submit="submit"
    :validation-schema="appointmentCardForCreateFormSchema"
    class="space-y-4"
  >
    <div class="row">
      <div class="col-md-6 my-1">
        <label for="appointmentDate"
          >Ngày hẹn<span class="text-danger"> </span
        ></label>
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
    </div>
  </Form>
</template>
<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
