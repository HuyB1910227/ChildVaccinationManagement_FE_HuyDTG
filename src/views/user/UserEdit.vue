<script setup>
import { ref, onMounted } from "vue";
import UseUserService from "@/services/useService/useUserService";
import router from "@/router";
import { previousRoute } from "@/router";
import UserForm from "../../components/users/UserForm.vue";
import UserUpdatedDetailBox from "@/components/users/UserUpdatedDetailBox.vue";
import { useEmployeeStore } from "@/stores/EmployeeStore";
const userUpdated = ref(null);

const employeeStore = useEmployeeStore();
const handleUpdated = (data) => {
  userUpdated.value = data;
};
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const user = ref(null);
const isEmployee = ref(null);
const validateIsEmployee = async () => {
  try {
    const params = employeeStore.getRequestParams(1, 500, {
      user: user.value,
    });
    const res = await employeeStore.getAll(params);

    var totalRecords = res.headers["x-total-count"];
    if (totalRecords > 0) {
      isEmployee.value = true;
    } else {
      isEmployee.value = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (id) => {
  try {
    user.value = await UseUserService.get(id);
    if (user.value) {
      validateIsEmployee();
    }
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

const fromRoute = ref(null);
const getPreviousRoute = () => {
  fromRoute.value = null;
  if (previousRoute) {
    if (previousRoute.name == "customers") {
      return (fromRoute.value = {
        name: "customers",
      });
    }
    if (previousRoute.name == "employees") {
      return (fromRoute.value = {
        name: "employees",
      });
    }
    if (previousRoute.name == "users") {
      return (fromRoute.value = {
        name: "users",
      });
    }
    return (fromRoute.value = null);
  }
};

const updateUser = async (data) => {
  try {
    userUpdated.value = await UseUserService.patch(props.id, data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getUser(props.id);
  getPreviousRoute();
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
          <template v-if="fromRoute && fromRoute.name != 'customers'">
            <li class="breadcrumb-item" aria-current="page">
              <RouterLink :to="fromRoute" class="link-fx"
                >Thông tin khách hàng</RouterLink
              >
            </li>
          </template>
          <template v-else-if="fromRoute && fromRoute.name != 'employees'">
            <li class="breadcrumb-item" aria-current="page">
              <RouterLink :to="fromRoute" class="link-fx"
                >Thông tin thành viên</RouterLink
              >
            </li>
          </template>
          <template v-else-if="fromRoute && fromRoute.name != 'users'">
            <li class="breadcrumb-item" aria-current="page">
              <RouterLink :to="fromRoute" class="link-fx"
                >Quản lý tài khoản</RouterLink
              >
            </li>
          </template>
          <template v-else>
            <li class="breadcrumb-item" aria-current="page">...</li>
          </template>
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
        v-if="user && isEmployee !== null"
        :user="user"
        :isEmployee="isEmployee"
        @submit:user="updateUser"
      />
    </BaseBlock>

    <UserUpdatedDetailBox v-if="userUpdated" :user="userUpdated" />
  </div>
</template>
