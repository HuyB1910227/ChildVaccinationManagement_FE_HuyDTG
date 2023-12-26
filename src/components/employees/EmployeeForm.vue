<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, watch, onMounted, computed } from "vue";
import ProvinceService from "@/services/province.service";
import RoleService from "@/services/role.service";
import VueSelect from "vue-select";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import UseUserService from "@/services/useService/useUserService";
import { useAuthStore } from "../../stores/AuthStore";
import Swal from "sweetalert2";
const authStore = useAuthStore();
const props = defineProps({
  employee: {
    type: Object,
    required: true,
  },
  immunizationUnitId: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: false,
  },
});

const employeeStore = useEmployeeStore();
const optionImmunizationUnit = ref(null);
const optionRoles = ref(null);
const immunizationUnitStore = useImmunizationUnitStore();
const translateRole = (roleName) => {
  if (roleName === "MANAGER") {
    return "Quản lý";
  } else if (roleName === "ADMINISTRATOR") {
    return "Quản trị viên";
  } else if (roleName === "CUSTOMER") {
    return "Khách hàng";
  } else if (roleName === "PHYSICIAN") {
    return "Bác sĩ";
  } else if (roleName === "STAFF") {
    return "Nhân viên y tế";
  }
};
const isAministrator = authStore.hasRole("ADMINISTRATOR");

const retriveOption = async () => {
  optionImmunizationUnit.value = await immunizationUnitStore.getFSelect();
  optionRoles.value = await RoleService.getAll();
  if (optionRoles.value) {
    optionRoles.value = optionRoles.value.filter(
      (role) => role.name !== "ADMINISTRATOR" && role.name !== "CUSTOMER"
    );
    if (authStore.hasRole("MANAGER")) {
      optionRoles.value = optionRoles.value.filter(
        (role) => role.name !== "MANAGER"
      );
    }

    optionRoles.value = optionRoles.value.map((role) => ({
      ...role,
      name: translateRole(role.name),
    }));
  }
};
const emits = defineEmits(["submit:employee"]);

const employeeLocal = ref(props.employee);

const checkPropsUpdate = () => {
  if (props.employee.id && props.immunizationUnitId && props.userId) {
    employeeLocal.value.immunizationUnitId = ref(props.immunizationUnitId);
    employeeLocal.value.userId = ref(props.userId);
  } else if (
    props.employee.id &&
    (!props.immunizationUnitId || !props.userId)
  ) {
    Swal.fire(
      "Lỗi!",
      "Không tìm thấy thông tin! Vui lòng thử lại sau",
      "error"
    );
  } else if (!props.employee.id && props.immunizationUnitId) {
    employeeLocal.value.immunizationUnitId = ref(props.immunizationUnitId);
  }
};

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
  if (props.employee.address != null) {
    let arr = props.employee.address.split(" ; ");
    if (arr.length - 1 >= 3) {
      address.value.province = arr[arr.length - 1];
      address.value.district = arr[arr.length - 2];
      address.value.ward = arr[arr.length - 3];
      employeeLocal.value.no = arr[arr.length - 4];
    } else {
      address.value.province = null;
      address.value.district = null;
      address.value.ward = null;
      employeeLocal.value.no = null;
    }
    console.log(address.value);
  }
};

