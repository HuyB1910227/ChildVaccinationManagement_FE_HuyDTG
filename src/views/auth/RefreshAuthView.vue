<script setup>
import { useTemplateStore } from "@/stores/template";
import { useAuthStore } from "@/stores/AuthStore";
import { onMounted } from "vue";
import Cookies from "js-cookie";
import RefreshTokenService from "@/services/refreshToken.service";
const store = useTemplateStore();
const authStore = useAuthStore();
import router from "@/router";

const handleRefreshToken = async () => {
  try {
    const data = await RefreshTokenService.refreshRequest({
      refreshToken: authStore.refreshToken,
    });
    if (data) {
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      Cookies.set("token", accessToken);
      Cookies.set("refreshToken", refreshToken);

      authStore.accessToken = accessToken;
      authStore.refreshToken = refreshToken;
      router.go(-1);
    }
  } catch (e) {
    console.log("status 500");
    console.log(e);
    if (e.response.status == 500) {
      authStore.logoutWhenExpiredRefreshToken();
    }
  }
};

onMounted(() => {
  handleRefreshToken();
});
</script>

<template>
  <div class="hero-static d-flex align-items-center">
    <div class="w-100">
      <div class="bg-body-extra-light">
        <div class="content content-full">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-4 py-6">
              <div class="text-center">
                <p>
                  <i class="fa fa-3x fa-cog fa-spin text-primary"></i>
                </p>
                <h1 class="h4 mb-1">
                  Vui lòng chờ trong giây lát, hệ thống đang tiến hành sửa lỗi..
                </h1>
                <h2 class="h6 fw-normal text-muted mb-3">
                  .. hệ thống sẽ hoạt động trong ít phút nữa
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="fs-sm text-center text-muted py-3">
        <strong>{{ store.app.name + " " + store.app.version }}</strong> &copy;
        {{ store.app.copyright }}
      </div>
    </div>
  </div>
</template>
