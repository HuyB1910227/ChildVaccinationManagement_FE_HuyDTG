<script setup>
import { ref, onMounted } from "vue";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import EmployeeForm from "@/components/employees/EmployeeForm.vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import EmployeeUpdatedDetailBox from "@/components/employees/EmployeeUpdatedDetailBox.vue";
import UserUpdatedDetailBox from "@/components/users/UserUpdatedDetailBox.vue";
import router from "@/router";
const employeeStore = useEmployeeStore();
const employee = ref(null);
const user = ref(null);
const employeeUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

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
    router.push({
      name: "error-404",
    });
  }
};
const updateEmployee = async (data) => {
  employeeUpdated.value = await employeeStore.update(props.id, data);
  console.log(employeeUpdated.value);
  if (employeeUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
    getEmployee(props.id);
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  getEmployee(props.id);
});

const exampleBlock1 = ref(null);
function loadDataForBlock1() {
  exampleBlock1.value.statusLoading();
  setTimeout(() => {
    exampleBlock1.value.statusNormal();
  }, 2000);
}

const translateRole = (roleName) => {
  if (roleName === "MANAGER") {
    return "Quản lý";
  } else if (roleName === "ADMINISTRATOR") {
    return "Quản trị viên";
  } else if (roleName === "CUSTOMER") {
    return "Khách hàng";
  } else if (roleName === "PHYSICIAN") {
    return "Bác sĩ";
  } else if (roleName === "STAFF") {
    return "Nhân viên y tế";
  }
};
</script>
<template>
  <BasePageHeading
    title="CẬP NHẬT THÔNG TIN CÁN BỘ"
    subtitle="Cập nhật thông tin cán bộ / nhân viên làm việc tại cơ sở"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Thông tin nhân viên</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'employees' }" class="link-fx"
              >Cán bộ y tế</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="cập nhật thông tin loại vắc xin">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <EmployeeForm
            v-if="employee !== null && user !== null"
            :employee="employee"
            :immunizationUnitId="employee.immunizationUnit.id"
            :userId="user.id"
            @submit:employee="updateEmployee"
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
