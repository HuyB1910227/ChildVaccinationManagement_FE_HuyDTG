<script setup>
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { ref, watch } from "vue";
const props = defineProps({
  customer: {
    type: Object,
    required: true,
  },
});

const customer = ref(props.customer);

watch(
  () => props.customer,
  (newVal) => {
    customer.value = newVal;
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
        <td>Mã khách hàng:</td>
        <td>{{ customer.id }}</td>
      </tr>
      <tr>
        <td>Tên khách hàng:</td>
        <td>{{ customer.fullName }}</td>
      </tr>
      <tr>
        <td>CCCD/CMND:</td>
        <td>{{ customer.identityCard }}</td>
      </tr>
      <tr>
        <td>Số điện thoại:</td>
        <td>{{ customer.phone }}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td>{{ customer.email ?? "Không có thông tin" }}</td>
      </tr>
      <tr>
        <td>Giới tính:</td>
        <td>{{ customer.gender ? "Nữ" : "Nam" }}</td>
      </tr>
      <tr>
        <td>Ngày sinh:</td>
        <td>{{ customer.dateOfBirth }}</td>
      </tr>
      <tr>
        <td>Địa chỉ:</td>
        <td>{{ customer.address }}</td>
      </tr>
      <tr>
        <td>Nghề nghiệp:</td>
        <td>{{ customer.career ?? "Không có thông tin" }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{
      formatDateFromInstantToDateTime(new Date())
    }}</em>
  </BaseBlock>
</template>
