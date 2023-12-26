<script setup>
import { useTemplateStore } from "@/stores/template";
import { useAuthStore } from "@/stores/AuthStore";
const authStore = useAuthStore();
const store = useTemplateStore();
</script>

<template>
  <BaseBackground
    image="/assets/media/photos/home-care-after-vaccinations-2.jpg"
  >
    <div class="hero-static d-flex align-items-center">
      <div class="w-100">
        <div class="bg-body-ex-light">
          <div class="content content-full">
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-8 col-xl-6 py-6">
                <div class="text-center">
                  <button class="bg-white btn p-3 my-3 border border-primary">
                    <i class="fa-solid fa-crutch text-primary fs-1"></i>
                  </button>
                  <h1 class="h3 mb-1 text-primary fw-bold">
                    TRANG QUẢN LÝ DÀNH CHO CÁC CÁN BỘ THUỘC TỔ CHỨC TIÊM CHỦNG
                  </h1>
                  <h2 class="h6 fw-normal text-muted mb-3">-- oo0oo --</h2>
                </div>
                <div v-if="authStore.accessToken" class="text-center">
                  <p class="fw-semibold text-center my-2">
                    Xin chào! <br />
                    <span class="text-primary"> {{ authStore.username }}</span>
                  </p>
                </div>
                <div class="text-center">
                  <RouterLink :to="{ name: 'dashboard' }" class="link-fx"
                    >Đi đến trang chủ >></RouterLink
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseBackground>
</template>

<style>
.bg-body-ex-light {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
