<script setup>
import ProvinceService from "@/services/province.service";
import { ref, onMounted, watch } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueSelect from "vue-select";
const props = defineProps({
  pro: {
    type: Object,
    required: false,
    default: null,
  },
});

const selectedArea = ref({
  province: null,
  district: null,
  ward: null,
});
const isLoading = ref(false);
const areaLocal = ref({});
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const emits = defineEmits(["submit:provinces", "submit:submitRequired"]);
const getSelectedArea = async () => {
  if (props.pro) {
    await getAllProvinces();
    selectedArea.value.province = provinces.value.find(
      (p) => p.name === props.pro.provinceName
    );
    areaLocal.value.province = selectedArea.value.province;
    if (selectedArea.value.province) {
      await getDistrictsFromProvinceCode(selectedArea.value.province.code);
      selectedArea.value.district = districts.value.find(
        (d) => d.name === props.pro.districtName
      );
      areaLocal.value.district = selectedArea.value.district;
      if (selectedArea.value.district) {
        await getWardsFromDistrictCode(selectedArea.value.district.code);
        selectedArea.value.ward = wards.value.find(
          (w) => w.name === props.pro.wardName
        );
        areaLocal.value.ward = selectedArea.value.ward;
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
  () => areaLocal.value.province,
  (newVal) => {
    if (newVal != null) {
      areaLocal.value.district = null;
      areaLocal.value.ward = null;
      districts.value = [];
      getDistrictsFromProvinceCode(newVal.code);
    } else {
      areaLocal.value.district = null;
      areaLocal.value.ward = null;
      districts.value = [];
    }
  }
);

watch(
  () => areaLocal.value.district,
  (newVal) => {
    if (newVal != null) {
      areaLocal.value.ward = null;
      wards.value = [];
      getWardsFromDistrictCode(newVal.code);
    } else {
      areaLocal.value.ward = null;
      wards.value = [];
    }
  }
);

const areaFormSchema = yup.object().shape({
  province: yup.object().required("Chưa chọn tỉnh/thành phố"),
  district: yup.object().required("Chưa chọn quận/huyện"),
  ward: yup.object().required("Chưa chọn phường/xã"),
});

const submitProvinces = () => {
  emits("submit:provinces", areaLocal.value, false);
};

onMounted(() => {
  getAllProvinces();
  getSelectedArea();
});
</script>

<template>
  <Form
    @submit="submitProvinces"
    :validation-schema="areaFormSchema"
    id="provincesFormData"
  >
    <div class="row">
      <div class="col-md-4 my-1" v-if="isLoading">
        <label for="province"
          >Tỉnh/ Thành phố <span class="text-danger">*</span></label
        >
        <Field
          name="province"
          class="form-control my-1"
          v-model="areaLocal.province"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="areaLocal.province"
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
          v-model="areaLocal.district"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="areaLocal.district"
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
          v-model="areaLocal.ward"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="areaLocal.ward"
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

    <div>
      <button type="submit" id="provincesFormDataBtn">Lưu</button>
    </div>
  </Form>
</template>
