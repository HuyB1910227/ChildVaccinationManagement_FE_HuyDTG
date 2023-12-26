<script setup>
import { ref, watch } from "vue";
import PersonalUserEditForm from "./PersonalUserEditForm.vue";
import UseUserService from "@/services/useService/useUserService";
import { useAuthStore } from "@/stores/AuthStore";
import Swal from "sweetalert2";
import router from "@/router";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["changed:user"]);
const user = ref(props.user);
const userUpdated = ref(null);
const updateUser = async (data) => {
  try {
    userUpdated.value = await UseUserService.patch(user.value.id, data);
    userUpdated.value = data;
    console.log(userUpdated.value);
    if (userUpdated.value) {
      emit("changed:user", userUpdated.value);
    }
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.user,
  (newVal) => {
    if (newVal) {
      user.value = newVal;
    }
  }
);

const refreshForm = () => {
  userUpdated.value = null;
};

defineExpose({
  refreshForm,
});
</script>
<template>
  <div class="row">
    <div class="col-lg-12 space-y-5">
      <PersonalUserEditForm
        v-if="user"
        :user="user"
        @submit:user="updateUser"
      />
    </div>

    <div class="px-3" v-if="userUpdated">
      <div class="alert alert-success d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa-solid fa-check"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0 fw-bold">Cập nhật thông tin tài khoản thành công!</p>
        </div>
      </div>
    </div>
  </div>
</template>
