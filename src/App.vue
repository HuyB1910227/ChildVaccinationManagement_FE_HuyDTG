<template>
  <RouterView />
</template>

<style lang="scss">
@import "@/assets/scss/main";



body {
  font-family: "Roboto", sans-serif;
}
</style>

<script setup>
import { useAuthStore } from "./stores/AuthStore";
import { onMounted } from "vue";
import ApiReponseService from "./services/api.response.service";
const authStore = useAuthStore();

onMounted(() => {
  authStore.tryLogin();
  console.log(authStore.username);
  ApiReponseService;
});
</script>
