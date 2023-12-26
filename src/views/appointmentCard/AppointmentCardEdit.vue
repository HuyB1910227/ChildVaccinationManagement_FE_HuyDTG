<script setup>
import { ref, onMounted } from "vue";
import UseAppointmentCardService from "../../services/useService/useAppointmentCardService";
import moment from "moment";

import PatientDetailBox from "@/components/patients/PatientDetailBox.vue";
import AppointmentCardEditBox from "@/components/appointmentCards/AppointmentCardEditBox.vue";
import AppointmentCardUpdatedDetailBox from "@/components/appointmentCards/AppointmentCardUpdatedDetailBox.vue";
import AppointmentCardForUpgradeSuggestion from "@/components/appointmentCards/AppointmentCardForUpgradeSuggestion.vue";
const appointmentCardUpdated = ref(null);

const handleUpdated = (data) => {
  appointmentCardUpdated.value = data;
};
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const expiredEdit = ref(false);
const appointmentCard = ref(null);
const getAppointmentCard = async (id) => {
  appointmentCard.value = await UseAppointmentCardService.get(id);
  const res = checkEligibleEdit(appointmentCard);
  if (res) {
    expiredEdit.value = false;
  } else {
    expiredEdit.value = true;
  }
};
const checkEligibleEdit = (appoinmentCard) => {
  if (appoinmentCard && appoinmentCard.appointmentDateConfirmed) {
    if (
      moment(
        appoinmentCard.appointmentDateConfirmed,
        "DD-MM-YYYY HH:mm"
      ).isSameOrBefore(moment(new Date(Date.now()), "DD-MM-YYYY HH:mm"))
    ) {
      return false;
    }
    return true;
  }
  return true;
};
onMounted(() => {
  getAppointmentCard(props.id);
});
</script>
<template>
  <BasePageHeading
    title="Quản lý phiếu tiêm"
    subtitle="Xác nhận lịch hẹn tiêm cho trẻ"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'appointment-cards' }" class="link-fx"
              >Quản lý phiếu tiêm</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content" v-if="!expiredEdit">
    <PatientDetailBox
      v-if="appointmentCard && appointmentCard.patient"
      :patient="appointmentCard.patient"
    />
    <AppointmentCardForUpgradeSuggestion
      v-if="appointmentCard && appointmentCard.patient"
      :patient="appointmentCard.patient"
    />
    <AppointmentCardEditBox
      v-if="appointmentCard"
      @updated:appointmentCard="handleUpdated"
      :appointmentCard="appointmentCard"
    />
    <AppointmentCardUpdatedDetailBox
      v-if="appointmentCardUpdated"
      :appointmentCard="appointmentCardUpdated"
    />
  </div>
  <div class="hero" v-else>
    <div class="hero-inner text-center">
      <div class="bg-body-extra-light">
        <div class="content content-full overflow-hidden">
          <div class="py-4">
            <h2 class="h4 fw-normal text-muted mb-5">
              Phiếu tiêm đã quá thời hạn chỉnh sửa...
              <br />
              Vui lòng đăng ký phiếu tiêm khác!
            </h2>
            <RouterLink :to="{ name: 'appointment-cards' }" class="link-fx"
              ><i class="fa-solid fa-arrow-left"></i> Quản lý phiếu
              tiêm</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