const theOldUnique = reactive({
  phone: props.employee ? props.employee.phone : null,
  identityCard: props.employee ? props.employee.identityCard : null,
  email: props.employee ? props.employee.email : null,
});
const isDuplicatePhone = async (phone) => {
  const result = await employeeStore.isInvalidUniqueValue({
    phone: phone,
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

const isDuplicateIdentityCard = async (identityCard) => {
  const result = await employeeStore.isInvalidUniqueValue({
    identityCard: identityCard,
  });
  return result ? true : false;
};
const isDuplicateEmail = async (email) => {
  const result = await employeeStore.isInvalidUniqueValue({
    email: email,
  });
  return result ? true : false;
};

const employeeFormSchemaForCreate = yup.object().shape({
  fullName: yup
    .string()
    .required("Chưa nhập tên nhân viên")
    .min(5, "Tên nhân viên phải có ít nhất 5 ký tự")
    .max(100, "Tên nhân viên không được nhiều hơn 100 ký tự"),
  employeeId: yup
    .string()
    .required("Chưa nhập mã nhân viên")
    .min(5, "Mã nhân viên phải có ít nhất 5 ký tự")
    .max(100, "Mã nhân viên không được nhiều hơn 30 ký tự"),
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
  immunizationUnitId: yup.string().required("Chưa chọn cơ sở làm việc"),
  phone: yup
    .string()
    .required("Chưa nhập số điện thoại")
    .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ.")
    .test(
      "is-unique-phone",
      "Số điện thoại đã được đăn ký tài khoản",
      async (value) => {
        if (value != theOldUnique.phone) {
          let result = await isDuplicatePhone(value);
          if (!result) {
            result = await isDuplicateUserPhone(value);
          }
          return !result;
        }

        return true;
      }
    ),

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
  isEnable: yup.boolean().required("Chưa chọn trạng thái hoạt động"),
  dateOfBirth: yup
    .date()
    .max(
      new Date(Date.now() - 567648000000),
      "Nhân viên phải lớn hơn hoặc đủ 18 tuổi"
    )
    .required("Chưa chọn ngày sinh"),
  roles: yup
    .array()
    .required("Chưa chọn vai trò")
    .min(1, "Vui lòng chọn ít nhất một vai trò"),
  no: yup.string().required("Chưa nhập địa chỉ"),
  province: yup.object().required("Chưa chọn tỉnh/thành phố"),
  district: yup.object().required("Chưa chọn quận/huyện"),
  ward: yup.object().required("Chưa chọn phường/xã"),
});

const employeeFormSchemaForUpdate = yup.object().shape({
  fullName: yup
    .string()
    .required("Chưa nhập tên nhân viên")
    .min(5, "Tên nhân viên phải có ít nhất 5 ký tự")
    .max(100, "Tên nhân viên không được nhiều hơn 100 ký tự"),
  employeeId: yup
    .string()
    .required("Chưa nhập mã nhân viên")
    .min(5, "Mã nhân viên phải có ít nhất 5 ký tự")
    .max(100, "Mã nhân viên không được nhiều hơn 30 ký tự"),
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
  immunizationUnitId: yup.string().required("Chưa chọn cơ sở làm việc"),

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
});

const submitEmployee = () => {
  const submitData = {};
  if (employeeLocal.value.id == null || employeeLocal.value.id < 1) {
    submitData.employeeId = employeeLocal.value.employeeId;
    submitData.email = employeeLocal.value.email;
    submitData.immunizationUnitId = employeeLocal.value.immunizationUnitId;
    submitData.username = employeeLocal.value.username;
    submitData.phone = employeeLocal.value.phone;
    submitData.password = employeeLocal.value.identityCard;
    submitData.isEnable = employeeLocal.value.isEnable;
    submitData.fullName = employeeLocal.value.fullName;
    submitData.identityCard = employeeLocal.value.identityCard;
    submitData.gender = employeeLocal.value.gender;
    submitData.dateOfBirth = employeeLocal.value.dateOfBirth;
    submitData.address =
      employeeLocal.value.no +
      " ; " +
      employeeLocal.value.ward.name +
      " ; " +
      employeeLocal.value.district.name +
      " ; " +
      employeeLocal.value.province.name;
    submitData.roles = employeeLocal.value.roles;
    console.log(submitData);
    emits("submit:employee", submitData);
  } else {
    submitData.id = employeeLocal.value.id;

    submitData.user = { id: employeeLocal.value.userId };
    submitData.employeeId = employeeLocal.value.employeeId;
    submitData.email = employeeLocal.value.email;
    submitData.immunizationUnit = {
      id: employeeLocal.value.immunizationUnitId,
    };

    submitData.phone = employeeLocal.value.phone;

    submitData.fullName = employeeLocal.value.fullName;
    submitData.identityCard = employeeLocal.value.identityCard;
    submitData.gender = employeeLocal.value.gender;
    submitData.dateOfBirth = employeeLocal.value.dateOfBirth;
    submitData.address =
      employeeLocal.value.no +
      " ; " +
      employeeLocal.value.ward.name +
      " ; " +
      employeeLocal.value.district.name +
      " ; " +
      employeeLocal.value.province.name;

    emits("submit:employee", submitData);
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
    employeeLocal.value.province = selectedArea.value.province;
    if (selectedArea.value.province) {
      await getDistrictsFromProvinceCode(selectedArea.value.province.code);
      selectedArea.value.district = districts.value.find(
        (d) => d.name === address.value.district
      );
      employeeLocal.value.district = selectedArea.value.district;
      if (selectedArea.value.district) {
        await getWardsFromDistrictCode(selectedArea.value.district.code);
        selectedArea.value.ward = wards.value.find(
          (w) => w.name === address.value.ward
        );
        employeeLocal.value.ward = selectedArea.value.ward;
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
  () => employeeLocal.value.province,
  (newVal) => {
    if (newVal != null) {
      employeeLocal.value.district = null;
      employeeLocal.value.ward = null;
      districts.value = [];
      getDistrictsFromProvinceCode(newVal.code);
    } else {
      employeeLocal.value.district = null;
      employeeLocal.value.ward = null;
      districts.value = [];
    }
  }
);

watch(
  () => employeeLocal.value.district,
  (newVal) => {
    if (newVal != null) {
      employeeLocal.value.ward = null;
      wards.value = [];
      getWardsFromDistrictCode(newVal.code);
    } else {
      employeeLocal.value.ward = null;
      wards.value = [];
    }
  }
);

watch(
  () => employeeLocal.value.isEnable,
  () => {
    console.log(employeeLocal.value.isEnable);
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
  if (employeeLocal.value.fullName) {
    let processedString = removeDiacritics(employeeLocal.value.fullName);
    let words = processedString.split(" ");
    result = `${words[0]}_${words[words.length - 1]}_`;
  }
  return result + employeeLocal.value.phone;
});

watch(generateUsername, (newVal) => {
  employeeLocal.value.username = newVal;
});

onMounted(() => {
  getAllProvinces();
  getSelectedArea();
  getArrayAddress();
  retriveOption();
  checkPropsUpdate();
});

watch(
  () => props.employee,
  (newVal) => {
    if (newVal) {
      employeeLocal.value = newVal;
      theOldUnique.email = newVal.email ? newVal.email : null;
      theOldUnique.phone = newVal.phone ? newVal.phone : null;
      theOldUnique.identityCard = newVal.identityCard
        ? newVal.identityCard
        : null;

      checkPropsUpdate();
      console.log(employeeLocal);
      getAllProvinces();
      getSelectedArea();
      getArrayAddress();
      retriveOption();
    }
  }
);
</script>

<template>
  <Form
    @submit="submitEmployee"
    class="space-y-4"
    :validation-schema="
      employeeLocal.id == null
        ? employeeFormSchemaForCreate
        : employeeFormSchemaForUpdate
    "
  >
    <div class="row">
      <div
        class="col-md-12 my-1 text-primary fw-bold"
        :class="{ 'd-none': employeeLocal.id != null }"
      >
        Thông tin cá nhân
      </div>
      <div class="col-md-4 my-1">
        <label for="fullName"
          >Tên nhân viên <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="fullName"
          class="form-control my-1"
          v-model="employeeLocal.fullName"
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
          v-model="employeeLocal.identityCard"
          placeholder="Mã nhân viên..."
        />
        <ErrorMessage name="identityCard" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label for="employeeId"
          >Mã nhân viên <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="employeeId"
          class="form-control my-1"
          v-model="employeeLocal.employeeId"
          placeholder="Mã nhân viên..."
        />
        <ErrorMessage name="employeeId" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-4 my-1">
        <label for="phone"
          >Số điện thoại <span class="text-danger">*</span></label
        >
        <template v-if="employee.id == null">
          <Field
            type="text"
            name="phone"
            class="form-control my-1"
            v-model="employeeLocal.phone"
            placeholder="Số điện thoại..."
          />
          <ErrorMessage name="phone" class="animated fadeIn text-danger" />
        </template>
        <template v-else>
          <input
            type="text"
            disabled
            :value="employeeLocal.phone"
            class="form-control my-1"
          />
        </template>
      </div>

      <div class="col-md-4 my-1">
        <label for="email">Email <span class="text-danger">*</span></label>
        <Field
          type="text"
          name="email"
          class="form-control my-1"
          v-model="employeeLocal.email"
          placeholder="Email..."
        />
        <ErrorMessage name="email" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1" v-if="genderOption">
        <label class="" for="gender"
          >Giới tính<span class="text-danger"> *</span></label
        >
        <Field
          v-slot="{ value }"
          name="gender"
          as="select"
          class="form-select my-1"
          v-model="employeeLocal.gender"
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
          v-model="employeeLocal.no"
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
          v-model="employeeLocal.dateOfBirth"
          placeholder="Mã nhân viên..."
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
          v-model="employeeLocal.province"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="employeeLocal.province"
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
          v-model="employeeLocal.district"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="employeeLocal.district"
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
          v-model="employeeLocal.ward"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="employeeLocal.ward"
            :options="wards"
            placeholder="Chọn phường/xã.."
            label="name"
            class="my-1"
            name="ward"
          ></VueSelect>
        </Field>
        <ErrorMessage name="ward" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-4 my-1" v-if="optionImmunizationUnit">
        <label class="" for="immunizationUnitId"
          >Cơ sở <span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="immunizationUnitId"
          as="select"
          class="form-select"
          v-model="employeeLocal.immunizationUnitId"
          :disabled="!isAministrator"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in optionImmunizationUnit"
            :key="data"
            :value="data.id"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage
          name="immunizationUnitId"
          class="animated fadeIn text-danger"
        />
      </div>

      <div class="col-md-4 my-1" v-if="optionRoles && employeeLocal.id == null">
        <label for="roles">Vai trò <span class="text-danger">*</span></label>

        <Field
          name="roles"
          class="form-control my-1"
          v-model="employeeLocal.roles"
        >
          <VueSelect
            multiple
            v-model="employeeLocal.roles"
            :options="optionRoles"
            placeholder="Chọn vai trò.."
            class="my-1"
            label="name"
          >
            <template #option="option">
              {{ option.name }}
            </template>
          </VueSelect>
        </Field>
        <ErrorMessage name="roles" class="animated fadeIn text-danger" />
      </div>

      <div
        class="col-md-12 my-1 text-primary fw-bold"
        v-if="employeeLocal.id == null"
      >
        Thông tin tài khoản
      </div>
      <div class="col-md-4 my-1" v-if="employeeLocal.id == null">
        <label class=""
          >Số điện thoại đăng ký <span class="text-danger"></span
        ></label>
        <input
          type="text"
          class="form-control my-1"
          :value="employeeLocal.phone"
          placeholder="Số điện thoại"
          readonly
        />
      </div>
      <div class="col-md-4 my-1" v-if="employeeLocal.id == null">
        <label class="" for="identityCard"
          >Thiết lập tài khoản <span class="text-danger"></span
        ></label>
        <input
          type="text"
          name="identityCard"
          class="form-control my-1"
          :value="employeeLocal.username"
          placeholder="Tài khoản"
          readonly
        />
      </div>
      <div
        class="col-md-4 my-1"
        v-if="isEnableOption && employeeLocal.id == null"
      >
        <label class="" for="isEnable"
          >Trạng thái tài khoản<span class="text-danger"> *</span></label
        >
        <Field
          v-slot="{ value }"
          name="isEnable"
          as="select"
          class="form-select my-1"
          v-model="employeeLocal.isEnable"
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
        <button
          type="submit"
          @click="console.log(employeeLocal.gender)"
          class="btn btn-primary mx-1"
        >
          Lưu
        </button>
        <button
          v-if="!employee.id"
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
