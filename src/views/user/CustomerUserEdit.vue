<script setup>
import { ref, onMounted } from "vue";
import UseUserService from "@/services/useService/useUserService";
import router from "@/router";

import UserForm from "../../components/users/UserForm.vue";
import UserUpdatedDetailBox from "@/components/users/UserUpdatedDetailBox.vue";
import { useCustomerStore } from "../../stores/CustomerStore";
const userUpdated = ref(null);

const customerStore = useCustomerStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const user = ref(null);

const getUser = async (id) => {
  try {
    const res = await customerStore.getAccount(id);
    if (res) {
      user.value = res.user;
    }
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

const updateUser = async (data) => {
  try {
    userUpdated.value = await UseUserService.patch(data.id, data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getUser(props.id);
});
</script>
<template>
  <BasePageHeading
    title="CẬP NHẬT THÔNG TIN TÀI KHOẢN"
    subtitle="Chỉnh sửa thông tin tài khoản của các thành viên"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'customers' }" class="link-fx"
              >Thông tin khách hàng</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">
            Cập nhật tài khoản
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="Quản lý tài khoản">
      <UserForm
        v-if="user"
        :user="user"
        :isEmployee="false"
        @submit:user="updateUser"
      />
    </BaseBlock>

    <UserUpdatedDetailBox v-if="userUpdated" :user="userUpdated" />
  </div>
</template>
