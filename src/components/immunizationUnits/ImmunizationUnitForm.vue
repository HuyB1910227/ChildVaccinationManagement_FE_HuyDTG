<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted } from "vue";
import ProvinceService from "@/services/province.service";
import VueSelect from "vue-select";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
const props = defineProps({
  immunizationUnit: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits([
  "submit:immunizationUnit",
  "submitUpdate:immunizationUnit",
]);

const selectedArea = ref({
  province: null,
  district: null,
  ward: null,
});
const theOldUnique = reactive({
  hotline: props.immunizationUnit ? props.immunizationUnit.hotline : null,
});
watch(
  () => props.immunizationUnit,
  (newVal) => {
    immunizationUnitLocal.value = newVal;
    theOldUnique.hotline = newVal.hotline ? newVal.hotline : null;
    getAllProvinces();
    getSelectedArea();
    getArrayAddress();
  }
);

const immunizationUnitStore = useImmunizationUnitStore();
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
  if (props.immunizationUnit.address != null) {
    let arr = props.immunizationUnit.address.split(" ; ");
    if (arr.length - 1 >= 3) {
      address.value.province = arr[arr.length - 1];
      address.value.district = arr[arr.length - 2];
      address.value.ward = arr[arr.length - 3];
      immunizationUnitLocal.value.no = arr[arr.length - 4];
    } else {
      address.value.province = null;
      address.value.district = null;
      address.value.ward = null;
      immunizationUnitLocal.value.no = null;
    }
    console.log(address.value);
  }
};
const immunizationUnitLocal = ref({
  id: props.immunizationUnit.id,
  name: props.immunizationUnit.name,
  hotline: props.immunizationUnit.hotline,
  operatingLicence: props.immunizationUnit.operatingLicence,
  isActive: props.immunizationUnit.isActive,
  latitude: props.immunizationUnit.latitude,
  longitude: props.immunizationUnit.longitude,
});

const isDuplicateHotline = async (hotline) => {
  const result = await immunizationUnitStore.isInvalidUniqueValue({
    hotline: hotline,
  });
  return result ? true : false;
};

const immunizationUnitFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Chưa nhập tên cơ sở")
    .min(5, "Tên cơ sở phải lớn hơn 5 ký tự")
    .max(255, "Tên cơ sở phải nhỏ hơn 255 ký tự"),
  no: yup.string().required("Chưa nhập địa chỉ"),
  hotline: yup
    .string()
    .required("Chưa nhập số điện thoại")
    .matches(/(([0-9]{10})\b)/g, "Số điện thoại không hợp lệ.")
    .test("is-unique", "Đường dây nóng đã được sử dụng", async (value) => {
      if (value != theOldUnique.hotline) {
        const result = await isDuplicateHotline(value);
        return !result;
      }
      return true;
    }),
  operatingLicence: yup
    .string()
    .required("Chưa nhập mã giấy phép hoạt động")
    .min(5, "Mã giấy phép phải lớn hơn 5 ký tự"),
  isActive: yup.boolean().required("Chưa chọn trạng thái hoạt động"),
  latitude: yup.number().required("Chưa nhập vĩ độ"),
  longitude: yup.number().required("Chưa nhập kinh độ"),
  province: yup.object().required("Chưa chọn tỉnh/thành phố"),
  district: yup.object().required("Chưa chọn quận/huyện"),
  ward: yup.object().required("Chưa chọn phường/xã"),
});

const submitImmunizationUnit = () => {
  const submitData = {};
  if (
    immunizationUnitLocal.value.id == null ||
    immunizationUnitLocal.value.id < 1
  ) {
    submitData.name = immunizationUnitLocal.value.name;
    submitData.hotline = immunizationUnitLocal.value.hotline;
    submitData.operatingLicence = immunizationUnitLocal.value.operatingLicence;
    submitData.isActive = immunizationUnitLocal.value.isActive;
    submitData.latitude = immunizationUnitLocal.value.latitude;
    submitData.longitude = immunizationUnitLocal.value.longitude;
    submitData.address =
      immunizationUnitLocal.value.no +
      " ; " +
      immunizationUnitLocal.value.ward.name +
      " ; " +
      immunizationUnitLocal.value.district.name +
      " ; " +
      immunizationUnitLocal.value.province.name;
    console.log("submitData worked");
    emits("submit:immunizationUnit", submitData);
  } else {
    submitData.id = props.immunizationUnit.id;
    submitData.name = immunizationUnitLocal.value.name;
    submitData.hotline = immunizationUnitLocal.value.hotline;
    submitData.operatingLicence = immunizationUnitLocal.value.operatingLicence;
    submitData.isActive = immunizationUnitLocal.value.isActive;
    submitData.latitude = immunizationUnitLocal.value.latitude;
    submitData.longitude = immunizationUnitLocal.value.longitude;
    submitData.address =
      immunizationUnitLocal.value.no +
      " ; " +
      immunizationUnitLocal.value.ward.name +
      " ; " +
      immunizationUnitLocal.value.district.name +
      " ; " +
      immunizationUnitLocal.value.province.name;
    console.log(submitData);
    emits("submitUpdate:immunizationUnit", submitData);
  }
};

