<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, onMounted, watch } from "vue";
import { useVaccineTypeStore } from "@/stores/VaccineTypeStore";
import { useDiseaseStore } from "@/stores/DiseaseStore";
import VueSelect from "vue-select";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

let ckeditor = CKEditor.component;

const editorData = ref("<h1>Hello CKEditor5!</h1>");
const editorConfig = ref({});

const vaccineTypeStore = useVaccineTypeStore();
const diseaseStore = useDiseaseStore();
const optionDisease = ref(null);
const optionVaccineType = ref(null);
const retriveOption = async () => {
  optionDisease.value = await diseaseStore.getDiseaseFSelect();
  optionVaccineType.value = await vaccineTypeStore.getVaccineTypeFSelect();
  console.log(optionDisease.value);
};
const props = defineProps({
  vaccine: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["submit:vaccine"]);
const vaccineLocal = ref(props.vaccine);

const vaccineFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Chưa nhập tên vắc xin")
    .min(5, "Tên vắc xin phải có ít nhất 5 ký tự")
    .max(100, "Tên vắc xin không được nhiều hơn 100 ký tự"),
  dosage: yup
    .number()
    .required("Chưa nhập liều lượng")
    .positive("Liều lượng phải lớn hơn 0"),
  commonReaction: yup
    .string()
    .required("Chưa nhập phản ứng thường gặp")
    .min(2, "Phản ứng thường gặp phải chứa ít nhất 2 ký tự")
    .max(255, "Phản ứng thường gặp không được nhiều hơn 255 ký tự"),
  vaccineType: yup.object().required("Chưa chọn loại vắc xin"),
  description: yup
    .string()
    .required("Chưa nhập mô tả")
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(1999, "Mô tả quá dài"),
  contraindication: yup
    .string()
    .required("Chưa nhập chống chỉ định")
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(1999, "Chống chỉ định quá dài"),
  diseases: yup.array().required("Chưa chọn dịch bệnh"),
});

const submitVaccine = () => {
  if (vaccineLocal.value.id == null || vaccineLocal.value.id < 1) {
    const { id, ...vaccineWithoutId } = vaccineLocal.value;
    emits("submit:vaccine", vaccineWithoutId);
  } else {
    emits("submit:vaccine", vaccineLocal.value);
  }
};

onMounted(() => {
  retriveOption();
});
watch(
  () => vaccineLocal.value.diseases,
  (newVal) => {
    if (newVal && newVal.length == 0) {
      vaccineLocal.value.diseases = null;
    }
  }
);
</script>

<template>
  <Form
    @submit="submitVaccine"
    :validation-schema="vaccineFormSchema"
    class="space-y-4"
  >
    <div class="row">
      <div class="col-md-8 my-1">
        <label for="name">Tên vắc xin <span class="text-danger">*</span></label>
        <Field
          type="text"
          name="name"
          class="form-control my-1"
          v-model="vaccineLocal.name"
          placeholder="Tên vắc xin..."
        />
        <ErrorMessage name="name" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1">
        <label for="dosage"
          >Liều lượng (ml) <span class="text-danger">*</span></label
        >
        <Field
          type="number"
          name="dosage"
          class="form-control my-1"
          v-model="vaccineLocal.dosage"
          placeholder="0.1..."
          step="0.1"
          min="0.1"
        />
        <ErrorMessage name="dosage" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-12 my-1">
        <label for="commonReaction"
          >Phản ứng thường gặp <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="commonReaction"
          v-model="vaccineLocal.commonReaction"
          v-slot="{ field }"
        >
          <textarea
            v-bind="field"
            cols="10"
            rows="5"
            class="form-control my-1"
            placeholder="Một số phản ứng sau tiêm..."
          >
          </textarea>
        </Field>
        <ErrorMessage
          name="commonReaction"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-12 my-1" v-if="optionVaccineType">
        <label for="vaccineType"
          >Loại vắc xin <span class="text-danger">*</span></label
        >
        <Field
          name="vaccineType"
          class="form-control my-1"
          v-model="vaccineLocal.vaccineType"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="vaccineLocal.vaccineType"
            :options="optionVaccineType"
            placeholder="Chọn loại vắc xin.."
            label="name"
            class="my-1"
            name="vaccineType"
          ></VueSelect>
        </Field>
        <ErrorMessage name="vaccineType" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-12 my-1" v-if="optionDisease">
        <label for="diseases"
          >Phòng bệnh <span class="text-danger">*</span></label
        >
        <Field
          name="diseases"
          class="form-control my-1"
          v-model="vaccineLocal.diseases"
        >
          <VueSelect
            multiple
            v-model="vaccineLocal.diseases"
            :options="optionDisease"
            placeholder="Chọn loại bệnh.."
            class="my-1"
            label="name"
          ></VueSelect>
        </Field>
        <ErrorMessage name="diseases" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-12 my-1">
        <label for="description"
          >Mô tả <span class="text-danger">*</span></label
        >
        <Field
          name="description"
          class="form-control my-1"
          v-model="vaccineLocal.description"
        >
          <ckeditor
            :editor="ClassicEditor"
            :config="editorConfig"
            v-model="vaccineLocal.description"
          />
        </Field>
        <ErrorMessage name="description" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-12 my-1">
        <label for="contraindication"
          >Chống chỉ định <span class="text-danger">*</span></label
        >
        <Field
          name="contraindication"
          class="form-control my-1"
          v-model="vaccineLocal.contraindication"
        >
          <ckeditor
            :editor="ClassicEditor"
            :config="editorConfig"
            v-model="vaccineLocal.contraindication"
          />
        </Field>
        <ErrorMessage
          name="contraindication"
          class="animated fadeIn text-danger"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!vaccine.id"
          class="btn btn-outline-secondary mr-0"
          type="reset"
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
        v-model="vaccineLocal.id"
        hidden
      />
    </div>
  </Form>
</template>
<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
