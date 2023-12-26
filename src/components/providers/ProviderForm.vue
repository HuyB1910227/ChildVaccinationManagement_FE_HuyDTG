<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from "vue";

const props = defineProps({
  provider: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["submit:provider"]);
const providerLocal = ref(props.provider);

const providerFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Chưa nhập nhà cung cấp")
    .min(5, "Tên vắc xin phải có ít nhất 5 ký tự")
    .max(100, "Tên vắc xin không được nhiều hơn 100 ký tự"),
});

const submitVaccine = () => {
  const submitData = {};
  if (providerLocal.value.id == null || providerLocal.value.id < 1) {
    submitData.name = providerLocal.value.name;
    emits("submit:provider", submitData);
  } else {
    submitData.id = providerLocal.value.id;
    submitData.name = providerLocal.value.name;
    emits("submit:provider", submitData);
  }
};
</script>

<template>
  <Form
    @submit="submitVaccine"
    :validation-schema="providerFormSchema"
    class="space-y-4"
  >
    <div class="row">
      <div class="col-md-12 my-1">
        <label for="name"
          >Tên nhà cung cấp <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="name"
          class="form-control my-1"
          v-model="providerLocal.name"
          placeholder="Tên nhà cung cấp..."
        />
        <ErrorMessage name="name" class="animated fadeIn text-danger" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!provider.id"
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
