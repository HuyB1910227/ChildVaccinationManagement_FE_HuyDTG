<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, watch } from "vue";

const props = defineProps({
  nutrition: {
    type: Object,
    required: true,
  },
  patientId: {
    type: String,
    required: false,
  },
});
const emits = defineEmits(["submit:nutrition", "submitUpdate:nutrition"]);
const nutritionLocal = ref(props.nutrition);
watch(
  () => props.nutrition,
  (newVal) => {
    nutritionLocal.value = newVal;
  }
);
const nutritionFormSchema = yup.object().shape({
  weight: yup
    .number()
    .required("Chưa nhập cân nặng")
    .min(0, "Cân nặng phải lớn hơn 0 (kg)")
    .max(100, "Cân nặng phải nhỏ hơn 100 (kg)"),
  height: yup
    .number()
    .required("Chưa nhập chiều cao")
    .min(0, "Chiều cao phải lớn hơn 0 (m)")
    .max(2, "Chiều cao phải nhỏ hơn 2 (m)"),
  measurementDate: yup
    .date()
    .max(new Date(Date.now()), "Ngày đo không được lớn hơn ngày hiện tại")
    .required("Chưa chọn ngày đo"),
  status: yup.string().nullable(),
});

const submitVaccine = () => {
  const submitData = {};
  if (nutritionLocal.value.id == null || nutritionLocal.value.id < 1) {
    submitData.weight = nutritionLocal.value.weight;
    submitData.height = nutritionLocal.value.height;
    submitData.measurementDate = nutritionLocal.value.measurementDate;
    submitData.status = nutritionLocal.value.status;
    submitData.patient = {
      id: props.patientId,
    };
    emits("submit:nutrition", submitData);
  } else {
    submitData.id = nutritionLocal.value.id;
    submitData.weight = nutritionLocal.value.weight;
    submitData.height = nutritionLocal.value.height;
    submitData.measurementDate = nutritionLocal.value.measurementDate;
    submitData.status = nutritionLocal.value.status;
    submitData.patient = nutritionLocal.value.patient;
    emits("submitUpdate:nutrition", submitData);
  }
};

const clearForm = () => {
  nutritionLocal.value.height = null;
  nutritionLocal.value.weight = null;
  nutritionLocal.value.measurementDate = null;
  nutritionLocal.value.status = null;
};

defineExpose({
  clearForm,
});
</script>

<template>
  <Form
    @submit="submitVaccine"
    :validation-schema="nutritionFormSchema"
    class="space-y-4"
  >
    <div class="row">
      <div class="col-md-6 my-1">
        <label for="weight">Cân nặng <span class="text-danger">*</span></label>
        <Field
          type="number"
          name="weight"
          class="form-control my-1"
          v-model="nutritionLocal.weight"
          placeholder="Số cân nặng..."
          step="0.1"
        />
        <ErrorMessage name="weight" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label for="height">Chiều cao <span class="text-danger">*</span></label>
        <Field
          type="number"
          name="height"
          class="form-control my-1"
          v-model="nutritionLocal.height"
          placeholder="Số chiều cao..."
          step="0.1"
        />
        <ErrorMessage name="height" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label class="" for="measurementDate"
          >Ngày đo <span class="text-danger">*</span></label
        >

        <Field
          type="date"
          name="measurementDate"
          class="form-control my-1"
          v-model="nutritionLocal.measurementDate"
          placeholder="Ngày đo..."
        />
        <ErrorMessage
          name="measurementDate"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-6 my-1">
        <label class="" for="status">Mô tả </label>
        <Field
          type="text"
          name="status"
          v-model="nutritionLocal.status"
          v-slot="{ field }"
        >
          <textarea
            v-bind="field"
            cols="10"
            rows="5"
            class="form-control"
            placeholder="Mô tả bệnh, chuẩn đoán..."
          >
          </textarea>
        </Field>
        <ErrorMessage name="status" class="animated fadeIn text-danger" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary me-2">Lưu</button>
        <button
          v-if="!nutrition.id"
          class="btn btn-outline-secondary me-0"
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
