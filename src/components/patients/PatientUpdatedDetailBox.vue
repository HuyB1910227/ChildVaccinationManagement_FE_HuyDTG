<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
});
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const patient = ref(props.patient);
const { formatDateFromInstantToDateTime, formatDateFromInstantToDate } =
  useChangeDateFormat();
watch(
  () => props.patient,
  (newVal) => {
    patient.value = newVal;
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
        <td>{{ patient.id }}</td>
      </tr>
      <tr>
        <td>Họ và tên:</td>
        <td>{{ patient.fullName }}</td>
      </tr>
      <tr>
        <td>Giới tính:</td>
        <td>{{ patient.gender ? "Nữ" : "Nam" }}</td>
      </tr>
      <tr>
        <td>Ngày sinh:</td>
        <td>{{ formatDateFromInstantToDate(patient.dateOfBirth) }}</td>
      </tr>
      <tr>
        <td>Địa chỉ:</td>
        <td>{{ patient.address }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{
      formatDateFromInstantToDateTime(new Date())
    }}</em>
  </BaseBlock>
</template>
