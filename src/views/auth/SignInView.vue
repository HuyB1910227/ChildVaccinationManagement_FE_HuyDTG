<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import Cookies from "js-cookie";

import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useAuthStore } from "../../stores/AuthStore";
import UserService from "../../services/user.service";
import { helpers } from "@vuelidate/validators";
const store = useTemplateStore();
const authStore = useAuthStore();
const router = useRouter();

const state = reactive({
  username: null,
  password: null,
});

const messageAuthError = ref(null);

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage("Chưa nhập tên đăng nhập", required),
      minLength: helpers.withMessage(
        "Tên đặng nhập phải có ít nhất 8 ký tự",
        minLength(8)
      ),
    },
    password: {
      required: helpers.withMessage("Chưa nhập mật khẩu", required),
      minLength: helpers.withMessage(
        "Mật khẩu phải có ít nhất 8 ký tự",
        minLength(8)
      ),
    },
  };
});

const v$ = useVuelidate(rules, state);

async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  }

  try {
    var loginResult = await UserService.login(state);
    console.log(state);
    console.log(loginResult);
    if (loginResult.accessToken != null) {
      const accessToken = loginResult.accessToken;
      const refreshToken = loginResult.refreshToken;
      const id = loginResult.id;
      const username = loginResult.username;
      const phone = loginResult.phone;
      const immunizationUnitId = loginResult.immunizationUnitId;
      const roles = loginResult.roles;
      Cookies.set("token", accessToken);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("id", id);
      Cookies.set("username", username);
      Cookies.set("phone", phone);
      Cookies.set("immunizationUnitId", immunizationUnitId);
      Cookies.set("roles", JSON.stringify(roles));
      authStore.accessToken = accessToken;
      authStore.refreshToken = refreshToken;
      authStore.id = id;
      authStore.username = username;
      authStore.phone = phone;
      authStore.immunizationUnitId = immunizationUnitId;
      authStore.roles = roles;
      authStore.isAuth = true;
    } else messageAuthError.value = "Đăng nhập thất bại";
  } catch (errors) {
    console.log(errors);
    messageAuthError.value = "Tên đăng nhập hoặc mật khẩu không chính xác!";
  }

  console.log(Cookies.get());
  router.push({ name: "dashboard" });
}

onMounted(() => {
  if (authStore.accessToken != null) {
    router.push({ name: "auth-signed" });
  }
});
</script>

<template>
  <BaseBackground
    image="/assets/media/photos/home-care-after-vaccinations-2.jpg"
  >
    <div class="row g-0 bg-primary-dark-op">
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <RouterLink
              :to="{ name: 'landing' }"
              class="link-fx fw-semibold fs-2 text-white"
            >
              Angelo
            </RouterLink>
            <p class="text-white-75 me-xl-8 mt-2">
              Angelo Immunization clinics for children / Hệ thống quản lý tiêm
              chủng cho trẻ em
            </p>
          </div>
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
          <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline mb-0 py-2">
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-extra-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
          <RouterLink
            :to="{ name: 'landing' }"
            class="link-fx fw-semibold fs-3 text-dark"
          >
            Angelo
          </RouterLink>
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <div class="text-center mb-5">
              <p class="mb-3"></p>
              <h1 class="fw-bold mb-2">Đăng nhập</h1>
              <p class="fw-medium text-muted">
                Xin chào, vui lòng đăng nhập tài khoản.
              </p>
              <p class="fw-medium text-muted">
                Mọi thắc mắc về tài khoản vui lòng liên hệ:
                <a href="tel:0932088029"
                  ><span class="si si-phone"></span> 0932988029</a
                >
              </p>
            </div>
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="text"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="login-username"
                      name="login-username"
                      placeholder="Tên đăng nhập"
                      :class="{
                        'is-invalid':
                          v$.username.$errors.length ||
                          messageAuthError != null,
                      }"
                      v-model="state.username"
                      @blur="v$.username.$touch"
                      @keypress="messageAuthError = null"
                    />
                    <div
                      v-if="v$.username.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      <div
                        class="input-errors"
                        v-for="error of v$.username.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="login-password"
                      name="login-password"
                      placeholder="Mật khẩu"
                      :class="{
                        'is-invalid':
                          v$.password.$errors.length ||
                          messageAuthError != null,
                      }"
                      v-model="state.password"
                      @blur="v$.password.$touch"
                      @keypress="messageAuthError = null"
                    />

                    <div
                      v-if="v$.password.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      <div
                        class="input-errors"
                        v-for="error of v$.password.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </div>
                    <div
                      v-if="messageAuthError"
                      class="invalid-feedback animated fadeIn"
                    >
                      <div class="input-errors">
                        <div class="error-msg">{{ messageAuthError }}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >
                    <div>Quên mật khẩu?</div>
                    <div>
                      <button type="submit" class="btn btn-lg btn-alt-primary">
                        <i class="fa fa-fw fa-sign-in-alt me-1 opacity-50"></i>
                        Đăng nhập
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium text-black-50 py-2 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline py-2 mb-0">
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </BaseBackground>
</template>
