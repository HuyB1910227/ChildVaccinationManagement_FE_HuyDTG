<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from "vue";

const props = defineProps({
  disease: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["submit:disease", "update:clearForm"]);
const diseaseLocal = ref(props.disease);

const diseaseFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Chưa nhập tên dịch bệnh")
    .min(5, "Tên dịch bệnh phải có ít nhất 5 ký tự")
    .max(100, "Tên dịch bệnh không được nhiều hơn 100 ký tự"),
  description: yup
    .string()
    .required("Chưa nhập mô tả")
    .min(5, "Mô tả phải có ít nhất 5 ký tự")
    .max(255, "Mô tả không được nhiều hơn 255 ký tự"),
});
const submitDisease = () => {
  if (diseaseLocal.value.id == null || diseaseLocal.value.id < 1) {
    const { id, ...diseaseWithoutId } = diseaseLocal.value;
    emits("submit:disease", diseaseWithoutId);
  } else {
    emits("submit:disease", diseaseLocal.value);
  }
};
</script>

<template>
  <Form
    @submit="submitDisease"
    :validation-schema="diseaseFormSchema"
    class="space-y-4"
  >
    <div class="row">
      <label class="col-sm-4 col-form-label" for="name"
        >Tên dịch bệnh <span class="text-danger">*</span></label
      >
      <div class="col-sm-8">
        <Field
          type="text"
          name="name"
          class="form-control"
          v-model="diseaseLocal.name"
          placeholder="Tên dịch bệnh..."
        />
        <ErrorMessage name="name" class="animated fadeIn text-danger" />
      </div>
    </div>
    <div class="row">
      <label class="col-sm-4 col-form-label" for="description"
        >Mô tả <span class="text-danger">*</span></label
      >
      <div class="col-sm-8">
        <Field
          type="text"
          name="description"
          v-model="diseaseLocal.description"
          v-slot="{ field }"
        >
          <textarea
            v-bind="field"
            cols="10"
            rows="5"
            class="form-control"
            placeholder="Mô tả bệnh..."
          >
          </textarea>
        </Field>
        <ErrorMessage name="description" class="animated fadeIn text-danger" />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8 ms-auto">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!disease.id"
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
        v-model="diseaseLocal.id"
        hidden
      />
    </div>
  </Form>
</template>
