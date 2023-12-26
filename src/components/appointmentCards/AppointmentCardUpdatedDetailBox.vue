<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  appointmentCard: {
    type: Object,
    required: true,
  },
});

const appointmentCard = ref(props.appointmentCard);

watch(
  () => props.appointmentCard,
  (newVal) => {
    appointmentCard.value = newVal;
  }
);
</script>
<template>
  <BaseBlock
    title="Thêm / Cập nhật"
    subtitle="Thông tin vừa được thêm / cập nhật thành công"
    btn-option-content
    header-class="bg-success"
    themed
  >
    <table class="table">
      <tr class="w-25">
        <td>Mã số:</td>
        <td>{{ appointmentCard.id }}</td>
      </tr>
      <tr>
        <td>Ngày đăng ký:</td>
        <td>{{ appointmentCard.appointmentDate }}</td>
      </tr>
      <tr>
        <td>Lịch hẹn:</td>
        <td>
          {{
            appointmentCard.appointmentDateConfirmed
              ? appointmentCard.appointmentDateConfirmed
              : "Chưa xác nhận lịch hẹn"
          }}
        </td>
      </tr>
      <tr>
        <td>Ghi chú:</td>
        <td>{{ appointmentCard.note }}</td>
      </tr>
      <tr>
        <td>Trạng thái:</td>
        <td>{{ appointmentCard.status == 0 ? "Đã đăng ký" : "Đã hẹn" }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{ new Date() }}</em>
    <div class="row">
      <a href="">Chỉnh sửa</a>
      <a href="">Thêm chỉ định</a>
    </div>
  </BaseBlock>
</template>