const isActiveOption = reactive([
  {
    name: "Hoạt động",
    value: true,
  },
  {
    name: "Không hoạt động",
    value: false,
  },
]);

const getSelectedArea = async () => {
  if (address.value) {
    await getAllProvinces();
    selectedArea.value.province = provinces.value.find(
      (p) => p.name === address.value.province
    );
    immunizationUnitLocal.value.province = selectedArea.value.province;
    if (selectedArea.value.province) {
      await getDistrictsFromProvinceCode(selectedArea.value.province.code);
      selectedArea.value.district = districts.value.find(
        (d) => d.name === address.value.district
      );
      immunizationUnitLocal.value.district = selectedArea.value.district;
      if (selectedArea.value.district) {
        await getWardsFromDistrictCode(selectedArea.value.district.code);
        selectedArea.value.ward = wards.value.find(
          (w) => w.name === address.value.ward
        );
        immunizationUnitLocal.value.ward = selectedArea.value.ward;
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
  () => immunizationUnitLocal.value.province,
  (newVal) => {
    if (newVal != null) {
      immunizationUnitLocal.value.district = null;
      immunizationUnitLocal.value.ward = null;
      districts.value = [];
      getDistrictsFromProvinceCode(newVal.code);
    } else {
      immunizationUnitLocal.value.district = null;
      immunizationUnitLocal.value.ward = null;
      districts.value = [];
    }
  }
);

watch(
  () => immunizationUnitLocal.value.district,
  (newVal) => {
    if (newVal != null) {
      immunizationUnitLocal.value.ward = null;
      wards.value = [];
      getWardsFromDistrictCode(newVal.code);
    } else {
      immunizationUnitLocal.value.ward = null;
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
    @submit="submitImmunizationUnit"
    :validation-schema="immunizationUnitFormSchema"
    class="space-y-4 pb-2"
  >
    <div class="row">
      <div class="col-md-6 my-1">
        <label class="" for="name"
          >Tên cơ sở <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="name"
          class="form-control my-1"
          v-model="immunizationUnitLocal.name"
          placeholder="Tên cơ sở..."
        />
        <ErrorMessage name="name" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label class="" for="operatingLicence"
          >Mã giấy phép hoạt động<span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="operatingLicence"
          class="form-control my-1"
          v-model="immunizationUnitLocal.operatingLicence"
          placeholder="Mã giấy phép..."
        />
        <ErrorMessage
          name="operatingLicence"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-6 my-1">
        <label class="" for="hotline"
          >hotline<span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="hotline"
          class="form-control my-1"
          v-model="immunizationUnitLocal.hotline"
          placeholder="Số điện thoại..."
        />
        <ErrorMessage name="hotline" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1" v-if="isActiveOption">
        <label class="" for="isActive"
          >Trạng thái<span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="isActive"
          as="select"
          class="form-select"
          v-model="immunizationUnitLocal.isActive"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in isActiveOption"
            :key="data"
            :value="data.value"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="isActive" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label class="" for="latitude"
          >Vĩ độ<span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="latitude"
          class="form-control my-1"
          v-model="immunizationUnitLocal.latitude"
          placeholder="Vĩ độ..."
        />
        <ErrorMessage name="latitude" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label class="" for="longitude"
          >Kinh độ<span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="longitude"
          class="form-control my-1"
          v-model="immunizationUnitLocal.longitude"
          placeholder="Kinh độ..."
        />
        <ErrorMessage name="longitude" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label class="" for="no"
          >Địa chỉ<span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="no"
          class="form-control my-1"
          v-model="immunizationUnitLocal.no"
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
          class="form-control my-1"
          v-model="immunizationUnitLocal.province"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="immunizationUnitLocal.province"
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
          v-model="immunizationUnitLocal.district"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="immunizationUnitLocal.district"
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
          v-model="immunizationUnitLocal.ward"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="immunizationUnitLocal.ward"
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
      <div class="col-sm-8">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!immunizationUnit.id"
          class="btn btn-outline-secondary mr-0"
          type="reset"
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
