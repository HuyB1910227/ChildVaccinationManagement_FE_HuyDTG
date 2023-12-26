<script setup>
import { ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import UseUserService from "@/services/useService/useUserService";
const isError = ref(false);
const passLocal = ref({});
const emit = defineEmits("logoutRequest");
const submitPassword = async () => {
  try {
    const res = await UseUserService.changePassword({
      oldPassword: passLocal.value.oldPass,
      newPassword: passLocal.value.pass1,
    });
    if (res) {
      emit("logoutRequest");
    } else {
      isError.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};

const passwordValidationSchema = yup.object().shape({
  oldPass: yup
    .string()
    .required("Chưa nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  pass1: yup
    .string()
    .required("Chưa nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  pass2: yup
    .string()
    .required("Chưa nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .test("password-match", "Mật khẩu không khớp", function (value) {
      return value === this.parent.pass1;
    }),
});
</script>
<template>
  <div class="row">
    <div class="col-lg-12 space-y-5">
      <Form
        @submit="submitPassword"
        :validation-schema="passwordValidationSchema"
        class="pb-2"
      >
        <div class="row">
          <div class="col-md-12 my-1">
            <label class="" for="oldPass"
              >Mật khẩu cũ <span class="text-danger">*</span></label
            >
            <Field
              type="password"
              name="oldPass"
              class="form-control my-1"
              v-model="passLocal.oldPass"
              placeholder="Nhập mật khẩu hiện tại..."
            />
            <ErrorMessage name="oldPass" class="animated fadeIn text-danger" />
          </div>
          <div class="col-md-12 my-1">
            <label class="" for="pass1"
              >Mật khẩu mới <span class="text-danger">*</span></label
            >
            <Field
              type="password"
              name="pass1"
              class="form-control my-1"
              v-model="passLocal.pass1"
              placeholder="Nhập mật khẩu mới..."
            />
            <ErrorMessage name="pass1" class="animated fadeIn text-danger" />
          </div>
          <div class="col-md-12 my-1">
            <label class="" for="pass2"
              >Mật khẩu lại mật khẩu mới
              <span class="text-danger">*</span></label
            >
            <Field
              type="password"
              name="pass2"
              class="form-control my-1"
              v-model="passLocal.pass2"
              placeholder="Nhập lại mật khẩu mới..."
            />
            <ErrorMessage name="pass2" class="animated fadeIn text-danger" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div
              class="alert alert-danger d-flex align-items-center"
              role="alert"
              v-if="isError"
            >
              <div class="flex-shrink-0">
                <i class="fa-solid fa-check"></i>
              </div>
              <div class="flex-grow-1 ms-3">
                <p class="mb-0 fw-bold">
                  Cập nhật thất bại! Vui lòng kiểm tra lại mật khẩu cũ.
                </p>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mx-1">Lưu</button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>
