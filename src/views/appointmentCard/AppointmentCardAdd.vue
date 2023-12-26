<script setup>
import { ref, onMounted } from "vue";
import PatientService from "@/services/patient.service";
import router from "@/router";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import PatientDetailBox from "@/components/patients/PatientDetailBox.vue";
import AppointmentCardAddBox from "@/components/appointmentCards/AppointmentCardAddBox.vue";
import AppointmentCardUpdatedDetailBox from "@/components/appointmentCards/AppointmentCardUpdatedDetailBox.vue";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";
import AppointmentCardForUpgradeSuggestion from "@/components/appointmentCards/AppointmentCardForUpgradeSuggestion.vue";
const router2 = useRouter();
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const appointmentCardUpdated = ref(null);
const handleCreated = (data) => {
  appointmentCardUpdated.value = data;
  if (appointmentCardUpdated.value) {
    Swal.fire({
      title: "Đã đăng ký thành công phiếu tiêm!",
      text: `Mã phiếu tiêm ${appointmentCardUpdated.value.id}; 
      Ngày hẹn yêu cầu: ${formatDateFromInstantToDateTime(
        appointmentCardUpdated.value.appointmentDate
      )}; Ngày hẹn được xác nhận: ${
        appointmentCardUpdated.value.appointmentDateConfirmed
          ? formatDateFromInstantToDateTime(
              appointmentCardUpdated.value.appointmentDateConfirmed
            )
          : "Chưa xác nhận"
      }`,
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        router2.replace({ name: "patients" });
      }
    });
  }
};
const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
});
const patient = ref(null);
const getPatient = async (patientId) => {
  try {
    patient.value = await PatientService.get(patientId);
    console.log(patient.value);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

onMounted(() => {
  getPatient(props.patientId);
  console.log(props.patientId);
});
</script>
<template>
  <BasePageHeading
    title="Quản lý phiếu tiêm"
    subtitle="Đăng ký tiêm chủng cho trẻ"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'patients' }" class="link-fx"
              >Thông tin trẻ em</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <PatientDetailBox v-if="patient" :patient="patient" />
    <AppointmentCardForUpgradeSuggestion v-if="patient" :patient="patient" />
    <AppointmentCardAddBox
      v-if="patient"
      @created:appointmentCard="handleCreated"
      :patient="patient"
    />
    <AppointmentCardUpdatedDetailBox
      v-if="appointmentCardUpdated"
      :appointmentCard="appointmentCardUpdated"
    />
  </div>
</template>
