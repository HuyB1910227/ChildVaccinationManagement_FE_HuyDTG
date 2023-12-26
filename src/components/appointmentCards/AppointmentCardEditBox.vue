<script setup>
import { ref } from "vue";
import AppointmentCardForm from "@/components/appointmentCards/AppointmentCardForm.vue";
import UseAppointmentCardService from "../../services/useService/useAppointmentCardService";
const appointmentCardUpdated = ref(null);
const emit = defineEmits("updated:appointmentCard");
const props = defineProps({
  appointmentCard: {
    required: true,
    type: Object,
  },
});
const update = async (data) => {
  appointmentCardUpdated.value = await UseAppointmentCardService.update(
    props.appointmentCard.id,
    data
  );
  console.log(appointmentCardUpdated.value);
  if (appointmentCardUpdated.value) {
    emit("updated:appointmentCard", appointmentCardUpdated.value);
  } else {
    alert("Thêm thông tin thất bại");
  }
};
</script>
<template>
  <BaseBlock title="Chỉnh sửa phiếu hẹn tiêm">
    <div class="row">
      <div class="col-lg-12 space-y-5">
        <AppointmentCardForm
          v-if="appointmentCard"
          :appointmentCard="appointmentCard"
          :patient="appointmentCard.patient"
          @submit:appointmentCard="update"
        />
      </div>
    </div>
  </BaseBlock>
</template>
