<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, watch, reactive, onMounted } from "vue";
import VueSelect from "vue-select";
import UseUserService from "@/services/useService/useUserService";
import RoleService from "../../services/role.service";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import { useAdministratorStore } from "@/stores/AdministratorStore";
import { useCustomerStore } from "@/stores/CustomerStore";
import { useAuthStore } from "../../stores/AuthStore";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  isEmployee: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(["submit:user"]);
const authStore = useAuthStore();
const userLocal = ref(props.user);

const theOldUnique = reactive({
  phone: props.user ? props.user.phone : null,
});
watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      userLocal.value = newVal;
      theOldUnique.phone = newVal.phone ? newVal.phone : null;
    }
  }
);

const administratorStore = useAdministratorStore();
const employeeStore = useEmployeeStore();
const customerStore = useCustomerStore();

const isDuplicateUserPhone = async (phone) => {
  const result = await UseUserService.isInvalidUniqueValue({
    phone: phone,
  });
  return result ? true : false;
};

const isDuplicateEmployeePhone = async (phone) => {
  const result = await employeeStore.isInvalidUniqueValue({
    phone: phone,
  });
  return result ? true : false;
};

const isDuplicateAdministratorPhone = async (phone) => {
  const result = await administratorStore.isInvalidUniqueValue({
    phone: phone,
  });
  return result ? true : false;
};

const isDuplicateCustomerPhone = async (phone) => {
  const result = await customerStore.isInvalidUniqueValue({
    phone: phone,
  });
  return result ? true : false;
};

const userEmployeeFormSchema = yup.object().shape({
  phone: yup
    .string()
    .required("Chưa nhập số điện thoại")
    .matches(/(([0-9]{10})\b)/g, "Số điện thoại không hợp lệ.")
    .test("is-unique", "Số điện thoại đã được sử dụng", async (value) => {
      if (value != theOldUnique.phone) {
        let result = await isDuplicateUserPhone(value);
        if (!result) {
          result = await isDuplicateAdministratorPhone(value);
        }
        if (!result) {
          result = await isDuplicateEmployeePhone(value);
        }
        if (!result) {
          result = await isDuplicateCustomerPhone(value);
        }
        return !result;
      }
      return true;
    }),
  roles: yup
    .array()
    .required("Chưa chọn vai trò")
    .min(1, "Vui lòng chọn ít nhất một vai trò"),
});
const userCustomerFormSchema = yup.object().shape({
  phone: yup
    .string()
    .required("Chưa nhập số điện thoại")
    .matches(/(([0-9]{10})\b)/g, "Số điện thoại không hợp lệ.")
    .test("is-unique", "Số điện thoại đã được sử dụng", async (value) => {
      if (value != theOldUnique.phone) {
        let result = await isDuplicateUserPhone(value);
        if (!result) {
          result = await isDuplicateAdministratorPhone(value);
        }
        if (!result) {
          result = await isDuplicateEmployeePhone(value);
        }
        if (!result) {
          result = await isDuplicateCustomerPhone(value);
        }
        return !result;
      }
      return true;
    }),
});
const optionRoles = ref(null);
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
const retriveOption = async () => {
  let roles = await RoleService.getAll();
  if (roles) {
    roles = roles.filter(
      (role) => role.name !== "ADMINISTRATOR" && role.name !== "CUSTOMER"
    );
    if (authStore.hasRole("MANAGER")) {
      roles = roles.filter((role) => role.name !== "MANAGER");
    }
    optionRoles.value = roles.map((role) => ({
      ...role,
      name: translateRole(role.name),
    }));
    console.log(optionRoles.value);
  }
};

const submitUser = () => {
  const submitData = {};
  submitData.id = userLocal.value.id;
  submitData.phone = userLocal.value.phone;
  submitData.isEnable = userLocal.value.isEnable;
  submitData.roles = userLocal.value.roles;
  emits("submit:user", submitData);
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

onMounted(() => {
  retriveOption();
});
</script>

<template>
  <Form
    @submit="submitUser"
    :validation-schema="
      isEmployee ? userEmployeeFormSchema : userCustomerFormSchema
    "
    class="space-y-4 pb-2"
  >
    <div class="row">
      <div class="col-md-6 my-1">
        <label class="">Tên đăng nhập </label>
        <input
          type="text"
          disabled
          :value="userLocal.username"
          class="form-control my-1"
        />
      </div>

      <div class="col-md-6 my-1">
        <label class="" for="phone"
          >Số điện thoại đăng ký tài khoản
          <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="phone"
          class="form-control my-1"
          v-model="userLocal.phone"
          placeholder="Số điện thoại..."
        />
        <ErrorMessage name="phone" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1" v-if="isEnableOption">
        <label class="" for="isEnable"
          >Trạng thái tài khoản<span class="text-danger"> *</span></label
        >
        <Field
          v-slot="{ value }"
          name="isEnable"
          as="select"
          class="form-select my-1"
          v-model="userLocal.isEnable"
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
      <div class="col-md-6 my-1" v-if="optionRoles && isEmployee">
        <label for="roles">Vai trò <span class="text-danger">*</span></label>

        <Field name="roles" class="form-control my-1" v-model="userLocal.roles">
          <VueSelect
            multiple
            v-model="userLocal.roles"
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
    </div>

    <div class="row">
      <div class="col-sm-8">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
      </div>
    </div>
  </Form>
</template>
<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
