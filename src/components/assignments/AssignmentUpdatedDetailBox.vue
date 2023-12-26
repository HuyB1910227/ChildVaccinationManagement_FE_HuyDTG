<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  assignmentUpdated: {
    type: Object,
    required: true,
  },
});

const assignmentUpdated = ref(props.assignmentUpdated);

watch(
  () => props.assignmentUpdated,
  (newVal) => {
    assignmentUpdated.value = newVal;
  }
);
</script>
<template>
  <BaseBlock
    title="Thêm"
    subtitle="Thông tin vừa được thêm thành công"
    btn-option-close
    header-class="bg-success"
    themed
  >
    <table class="table">
      <tr>
        <td style="width: 200px">Vắc xin:</td>
        <td>{{ assignmentUpdated.vaccineLot.vaccine.name }}</td>
      </tr>
      <tr>
        <td>Lô vắc xin:</td>
        <td>{{ assignmentUpdated.vaccineLot.lotCode }}</td>
      </tr>
      <tr>
        <td>Hình thức:</td>
        <td>
          {{
            assignmentUpdated.vaccineLot.vaccinationType == "DICH_VU"
              ? "Dịch vụ"
              : "Mở rộng"
          }}
        </td>
      </tr>
      <tr>
        <td>Ghi chú:</td>
        <td>Không</td>
      </tr>
      <tr>
        <td>Trạng thái:</td>
        <td>{{ assignmentUpdated.status == 0 ? "Chưa tiêm" : "" }}</td>
      </tr>
      <tr>
        <td>Vị trí tiêm / Đường tiêm</td>
        <td>{{ assignmentUpdated.route }}</td>
      </tr>
      <tr>
        <td>Mã phiếu tiêm:</td>
        <td>{{ assignmentUpdated.appointmentCard.id }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{ new Date() }}</em>
  </BaseBlock>
</template>
