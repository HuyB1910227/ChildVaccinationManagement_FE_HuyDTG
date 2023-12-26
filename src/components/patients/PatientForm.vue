<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted } from "vue";
import ProvinceService from "@/services/province.service";
import VueSelect from "vue-select";
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
  customer: {
    type: Object,
    required: false,
  },
});

const emits = defineEmits(["submit:patient"]);

const patientLocal = ref(props.patient);
const selectedArea = ref({
  province: null,
  district: null,
  ward: null,
});
const isLoading = ref(false);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const address = ref({
  no: null,
  ward: null,
  district: null,
  province: null,
});

const getArrayAddress = () => {
  if (props.patient.address != null) {
    let arr = props.patient.address.split(" ; ");
    if (arr.length - 1 >= 3) {
      address.value.province = arr[arr.length - 1];
      address.value.district = arr[arr.length - 2];
      address.value.ward = arr[arr.length - 3];
      patientLocal.value.no = arr[arr.length - 4];
    } else {
      address.value.province = null;
      address.value.district = null;
      address.value.ward = null;
      patientLocal.value.no = null;
    }
    console.log(address.value);
  }
};

const patientFormSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Chưa nhập họ tên")
    .min(5, "Họ tên phải có ít nhất 5 ký tự")
    .max(100, "Họ tên không được nhiều hơn 100 ký tự"),
  gender: yup.number().required("Chưa chọn giới tính"),
  dateOfBirth: yup
    .date()
    .max(new Date(Date.now()), "Ngày sinh không được lớn hơn ngày hiện tại")
    .required("Chưa chọn ngày sinh"),
  no: yup.string().required("Chưa nhập địa chỉ"),
  province: yup.object().required("Chưa chọn tỉnh/thành phố"),
  district: yup.object().required("Chưa chọn quận/huyện"),
  ward: yup.object().required("Chưa chọn phường/xã"),
});

const submitPatient = () => {
  console.log(patientLocal.value);
  const submitData = {};
  if (patientLocal.value.id == null || patientLocal.value.id < 1) {
    submitData.fullName = patientLocal.value.fullName;
    submitData.gender = patientLocal.value.gender;
    submitData.dateOfBirth = patientLocal.value.dateOfBirth;
    submitData.address =
      patientLocal.value.no +
      " ; " +
      patientLocal.value.ward.name +
      " ; " +
      patientLocal.value.district.name +
      " ; " +
      patientLocal.value.province.name;
    submitData.customer = props.customer;
    emits("submit:patient", submitData);
  } else {
    submitData.id = patientLocal.value.id;
    submitData.fullName = patientLocal.value.fullName;
    submitData.gender = patientLocal.value.gender;
    submitData.dateOfBirth = patientLocal.value.dateOfBirth;
    submitData.address =
      patientLocal.value.no +
      " ; " +
      patientLocal.value.ward.name +
      " ; " +
      patientLocal.value.district.name +
      " ; " +
      patientLocal.value.province.name;
    submitData.customer = patientLocal.value.customer;
    emits("submit:patient", submitData);
  }
};

const genderOption = reactive([
  {
    name: "Nam",
    value: 0,
  },
  {
    name: "Nữ",
    value: 1,
  },
]);
const getSelectedArea = async () => {
  if (address.value) {
    await getAllProvinces();
    selectedArea.value.province = provinces.value.find(
      (p) => p.name === address.value.province
    );
    patientLocal.value.province = selectedArea.value.province;
    if (selectedArea.value.province) {
      await getDistrictsFromProvinceCode(selectedArea.value.province.code);
      selectedArea.value.district = districts.value.find(
        (d) => d.name === address.value.district
      );
      patientLocal.value.district = selectedArea.value.district;
      if (selectedArea.value.district) {
        await getWardsFromDistrictCode(selectedArea.value.district.code);
        selectedArea.value.ward = wards.value.find(
          (w) => w.name === address.value.ward
        );
        patientLocal.value.ward = selectedArea.value.ward;
      }
    }
  }
};

const getAllProvinces = async () => {
  try {
    provinces.value = await ProvinceService.getAllProvinces();
    isLoading.value = true;
  } catch (error) {
    console.log(error);
  }
};

