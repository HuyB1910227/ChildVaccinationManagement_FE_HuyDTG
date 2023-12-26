<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch } from "vue";
import { AgeType } from "@/data/ageType";
import { RequestAgeType } from "@/data/requestAgeType";
const props = defineProps({
  age: {
    type: Object,
    required: true,
  },
  vaccine: {
    type: Object,
  },
  uniqueAge: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits([
  "submit:age",
  "update:clearForm",
  "submitUpdate:age",
]);
const ageLocal = ref(props.age);

const ageFormSchema = yup.object().shape({
  minAge: yup
    .number("Chưa nhập độ tuổi tói thiểu")
    .required("Chưa nhập độ tuổi tối thiểu")

    .integer("Độ tuổi tối thiểu phải là số nguyên")
    .moreThan(-1, "Độ tuổi tối thiểu không nhỏ hơn 0"),
  maxAge: yup
    .number()
    .integer("Độ tuổi tối thiểu phải là số nguyên")
    .test(
      "is-greater",
      "Độ tuổi tối đa không được nhỏ hơn độ tuổi tối thiểu",
      function (value) {
        const { minAge, minAgeType, maxAgeType } = this.parent;
        let min = minAge;
        let max = value;
        if (minAgeType != "TUOI") {
          min = convertAMonthsToAYears(minAge);
        }
        if (maxAgeType != "TUOI") {
          max = convertAMonthsToAYears(value);
        }
        return min < max;
      }
    )
    .required("Chưa nhập độ tuổi tối đa"),
  minAgeType: yup.string().required("Chưa chọn đơn vị tính"),
  maxAgeType: yup.string().required("Chưa chọn đơn vị tính"),
  requestType: yup.string().required("Chưa chọn tiêu chuẩn tiêm"),
  note: yup.string().max(254, "Ghi chú không quá 254 ký tự").nullable(),
});
const submitDisease = () => {
  const submitData = {};
  if (ageLocal.value.id == null || ageLocal.value.id < 1) {
    submitData.minAge = ageLocal.value.minAge;
    submitData.maxAge = ageLocal.value.maxAge;
    submitData.minAgeType = ageLocal.value.minAgeType;
    submitData.maxAgeType = ageLocal.value.maxAgeType;
    submitData.vaccine = props.vaccine;
    submitData.note = ageLocal.value.note;
    submitData.requestType = ageLocal.value.requestType;
    if (!isValidNewAge(submitData)) {
      showInvalidAgeDialog.value = true;
    } else {
      console.log("OK");
      showInvalidAgeDialog.value = false;
      emits("submit:age", submitData);
    }
  } else {
    submitData.id = props.age.id;
    submitData.minAge = ageLocal.value.minAge;
    submitData.maxAge = ageLocal.value.maxAge;
    submitData.minAgeType = ageLocal.value.minAgeType;
    submitData.maxAgeType = ageLocal.value.maxAgeType;
    submitData.vaccine = props.age.vaccine;
    submitData.note = ageLocal.value.note;
    submitData.requestType = ageLocal.value.requestType;
    if (!isValidNewAge(submitData)) {
      console.log("Sai");
      showInvalidAgeDialog.value = true;
    } else {
      console.log("OK");
      showInvalidAgeDialog.value = false;
      emits("submitUpdate:age", submitData);
    }
  }
};

watch(
  () => props.age,
  (newVal) => {
    ageLocal.value = newVal;
  }
);
const ageTypeOption = reactive([
  {
    name: "tháng tuổi",
    value: AgeType.THANG,
  },
  {
    name: "tuổi",
    value: AgeType.TUOI,
  },
]);

const requestTypeOption = reactive([
  {
    name: "Tuân thủ",
    value: RequestAgeType.TIEU_CHUAN,
  },
  {
    name: "Có thể thay đổi",
    value: RequestAgeType.KHUYEN_CAO,
  },
  {
    name: "Bác sĩ chỉ định",
    value: RequestAgeType.TUY_CHON,
  },
]);

const confirmedAgeArray = ref([]);

const convertAMonthsToAYears = (monthAge) => {
  const years = monthAge / 12;
  return years;
};
const handleToGenerateConfirmedAges = () => {
  const convertedAges = props.uniqueAge.map((age) => {
    let ageRes = { min: null, max: null };
    if (age.minAgeType !== "TUOI") {
      ageRes.min = convertAMonthsToAYears(age.minAge);
    } else {
      ageRes.min = age.minAge;
    }
    if (age.maxAgeType !== "TUOI") {
      ageRes.max = convertAMonthsToAYears(age.maxAge);
    } else {
      ageRes.max = age.maxAge;
    }
    return ageRes;
  });

  if (props.age) {
    let minusAge = { min: null, max: null };
    if (props.age.minAgeType !== "TUOI") {
      minusAge.min = convertAMonthsToAYears(props.age.minAge);
    } else {
      minusAge.min = props.age.minAge;
    }
    if (props.age.maxAgeType !== "TUOI") {
      minusAge.max = convertAMonthsToAYears(props.age.maxAge);
    } else {
      minusAge.max = props.age.maxAge;
    }

    console.log(minusAge);
    console.log(convertedAges);

    confirmedAgeArray.value = convertedAges.filter(
      (a) => a.min != minusAge.min || a.max != minusAge.max
    );
    console.log(confirmedAgeArray.value);
  } else {
    confirmedAgeArray.value = convertedAges;
  }
};

const isValidNewAge = (newAge) => {
  handleToGenerateConfirmedAges();
  let age = { min: null, max: null };
  if (newAge.minAgeType != "TUOI") {
    age.min = convertAMonthsToAYears(newAge.minAge);
  } else {
    age.min = newAge.minAge;
  }
  if (newAge.maxAgeType != "TUOI") {
    age.max = convertAMonthsToAYears(newAge.maxAge);
  } else {
    age.max = newAge.maxAge;
  }

  for (const oldAge of confirmedAgeArray.value) {
    if (age.min <= oldAge.max && age.max >= oldAge.min) {
      console.log("có lỗi");
      return false;
    }
  }
  return true;
};

const showInvalidAgeDialog = ref(false);
</script>

<template>
  <Form
    @submit="submitDisease"
    :validation-schema="ageFormSchema"
    class="space-y-4 pb-2"
  >
    <div class="row">
      <div class="col-md-6 my-1">
        <label class="" for="minAge"
          >Độ tuổi tối thiểu <span class="text-danger">*</span></label
        >
        <Field
          type="number"
          name="minAge"
          class="form-control my-1"
          v-model="ageLocal.minAge"
          placeholder="0"
          step="1"
          min="0"
        />
        <ErrorMessage name="minAge" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1" v-if="ageTypeOption">
        <label for="minAgeType"
          >Độ tuổi tối thiểu (đvt) <span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="minAgeType"
          as="select"
          class="form-select"
          v-model="ageLocal.minAgeType"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in ageTypeOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(ageTypeOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="minAgeType" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-6 my-1">
        <label class="" for="maxAge"
          >Độ tuổi tối đa <span class="text-danger">*</span></label
        >
        <Field
          type="number"
          name="maxAge"
          class="form-control my-1"
          v-model="ageLocal.maxAge"
          placeholder="0"
          step="1"
          min="0"
        />
        <ErrorMessage name="maxAge" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label for="maxAgeType"
          >Độ tuổi tối đa (đvt) <span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="maxAgeType"
          as="select"
          class="form-select"
          v-model="ageLocal.maxAgeType"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in ageTypeOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(ageTypeOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="maxAgeType" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label for="requestType"
          >Yêu cầu <span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="requestType"
          as="select"
          class="form-select"
          v-model="ageLocal.requestType"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in requestTypeOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(requestTypeOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="requestType" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label for="note">Ghi chú <span class="text-danger">*</span></label>
        <Field
          name="note"
          as="textarea"
          class="form-control my-1"
          v-model="ageLocal.note"
        >
        </Field>
        <ErrorMessage name="note" class="animated fadeIn text-danger" />
      </div>
    </div>

    <div class="row">
      <div class="col-12" v-if="showInvalidAgeDialog">
        <div class="alert alert-warning d-flex align-items-center" role="alert">
          <div class="flex-shrink-0">
            <i class="fa-solid fa-exclamation"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="mb-0 fw-bold">
              Giai đoạn vừa thêm không hợp lệ! Vui lòng đảm bảo giai đoạn tiêm
              mới không trùng tiến trình với các giai đoạn tiêm trước đó.
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-8">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!age.id"
          type="reset"
          class="btn btn-outline-secondary mr-0"
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
