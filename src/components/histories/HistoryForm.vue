<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, watch } from "vue";

const props = defineProps({
  history: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["submit:history"]);
const historyLocal = ref(props.history);
watch(
  () => props.history,
  (newVal) => {
    historyLocal.value = newVal;
  }
);
const historyFormSchema = yup.object().shape({
  statusAfterInjection: yup
    .string()
    .required("Chưa nhập tên trạng thái sau tiêm")
    .min(5, "Tên vắc xin phải có ít nhất 5 ký tự")
    .max(255, "Tên vắc xin không được nhiều hơn 255 ký tự")
    .test("is-true", "Chưa nhập trạng thái sau tiêm", function (value) {
      return value.trim() !== "Chưa cập nhật";
    }),
});

const submitStatus = () => {
  const submitData = {};

  submitData.id = historyLocal.value.id;
  submitData.statusAfterInjection = historyLocal.value.statusAfterInjection;
  emits("submit:history", submitData);
};
</script>

<template>
  <Form
    @submit="submitStatus"
    :validation-schema="historyFormSchema"
    class="space-y-4"
  >
    <div class="row">
      <div class="col-md-12 my-1">
        <label for="statusAfterInjection"
          >Trạng thái sau tiêm <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="statusAfterInjection"
          class="form-control my-1"
          v-model="historyLocal.statusAfterInjection"
          v-slot="{ field }"
        >
          <textarea
            v-bind="field"
            cols="10"
            rows="5"
            class="form-control"
            placeholder="Các triệu chứng sau tiêm..."
          >
          </textarea>
        </Field>
        <ErrorMessage
          name="statusAfterInjection"
          class="animated fadeIn text-danger"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button class="btn btn-outline-secondary mr-0" type="reset">
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