const getDistrictsFromProvinceCode = async (provinceCode) => {
  try {
    const params = {};
    params["depth"] = 2;
    const data = await ProvinceService.getProvince(provinceCode, params);
    districts.value = data.districts;
  } catch (error) {
    console.log(error);
  }
};

const getWardsFromDistrictCode = async (districtCode) => {
  try {
    const params = {};
    params["depth"] = 2;
    const data = await ProvinceService.getDistrict(districtCode, params);
    wards.value = data.wards;
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => patientLocal.value.province,
  (newVal) => {
    if (newVal != null) {
      patientLocal.value.district = null;
      patientLocal.value.ward = null;
      districts.value = [];
      getDistrictsFromProvinceCode(newVal.code);
    } else {
      patientLocal.value.district = null;
      patientLocal.value.ward = null;
      districts.value = [];
    }
  }
);

watch(
  () => patientLocal.value.district,
  (newVal) => {
    if (newVal != null) {
      patientLocal.value.ward = null;
      wards.value = [];
      getWardsFromDistrictCode(newVal.code);
    } else {
      patientLocal.value.ward = null;
      wards.value = [];
    }
  }
);

onMounted(() => {
  getAllProvinces();
  getSelectedArea();
  getArrayAddress();
});
</script>

<template>
  <Form
    @submit="submitPatient"
    class="space-y-4"
    :validation-schema="patientFormSchema"
  >
    <div class="row">
      <div class="col-md-4 my-1">
        <label for="fullName"
          >Họ và tên <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="fullName"
          class="form-control my-1"
          v-model="patientLocal.fullName"
          placeholder="Họ và tên..."
        />
        <ErrorMessage name="fullName" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1" v-if="genderOption">
        <label class="" for="gender"
          >Giới tính<span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="gender"
          as="select"
          class="form-select my-1"
          v-model="patientLocal.gender"
        >
          <option value="" disabled>--Chọn--</option>
          <option v-for="data in genderOption" :key="data" :value="data.value">
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="gender" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1">
        <label class="" for="dateOfBirth"
          >Ngày sinh <span class="text-danger">*</span></label
        >

        <Field
          type="date"
          name="dateOfBirth"
          class="form-control my-1"
          v-model="patientLocal.dateOfBirth"
          placeholder="Mã nhân viên..."
        />
        <ErrorMessage name="dateOfBirth" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1">
        <label class="" for="no"
          >Địa chỉ <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="no"
          class="form-control my-1"
          v-model="patientLocal.no"
          placeholder="Địa chỉ"
        />
        <ErrorMessage name="no" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1" v-if="isLoading">
        <label for="province"
          >Tỉnh/ Thành phố <span class="text-danger">*</span></label
        >
        <Field
          name="province"
          class="form-control"
          v-model="patientLocal.province"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="patientLocal.province"
            :options="provinces"
            placeholder="Chọn tỉnh/thành phố.."
            label="name"
            class="my-1"
            name="province"
          ></VueSelect>
        </Field>
        <ErrorMessage name="province" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1" v-if="districts != []">
        <label for="district"
          >Quận/ Huyện <span class="text-danger">*</span></label
        >
        <Field
          name="district"
          class="form-control my-1"
          v-model="patientLocal.district"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="patientLocal.district"
            :options="districts"
            placeholder="Chọn quận/huyện.."
            label="name"
            class="my-1"
            name="district"
          ></VueSelect>
        </Field>
        <ErrorMessage name="district" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1" v-if="wards != []">
        <label for="ward">Phường/ Xã <span class="text-danger">*</span></label>
        <Field
          name="ward"
          class="form-control my-1"
          v-model="patientLocal.ward"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="patientLocal.ward"
            :options="wards"
            placeholder="Chọn phường/xã.."
            label="name"
            class="my-1"
            name="ward"
          ></VueSelect>
        </Field>
        <ErrorMessage name="ward" class="animated fadeIn text-danger" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!patient.id"
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

@import "flatpickr/dist/flatpickr.css";
@import "@/assets/scss/vendor/flatpickr";
</style>
