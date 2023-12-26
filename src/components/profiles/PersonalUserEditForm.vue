<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, watch, reactive } from "vue";

import UseUserService from "@/services/useService/useUserService";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import { useAdministratorStore } from "@/stores/AdministratorStore";
import { useCustomerStore } from "@/stores/CustomerStore";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["submit:user"]);
const userLocal = ref(props.user);
const theOldUnique = reactive({
  phone: props.user ? props.user.phone : null,
  username: props.user ? props.user.username : null,
});
watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      userLocal.value = newVal;
      theOldUnique.phone = newVal.phone ? newVal.phone : null;
      theOldUnique.username = newVal.username ? newVal.username : null;
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

const isDuplicateUsername = async (username) => {
  const result = await UseUserService.isInvalidUniqueValue({
    username: username,
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

const userFormSchema = yup.object().shape({
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
  username: yup
    .string()
    .required("Chưa nhập tên đăng nhập")
    .min(8, "Tên đăng nhập phải có ít nhât 8 ký tự")
    .test("is-unique", "Tên đăng nhập đã được sử dụng", async (value) => {
      if (value != theOldUnique.username) {
        let result = await isDuplicateUsername(value);

        return !result;
      }
      return true;
    }),
});

const submitUser = () => {
  const submitData = {};
  submitData.id = userLocal.value.id;
  submitData.username = userLocal.value.username;
  submitData.phone = userLocal.value.phone;
  submitData.roles = userLocal.value.roles;
  emits("submit:user", submitData);
};
</script>

<template>
  <Form
    @submit="submitUser"
    :validation-schema="userFormSchema"
    class="space-y-4 pb-2"
  >
    <div class="row">
      <div class="col-md-6 my-1">
        <label class="" for="username"
          >Tên đăng nhập <span class="text-danger">*</span></label
        >
        <Field
          type="text"
          name="username"
          class="form-control my-1"
          v-model="userLocal.username"
          placeholder="Tên đăng nhập..."
        />
        <ErrorMessage name="username" class="animated fadeIn text-danger" />
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
