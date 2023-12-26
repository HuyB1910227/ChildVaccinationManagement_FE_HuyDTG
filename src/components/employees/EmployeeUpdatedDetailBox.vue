<script setup>
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { ref, watch } from "vue";
const props = defineProps({
  employee: {
    type: Object,
    required: true,
  },
});

const employee = ref(props.employee);

watch(
  () => props.employee,
  (newVal) => {
    employee.value = newVal;
  }
);
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
</script>
<template>
  <BaseBlock
    title="Thêm / Cập nhật"
    subtitle="Thông tin vừa được thêm / cập nhật thành công"
    btn-option-content
    header-class="bg-success"
    themed
  >
    <p class="text-primary">Thông tin nhân viên</p>
    <table class="table">
      <tr>
        <td style="width: 250px">Mã nhân viên:</td>
        <td>{{ employee.employeeId }}</td>
      </tr>
      <tr>
        <td>Tên nhân viên:</td>
        <td>{{ employee.fullName }}</td>
      </tr>
      <tr>
        <td>CCCD/CMND:</td>
        <td>{{ employee.identityCard }}</td>
      </tr>
      <tr>
        <td>Số điện thoại:</td>
        <td>{{ employee.phone }}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td>{{ employee.email }}</td>
      </tr>
      <tr>
        <td>Giới tính:</td>
        <td>{{ employee.gender ? "Nữ" : "Nam" }}</td>
      </tr>
      <tr>
        <td>Ngày sinh:</td>
        <td>{{ employee.dateOfBirth }}</td>
      </tr>
      <tr>
        <td>Địa chỉ:</td>
        <td>{{ employee.address }}</td>
      </tr>
      <tr>
        <td>Mã cơ sở công tác:</td>
        <td>{{ employee.immunizationUnit.id }}</td>
      </tr>
      <tr>
        <td>Tên cơ sở công tác:</td>
        <td>{{ employee.immunizationUnit.name }}</td>
      </tr>
      <tr>
        <td>Địa chỉ cơ sở:</td>
        <td>{{ employee.immunizationUnit.address }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{
      formatDateFromInstantToDateTime(new Date())
    }}</em>
  </BaseBlock>
</template>
