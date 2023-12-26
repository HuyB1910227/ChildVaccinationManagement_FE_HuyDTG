<script setup>
import { ref, watch } from "vue";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import EmployeeForm from "@/components/employees/EmployeeForm.vue";
import EmployeeUpdatedDetailBox from "@/components/employees/EmployeeUpdatedDetailBox.vue";
import UserUpdatedDetailBox from "@/components/users/UserUpdatedDetailBox.vue";
const employeeStore = useEmployeeStore();
const employeeUpdated = ref(null);
const updatedNoti = ref(false);
import { useAuthStore } from "../../stores/AuthStore";
const authStore = useAuthStore();
const create = async (data) => {
  employeeUpdated.value = await employeeStore.create(data);
  if (!employeeUpdated.value) {
    alert("Thêm thông tin thất bại");
  }
};
const employee = ref(null);
const user = ref(null);
const getEmployee = async (id) => {
  try {
    const res = await employeeStore.getAccount(id);
    if (res) {
      employee.value = res.employee;
      user.value = res.user;
    } else {
      console.log("bị lỗi");
    }
  } catch (e) {
    console.log("bị lỗi");
  }
};
watch(
  () => employeeUpdated.value,
  (newVal) => {
    if (newVal) {
      getEmployee(newVal.id);
      if (employeeUpdated.value) {
        updatedNoti.value = true;
      } else {
        updatedNoti.value = false;
      }
    }
  }
);
</script>
<template>
  <BasePageHeading
    title="THÊM CÁN BỘ"
    subtitle="Thêm thông tin cá nhân và tài khoản cho cán bộ / nhân việc làm việc tại cơ sở tiêm chủng"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)"
              >Thông tin người dùng</a
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'employees' }" class="link-fx"
              >Cán bộ y tế</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="thêm thông tin cán bộ / nhân viên y tế">
      <div class="row">
        <div
          class="col-lg-12 space-y-5"
          v-if="authStore.hasRole('ADMINISTRATOR')"
        >
          <EmployeeForm :employee="{}" @submit:employee="create" />
        </div>
        <div class="col-lg-12 space-y-5" v-else>
          <EmployeeForm
            :employee="{}"
            @submit:employee="create"
            :immunizationUnitId="authStore.immunizationUnitId"
          />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <EmployeeUpdatedDetailBox v-if="employee" :employee="employee" />
        <UserUpdatedDetailBox v-if="user" :user="user" />
      </div>
    </div>
  </div>
</template>
