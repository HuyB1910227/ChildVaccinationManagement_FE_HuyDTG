<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted, computed } from "vue";
import ProvinceService from "@/services/province.service";
import RoleService from "@/services/role.service";
import VueSelect from "vue-select";
import UseUserService from "@/services/useService/useUserService";
import { useCustomerStore } from "@/stores/CustomerStore";
const props = defineProps({
  customer: {
    type: Object,
    required: true,
  },
});

const optionRole = ref(null);
const customerStore = useCustomerStore();

const theOldUnique = reactive({
  phone: props.customer ? props.customer.phone : null,
  identityCard: props.customer ? props.customer.identityCard : null,
  email: props.customer ? props.customer.email : null,
});
const isDuplicatePhone = async (phone) => {
  const result = await customerStore.isInvalidUniqueValue({
    phone: phone,
  });
  return result ? true : false;
};
const isDuplicateIdentityCard = async (identityCard) => {
  const result = await customerStore.isInvalidUniqueValue({
    identityCard: identityCard,
  });
  return result ? true : false;
};
const isDuplicateEmail = async (email) => {
  const result = await customerStore.isInvalidUniqueValue({
    email: email,
  });
  return result ? true : false;
};

const isDuplicateUserPhone = async (phone) => {
  const result = await UseUserService.isInvalidUniqueValue({
    phone: phone,
  });
  return result ? true : false;
};

const isDuplicateUserName = async (username) => {
  const result = await UseUserService.isInvalidUniqueValue({
    username: username,
  });
  return result ? true : false;
};

const emits = defineEmits(["submit:customer"]);
const retriveOption = async () => {
  optionRole.value = await RoleService.getAll();
  if (optionRole.value) {
    optionRole.value = optionRole.value.filter(
      (role) => role.name === "CUSTOMER"
    );
  }
};
const customerLocal = ref(props.customer);

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
  if (props.customer.address != null) {
    let arr = props.customer.address.split(" ; ");
    if (arr.length - 1 >= 3) {
      address.value.province = arr[arr.length - 1];
      address.value.district = arr[arr.length - 2];
      address.value.ward = arr[arr.length - 3];
      customerLocal.value.no = arr[arr.length - 4];
    } else {
      address.value.province = null;
      address.value.district = null;
      address.value.ward = null;
      customerLocal.value.no = null;
    }
  }
};

const customerFormSchemaForCreate = yup.object().shape({
  fullName: yup
    .string()
    .required("Chưa nhập tên khách hàng")
    .min(5, "Tên khách hàng phải có ít nhất 5 ký tự")
    .max(100, "Tên khách hàng không được nhiều hơn 100 ký tự"),

  career: yup.string(),
  email: yup
    .string()
    .email("E-mail không đúng.")
    .max(50, "email chỉ chứa tối đa 50 ký tự.")
    .test("is-unique-email", "Email đã được đăng ký", async (value) => {
      if (value == "" || value == null || value == undefined) {
        return true;
      }
      if (value != theOldUnique.email) {
        const result = await isDuplicateEmail(value);
        return !result;
      }

      return true;
    }),

  phone: yup
    .string()
    .required("Chưa nhập số điện thoại")
    .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ.")
    .test("is-unique-phone", "Số điện thoại đã được đăng ký", async (value) => {
      if (value != theOldUnique.phone) {
        let result = await isDuplicatePhone(value);
        if (!result) {
          result = await isDuplicateUserPhone(value);
        }
        return !result;
      }
      return true;
    }),
  isEnable: yup.boolean().required("Chưa chọn trạng thái hoạt động"),
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
      "Khách hàng phải lớn hơn hoặc đủ 18 tuổi"
    )
    .required("Chưa chọn ngày sinh"),
  no: yup.string().required("Chưa nhập địa chỉ"),
  province: yup.object().required("Chưa chọn tỉnh/thành phố"),
  district: yup.object().required("Chưa chọn quận/huyện"),
  ward: yup.object().required("Chưa chọn phường/xã"),
});

