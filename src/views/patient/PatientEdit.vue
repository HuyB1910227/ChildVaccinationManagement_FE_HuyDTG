<script setup>
import { ref, onMounted } from "vue";
import PatientService from "@/services/patient.service";
import router from "@/router";
import { previousRoute } from "@/router";
import CustomerDetailBox from "@/components/customers/CustomerDetailBox.vue";
import PatientEditBox from "@/components/patients/PatientEditBox.vue";
import PatientUpdatedDetailBox from "@/components/patients/PatientUpdatedDetailBox.vue";
const patientUpdated = ref(null);

const handleUpdated = (data) => {
  patientUpdated.value = data;
};
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const patient = ref(null);
const getPatient = async (id) => {
  try {
    patient.value = await PatientService.get(id);
    console.log(patient.value);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};
const fromRoute = ref({ name: "patients" });
const getPreviousRoute = () => {
  fromRoute.value = null;

  if (previousRoute) {
    if (previousRoute.name == "add-patient") {
      return (fromRoute.value = {
        name: "add-patient",
        params: { customerId: previousRoute.params.customerId ?? null },
      });
    }
  }
};

onMounted(() => {
  getPatient(props.id);
  getPreviousRoute();
});
</script>
<template>
  <BasePageHeading
    title="CẬP NHẬT THÔNG TIN TRẺ EM"
    subtitle="Chỉnh sửa thông tin cá nhân cho trẻ"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <template v-if="fromRoute && fromRoute.name != 'patients'">
            <li class="breadcrumb-item">
              <a class="link-fx" href="javascript:void(0)"
                >Thông tin người dùng</a
              >
            </li>
            <li class="breadcrumb-item" aria-current="page">
              <RouterLink :to="{ name: 'customers' }" class="link-fx"
                >Thông tin khách hàng</RouterLink
              >
            </li>
            <li class="breadcrumb-item" aria-current="page">
              <RouterLink :to="fromRoute" class="link-fx"
                >Quản lý thành viên</RouterLink
              >
            </li>
          </template>
          <template v-else>
            <li class="breadcrumb-item" aria-current="page">
              <RouterLink :to="{ name: 'patients' }" class="link-fx"
                >Thông tin trẻ em</RouterLink
              >
            </li>
          </template>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <CustomerDetailBox v-if="patient" :customer="patient.customer" />
    <PatientEditBox :patient="patient" @updated:patient="handleUpdated" />
    <PatientUpdatedDetailBox v-if="patientUpdated" :patient="patientUpdated" />
  </div>
</template>
