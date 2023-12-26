<script setup>
import { ref, onMounted } from "vue";
import UseUserService from "@/services/useService/useUserService";
const personalUser = ref(null);
const getPersonalUser = async () => {
  personalUser.value = await UseUserService.getByToken();
};

onMounted(() => {
  getPersonalUser();
});
</script>

<template>
  {{ personalUser }}
</template>