const customerFormSchemaForUpdate = yup.object().shape({
  fullName: yup
    .string()
    .required("Chưa nhập tên khách hàng")
    .min(5, "Tên khách hàng phải có ít nhất 5 ký tự")
    .max(100, "Tên khách hàng không được nhiều hơn 100 ký tự"),

  career: yup.string(),
  email: yup
    .string()
    .email("E-mail không đúng.")
    .max(50, "email chỉ chứa tối đa 50 ký tự.")
    .test("is-unique-email", "Email đã được đăng ký", async (value) => {
      if (value == "" || value == null || value == undefined) {
        return true;
      }
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
      "Khách hàng phải lớn hơn hoặc đủ 18 tuổi"
    )
    .required("Chưa chọn ngày sinh"),
  no: yup.string().required("Chưa nhập địa chỉ"),
  province: yup.object().required("Chưa chọn tỉnh/thành phố"),
  district: yup.object().required("Chưa chọn quận/huyện"),
  ward: yup.object().required("Chưa chọn phường/xã"),
});

const submitCustomer = () => {
  console.log(customerLocal.value);
  const submitData = {};
  if (customerLocal.value.id == null || customerLocal.value.id < 1) {
    submitData.customerId = customerLocal.value.customerId;
    submitData.email = customerLocal.value.email
      ? customerLocal.value.email
      : null;
    submitData.username = customerLocal.value.username;
    submitData.phone = customerLocal.value.phone;
    submitData.password = customerLocal.value.identityCard;
    submitData.isEnable = customerLocal.value.isEnable;
    submitData.fullName = customerLocal.value.fullName;
    submitData.identityCard = customerLocal.value.identityCard;
    submitData.gender = customerLocal.value.gender;
    submitData.dateOfBirth = customerLocal.value.dateOfBirth;
    submitData.address =
      customerLocal.value.no +
      " ; " +
      customerLocal.value.ward.name +
      " ; " +
      customerLocal.value.district.name +
      " ; " +
      customerLocal.value.province.name;
    submitData.roles = optionRole.value;
    submitData.career = customerLocal.value.career;
    emits("submit:customer", submitData);
  } else {
    submitData.id = customerLocal.value.id;

    submitData.email = customerLocal.value.email
      ? customerLocal.value.email
      : null;

    submitData.fullName = customerLocal.value.fullName;
    submitData.identityCard = customerLocal.value.identityCard;
    submitData.gender = customerLocal.value.gender;
    submitData.dateOfBirth = customerLocal.value.dateOfBirth;
    submitData.address =
      customerLocal.value.no +
      " ; " +
      customerLocal.value.ward.name +
      " ; " +
      customerLocal.value.district.name +
      " ; " +
      customerLocal.value.province.name;
    submitData.career = customerLocal.value.career;
    emits("submit:customer", submitData);
  }
};

const isEnableOption = reactive([
  {
    name: "Hoạt động",
    value: true,
  },
  {
    name: "Không hoạt động",
    value: false,
  },
]);

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
    customerLocal.value.province = selectedArea.value.province;
    if (selectedArea.value.province) {
      await getDistrictsFromProvinceCode(selectedArea.value.province.code);
      selectedArea.value.district = districts.value.find(
        (d) => d.name === address.value.district
      );
      customerLocal.value.district = selectedArea.value.district;
      if (selectedArea.value.district) {
        await getWardsFromDistrictCode(selectedArea.value.district.code);
        selectedArea.value.ward = wards.value.find(
          (w) => w.name === address.value.ward
        );
        customerLocal.value.ward = selectedArea.value.ward;
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
  () => customerLocal.value.province,
  (newVal) => {
    if (newVal != null) {
      customerLocal.value.district = null;
      customerLocal.value.ward = null;
      districts.value = [];
      getDistrictsFromProvinceCode(newVal.code);
    } else {
      customerLocal.value.district = null;
      customerLocal.value.ward = null;
      districts.value = [];
    }
  }
);

watch(
  () => customerLocal.value.district,
  (newVal) => {
    if (newVal != null) {
      customerLocal.value.ward = null;
      wards.value = [];
      getWardsFromDistrictCode(newVal.code);
    } else {
      customerLocal.value.ward = null;
      wards.value = [];
    }
  }
);

const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const generateUsername = computed(() => {
  let result = "";
  if (customerLocal.value.fullName) {
    let processedString = removeDiacritics(customerLocal.value.fullName);
    let words = processedString.split(" ");
    result = `${words[0]}_${words[words.length - 1]}_`;
  }
  return result + customerLocal.value.phone;
});

watch(generateUsername, (newVal) => {
  customerLocal.value.username = newVal;
});

onMounted(() => {
  getAllProvinces();
  getSelectedArea();
  getArrayAddress();
  retriveOption();
});
</script>

<template>
  <Form
    @submit="submitCustomer"
    class="space-y-4"
    :validation-schema="
      customerLocal.id == null
        ? customerFormSchemaForCreate
        : customerFormSchemaForUpdate
    "
  >
    <div class="row">
      <div
        class="col-md-12 my-1 text-primary fw-bold"
        :class="{ 'd-none': customerLocal.id != null }"
      >
        Thông tin cá nhân
      </div>
      <div class="col-md-4 my-1">
        <label for="fullName"
          >Họ và tên <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="fullName"
          class="form-control my-1"
          v-model="customerLocal.fullName"
          placeholder="Họ tên khách hàng..."
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
          v-model="customerLocal.identityCard"
          placeholder="Mã CMND/CCCD..."
        />
        <ErrorMessage name="identityCard" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1">
        <label for="phone"
          >Số điện thoại <span class="text-danger">*</span></label
        >
        <template v-if="customer.id == null">
          <Field
            type="text"
            name="phone"
            class="form-control my-1"
            v-model="customerLocal.phone"
            placeholder="Số điện thoại..."
          />
          <ErrorMessage name="phone" class="animated fadeIn text-danger" />
        </template>
        <template v-else>
          <input
            type="text"
            disabled
            :value="customerLocal.phone"
            class="form-control my-1"
          />
        </template>
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
          v-model="customerLocal.gender"
        >
          <option value="" disabled>--Chọn--</option>
          <option v-for="data in genderOption" :key="data" :value="data.value">
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="gender" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1">
        <label class="" for="no"
          >Địa chỉ <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="no"
          class="form-control my-1"
          v-model="customerLocal.no"
          placeholder="Địa chỉ"
        />
        <ErrorMessage name="no" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1">
        <label class="" for="dateOfBirth"
          >Ngày sinh <span class="text-danger">*</span></label
        >

        <Field
          type="date"
          name="dateOfBirth"
          class="form-control my-1"
          v-model="customerLocal.dateOfBirth"
          placeholder="Mã CMND/CCCD..."
        />
        <ErrorMessage name="dateOfBirth" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1" v-if="isLoading">
        <label for="province"
          >Tỉnh/ Thành phố <span class="text-danger">*</span></label
        >
        <Field
          name="province"
          class="form-control"
          v-model="customerLocal.province"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="customerLocal.province"
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
          v-model="customerLocal.district"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="customerLocal.district"
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
          v-model="customerLocal.ward"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="customerLocal.ward"
            :options="wards"
            placeholder="Chọn phường/xã.."
            label="name"
            class="my-1"
            name="ward"
          ></VueSelect>
        </Field>
        <ErrorMessage name="ward" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label for="email">Email <span class="text-danger"></span></label>
        <Field
          type="text"
          name="email"
          class="form-control my-1"
          v-model="customerLocal.email"
          placeholder="Email..."
        />
        <ErrorMessage name="email" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label class="" for="career"
          >Nghề nghiệp<span class="text-danger"></span
        ></label>
        <Field
          type="text"
          name="career"
          class="form-control my-1"
          v-model="customerLocal.career"
          placeholder="Nghề nghiệp"
        />
        <ErrorMessage name="career" class="animated fadeIn text-danger" />
      </div>
      <div
        class="col-md-12 my-1 text-primary fw-bold"
        v-if="customerLocal.id == null"
      >
        Thông tin tài khoản
      </div>
      <div class="col-md-4 my-1" v-if="customerLocal.id == null">
        <label class=""
          >Số điện thoại đăng ký <span class="text-danger"></span
        ></label>
        <input
          type="text"
          class="form-control my-1"
          :value="customerLocal.phone"
          placeholder="Số điện thoại"
          readonly
        />
      </div>
      <div class="col-md-4 my-1" v-if="customerLocal.id == null">
        <label class="" for="identityCard"
          >Thiết lập tài khoản <span class="text-danger"></span
        ></label>
        <input
          type="text"
          name="identityCard"
          class="form-control my-1"
          :value="customerLocal.username"
          placeholder="Tài khoản"
          readonly
        />
      </div>
      <div
        class="col-md-4 my-1"
        v-if="isEnableOption && customerLocal.id == null"
      >
        <label class="" for="isEnable"
          >Trạng thái tài khoản<span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="isEnable"
          as="select"
          class="form-select my-1"
          v-model="customerLocal.isEnable"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in isEnableOption"
            :key="data"
            :value="data.value"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="isEnable" class="animated fadeIn text-danger" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!customer.id"
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
