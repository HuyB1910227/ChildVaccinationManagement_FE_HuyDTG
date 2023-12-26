<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch } from "vue";
import { DistanceTimeType } from "@/data/distanceTimeType";
const props = defineProps({
  injection: {
    type: Object,
    required: true,
  },
  age: {
    type: Object,
  },
});
const emits = defineEmits(["submit:injection", "submitUpdate:injection"]);
const injectionLocal = ref(props.injection);

const injectionFormSchema = yup.object().shape({
  injectionTime: yup
    .number()
    .required("Chưa nhập lần tiêm")
    .positive("Lần tiêm phải lớn hơn 0"),

  distanceFromPrevious: yup
    .number()
    .required("Chưa nhập hiệu lực")
    .positive("Hiệu lực phải lớn hơn 0 ")
    .min(1, "Thời gian hiệu lực phải lớn hơn 0"),
  distanceFromPreviousType: yup.string().required("Chưa chọn đơn vị hiệu lực"),
});
const submitInjection = () => {
  const submitData = {};
  if (injectionLocal.value.id == null || injectionLocal.value.id < 1) {
    submitData.injectionTime = injectionLocal.value.injectionTime;
    submitData.distanceFromPrevious = injectionLocal.value.distanceFromPrevious;
    submitData.distanceFromPreviousType =
      injectionLocal.value.distanceFromPreviousType;
    submitData.age = props.age;
    emits("submit:injection", submitData);
  } else {
    submitData.id = props.injection.id;
    submitData.injectionTime = injectionLocal.value.injectionTime;
    submitData.distanceFromPrevious = injectionLocal.value.distanceFromPrevious;
    submitData.distanceFromPreviousType =
      injectionLocal.value.distanceFromPreviousType;
    submitData.age = props.injection.age;
    emits("submitUpdate:injection", submitData);
  }
};

watch(
  () => props.injection,
  (newVal) => {
    injectionLocal.value = newVal;
  }
);

watch(
  () => injectionLocal.value.injectionTime,
  (newVal) => {
    if (newVal < 2) {
      injectionLocal.value.distanceFromPrevious = null;
      injectionLocal.value.distanceFromPreviousType = null;
    }
  }
);

const distanceTypeOption = reactive([
  {
    name: "Ngày",
    value: DistanceTimeType.NGAY,
  },
  {
    name: "Tuần",
    value: DistanceTimeType.TUAN,
  },
  {
    name: "Tháng",
    value: DistanceTimeType.THANG,
  },
  {
    name: "Năm",
    value: DistanceTimeType.NAM,
  },
]);

const clearForm = () => {
  injectionLocal.value.distanceFromPrevious = null;
  injectionLocal.value.distanceFromPreviousType = null;
};

watch(
  () => props.injection,
  (newVal) => {
    console.log(newVal);
  }
);
</script>

<template>
  <Form
    @submit="submitInjection"
    :validation-schema="injectionFormSchema"
    class="space-y-4 pb-2"
  >
    <div class="row">
      <div class="col-md-2 my-1">
        <label class="" for="injectionTime"
          >Lần tiêm <span class="text-danger">*</span></label
        >
        <Field
          type="number"
          name="injectionTime"
          class="form-control my-1"
          v-model="injectionLocal.injectionTime"
          placeholder="0"
          step="1"
          min="1"
          disabled
        />
        <ErrorMessage
          name="injectionTime"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-5 my-1">
        <label class="" for="distanceFromPrevious"
          >Hiệu lực <span class="text-danger">*</span></label
        >
        <Field
          type="number"
          name="distanceFromPrevious"
          class="form-control my-1"
          v-model="injectionLocal.distanceFromPrevious"
          placeholder="1"
          step="1"
          min="1"
        />
        <ErrorMessage
          name="distanceFromPrevious"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-5 my-1" v-if="distanceTypeOption">
        <label for="distanceFromPreviousType"
          >Đơn vị khoảng cách (đvt) <span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="distanceFromPreviousType"
          as="select"
          class="form-select"
          v-model="injectionLocal.distanceFromPreviousType"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in distanceTypeOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(distanceTypeOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage
          name="distanceFromPreviousType"
          class="animated fadeIn text-danger"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!injection.id"
          class="btn btn-outline-secondary mr-0"
          @click="clearForm"
        >
          Làm mới
        </button>
      </div>
    </div>
  </Form>
</template>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
