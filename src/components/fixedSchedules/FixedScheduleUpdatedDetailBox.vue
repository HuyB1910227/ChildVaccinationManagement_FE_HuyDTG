<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  fixedSchedule: {
    type: Object,
    required: true,
  },
});

const fixedSchedule = ref(props.fixedSchedule);

watch(
  () => props.fixedSchedule,
  (newVal) => {
    fixedSchedule.value = newVal;
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
      <tr>
        <td>Ngày làm việc:</td>
        <td>{{ fixedSchedule.workingDay }}</td>
      </tr>
      <tr>
        <td>Tuần làm việc:</td>
        <td>{{ fixedSchedule.workingWeek }}</td>
      </tr>
      <tr>
        <td>Hình thức:</td>
        <td>
          {{
            fixedSchedule.vaccinationType == "DICH_VU" ? "Dịch vụ" : "Mở rộng"
          }}
        </td>
      </tr>
      <tr>
        <td>Ghi chú:</td>
        <td>{{ fixedSchedule.note }}</td>
      </tr>
      <tr>
        <td>Bắt đầu:</td>
        <td>{{ fixedSchedule.startTime }}</td>
      </tr>
      <tr>
        <td>Kết thúc</td>
        <td>{{ fixedSchedule.endTime }}</td>
      </tr>
      <tr>
        <td>Trạng thái:</td>
        <td>{{ fixedSchedule.isEnable }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{ new Date() }}</em>
  </BaseBlock>
</template>
