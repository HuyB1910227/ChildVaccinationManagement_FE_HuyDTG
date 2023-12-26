<script setup>
import { ref } from "vue";
import AppointmentCardForm from "@/components/appointmentCards/AppointmentCardForm.vue";
import UseAppointmentCardService from "../../services/useService/useAppointmentCardService";

const appointmentCardUpdated = ref(null);
const emit = defineEmits("created:appointmentCard");
const props = defineProps({
  patient: {
    required: true,
    type: Object,
  },
});
const create = async (data) => {
  appointmentCardUpdated.value = await UseAppointmentCardService.create(data);

  if (appointmentCardUpdated.value) {
    emit("created:appointmentCard", appointmentCardUpdated.value);
  } else {
    alert("Thêm thông tin thất bại");
  }
};
</script>
<template>
  <BaseBlock title="ĐĂNG KÝ LỊCH HẸN TIÊM">
    <div class="row">
      <div class="col-lg-12 space-y-5">
        <AppointmentCardForm
          :appointmentCard="{}"
          :patient="patient"
          @submit:appointmentCard="create"
        />
      </div>
    </div>
  </BaseBlock>
</template>
