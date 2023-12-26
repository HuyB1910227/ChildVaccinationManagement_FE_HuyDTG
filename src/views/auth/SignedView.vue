<script setup>
import { useTemplateStore } from "@/stores/template";
import { useAuthStore } from "@/stores/AuthStore";
import router from "@/router";
const store = useTemplateStore();
const authStore = useAuthStore();
import Swal from "sweetalert2";

const logoutAccount = () => {
  Swal.fire({
    title: "Bạn chắc chắn muốn đăng xuất tài khoản?",
    icon: "warning",
    showCancelButton: true,
    customClass: {
      confirmButton: "btn btn-danger m-1",
      cancelButton: "btn btn-secondary m-1",
    },
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Thoát",
    preConfirm: () => {
      try {
        authStore.logout();
      } catch (error) {
        Swal.fire(
          "Không thể đăng xuất! Vui lòng liên hệ 0932988029 để được giải quyết.",
          "error"
        );
      }
    },
  });
};
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
              <h1 class="fw-bold mb-2">Quản lý tài khoản</h1>
              <p class="fw-medium text-muted mb-5">
                Quý khách đã đăng nhập tài khoản:
              </p>
              <img
                class="img-avatar img-avatar96"
                src="/assets/media/avatars/avatar10.jpg"
                alt=""
              />
              <p class="fw-semibold text-center my-2">
                {{ authStore.username }}
              </p>
            </div>
            <div class="text-center">
              <button
                type="submit"
                class="btn btn-lg btn-alt-primary"
                @click="router.go(-2)"
              >
                <i class="fa-solid fa-arrow-left"></i>
                Trở về
              </button>
              &nbsp;
              <button
                type="submit"
                class="btn btn-lg btn-alt-warning"
                @click="logoutAccount"
              >
                Đăng xuất
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
            <div class="text-center mt-3">
              hoặc <br />
              <RouterLink :to="{ name: 'dashboard' }" class="link-fx"
                >Trở về trang chủ</RouterLink
              >
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
