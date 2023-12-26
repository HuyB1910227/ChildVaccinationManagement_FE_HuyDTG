<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted } from "vue";
import ProvinceService from "@/services/province.service";
import VueSelect from "vue-select";
import { useAdministratorStore } from "@/stores/AdministratorStore";
import { useEmployeeStore } from "@/stores/EmployeeStore";
const props = defineProps({
  profileUser: {
    type: Object,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

const isAdmin = ref(props.isAdmin);
const administratorStore = useAdministratorStore();
const employeeStore = useEmployeeStore();
const emits = defineEmits(["submit:profileUser"]);
const profileUserLocal = ref(props.profileUser);
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
  if (props.profileUser.address != null) {
    let arr = props.profileUser.address.split(" ; ");
    if (arr.length - 1 >= 3) {
      address.value.province = arr[arr.length - 1];
      address.value.district = arr[arr.length - 2];
      address.value.ward = arr[arr.length - 3];
      profileUserLocal.value.no = arr[arr.length - 4];
    } else {
      address.value.province = null;
      address.value.district = null;
      address.value.ward = null;
      profileUserLocal.value.no = null;
    }
    console.log(address.value);
  }
};

const theOldUnique = reactive({
  identityCard: props.profileUser ? props.profileUser.identityCard : null,
  email: props.profileUser ? props.profileUser.email : null,
});

watch(
  () => props.profileUser,
  (newVal) => {
    if (newVal) {
      profileUserLocal.value = newVal;
      theOldUnique.identityCard = newVal.identityCard;
      theOldUnique.email = newVal.email;
      getAllProvinces();
      getSelectedArea();
      getArrayAddress();
    }
  }
);

const isDuplicateIdentityCard = async (identityCard) => {
  if (isAdmin.value == true) {
    const result = await administratorStore.isInvalidUniqueValue({
      identityCard: identityCard,
    });
    return result ? true : false;
  }
  const result = await employeeStore.isInvalidUniqueValue({
    identityCard: identityCard,
  });
  return result ? true : false;
};
const isDuplicateEmail = async (email) => {
  if (isAdmin.value == true) {
    const result = await administratorStore.isInvalidUniqueValue({
      email: email,
    });
    return result ? true : false;
  }
  const result = await employeeStore.isInvalidUniqueValue({
    email: email,
  });
  return result ? true : false;
};

const profileUserProfileFormSchemaForUpdate = yup.object().shape({
  fullName: yup
    .string()
    .required("Chưa nhập tên nhân viên")
    .min(5, "Tên nhân viên phải có ít nhất 5 ký tự")
    .max(100, "Tên nhân viên không được nhiều hơn 100 ký tự"),
  email: yup
    .string()
    .required("Chưa nhập địa chỉ email.")
    .email("E-mail không đúng.")
    .max(50, "email chỉ chứa tối đa 50 ký tự.")
    .test("is-unique-email", "Email đã được đăng ký", async (value) => {
      if (value != theOldUnique.email) {
        const result = await isDuplicateEmail(value);
        return !result;
      }
      return true;
    }),
  identityCard: yup
    .string()
    .required("Chưa nhập cmnd/cccd")
    .matches(/^\d{9}$|^\d{12}$/, "Số cmnd/cccd phải có 9 hoặc 12")
    .matches(/^[0-9]+$/, "Số cmnd/cccd không hợp lệ")
    .test(
      "is-unique-identity-card",
      "Mã số CMND/CCCD đã được sử dụng",
      async (value) => {
        if (value != theOldUnique.identityCard) {
          const result = await isDuplicateIdentityCard(value);
          return !result;
        }
        return true;
      }
    ),
  gender: yup.number().required("Chưa chọn giới tính"),
  dateOfBirth: yup
    .date()
    .max(
      new Date(Date.now() - 567648000000),
      "Nhân viên phải lớn hơn hoặc đủ 18 tuổi"
    )
    .required("Chưa chọn ngày sinh"),
  no: yup.string().required("Chưa nhập địa chỉ"),
  province: yup.object().required("Chưa chọn tỉnh/thành phố"),
  district: yup.object().required("Chưa chọn quận/huyện"),
  ward: yup.object().required("Chưa chọn phường/xã"),
  career: yup.string(),
});

const submitProfileUser = () => {
  console.log(profileUserLocal.value);
  const submitData = {};
  if (profileUserLocal.value.id == null || profileUserLocal.value.id < 1) {
    console.log("NOT FOUND EMPLOYEE");
  } else {
    submitData.id = profileUserLocal.value.id;
    submitData.email = profileUserLocal.value.email;
    submitData.fullName = profileUserLocal.value.fullName;
    submitData.identityCard = profileUserLocal.value.identityCard;
    submitData.gender = profileUserLocal.value.gender;
    submitData.dateOfBirth = profileUserLocal.value.dateOfBirth;
    submitData.address =
      profileUserLocal.value.no +
      " ; " +
      profileUserLocal.value.ward.name +
      " ; " +
      profileUserLocal.value.district.name +
      " ; " +
      profileUserLocal.value.province.name;
    emits("submit:profileUser", submitData);
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
    profileUserLocal.value.province = selectedArea.value.province;
    if (selectedArea.value.province) {
      await getDistrictsFromProvinceCode(selectedArea.value.province.code);
      selectedArea.value.district = districts.value.find(
        (d) => d.name === address.value.district
      );
      profileUserLocal.value.district = selectedArea.value.district;
      if (selectedArea.value.district) {
        await getWardsFromDistrictCode(selectedArea.value.district.code);
        selectedArea.value.ward = wards.value.find(
          (w) => w.name === address.value.ward
        );
        profileUserLocal.value.ward = selectedArea.value.ward;
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
  () => profileUserLocal.value.province,
  (newVal) => {
    if (newVal != null) {
      profileUserLocal.value.district = null;
      profileUserLocal.value.ward = null;
      districts.value = [];
      getDistrictsFromProvinceCode(newVal.code);
    } else {
      profileUserLocal.value.district = null;
      profileUserLocal.value.ward = null;
      districts.value = [];
    }
  }
);

watch(
  () => profileUserLocal.value.district,
  (newVal) => {
    if (newVal != null) {
      profileUserLocal.value.ward = null;
      wards.value = [];
      getWardsFromDistrictCode(newVal.code);
    } else {
      profileUserLocal.value.ward = null;
      wards.value = [];
    }
  }
);

watch(
  () => profileUserLocal.value.isEnable,
  () => {
    console.log(profileUserLocal.value.isEnable);
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
    @submit="submitProfileUser"
    class="space-y-4"
    :validation-schema="profileUserProfileFormSchemaForUpdate"
  >
    <div class="row">
      <div class="col-md-4 my-1">
        <label for="fullName"
          >Tên nhân viên <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="fullName"
          class="form-control my-1"
          v-model="profileUserLocal.fullName"
          placeholder="Tên nhân viên..."
        />
        <ErrorMessage name="fullName" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label for="identityCard"
          >CCCD/CMND <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="identityCard"
          class="form-control my-1"
          v-model="profileUserLocal.identityCard"
          placeholder="Mã nhân viên..."
        />
        <ErrorMessage name="identityCard" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1">
        <label for="email">Email <span class="text-danger">*</span></label>
        <Field
          type="text"
          name="email"
          class="form-control my-1"
          v-model="profileUserLocal.email"
          placeholder="Email..."
        />
        <ErrorMessage name="email" class="animated fadeIn text-danger" />
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
          v-model="profileUserLocal.gender"
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
          v-model="profileUserLocal.dateOfBirth"
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
          v-model="profileUserLocal.no"
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
          v-model="profileUserLocal.province"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="profileUserLocal.province"
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
          v-model="profileUserLocal.district"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="profileUserLocal.district"
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
          v-model="profileUserLocal.ward"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="profileUserLocal.ward"
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
          v-if="!profileUser.id"
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
