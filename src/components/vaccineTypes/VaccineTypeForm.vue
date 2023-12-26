<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from "vue";

const props = defineProps({
  vaccineType: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["submit:vaccineType"]);
const vaccineTypeLocal = ref(props.vaccineType);

const vaccineTypeFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Chưa nhập tên loại vắc xin")
    .min(5, "Tên loại vắc xin phải có ít nhất 5 ký tự")
    .max(255, "Tên loại vắc xin không được nhiều hơn 255 ký tự"),
});
const submitVaccineType = () => {
  if (vaccineTypeLocal.value.id == null || vaccineTypeLocal.value.id < 1) {
    const { id, ...vaccineTypeWithoutId } = vaccineTypeLocal.value;
    emits("submit:vaccineType", vaccineTypeWithoutId);
  } else {
    emits("submit:vaccineType", vaccineTypeLocal.value);
  }
};
</script>

<template>
  <Form
    @submit="submitVaccineType"
    :validation-schema="vaccineTypeFormSchema"
    class="space-y-4"
  >
    <div class="row">
      <label class="col-sm-4 col-form-label" for="name"
        >Tên loại vắc xin <span class="text-danger">*</span></label
      >
      <div class="col-sm-8">
        <Field
          type="text"
          name="name"
          class="form-control"
          v-model="vaccineTypeLocal.name"
          placeholder="Tên loại vắc xin..."
        />
        <ErrorMessage name="name" class="animated fadeIn text-danger" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-8 ms-auto">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!vaccineType.id"
          type="reset"
          class="btn btn-outline-secondary mr-0"
        >
          Đặt lại
        </button>
      </div>
    </div>

    <div class="row">
      <Field
        type="number"
        name="id"
        class="form-control"
        v-model="vaccineTypeLocal.id"
        hidden
      />
    </div>
  </Form>
</template>
