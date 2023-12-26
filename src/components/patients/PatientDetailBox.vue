<script setup>
import { ref } from "vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
});
const { formatDateFromInstantToDate, formatDateFromInstantToDateTime } =
  useChangeDateFormat();
const patient = ref(props.patient);
</script>
<template>
  <BaseBlock title="Thông tin trẻ em" btn-option-content>
    <div class="row">
      <div class="col-md-12 col-lg-6 space-y-5">
        <table class="table">
          <tr>
            <td colspan="2">
              <span class="text-primary fw-bold"> -- Thông tin trẻ -- </span>
            </td>
          </tr>
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
      </div>

      <div class="col-md-12 col-lg-6 space-y-5" v-if="patient.customer">
        <table class="table">
          <tr>
            <td colspan="2">
              <span class="text-primary fw-bold">-- Người giám hộ --</span>
            </td>
          </tr>
          <tr class="w-25">
            <td>Mã khách hàng:</td>
            <td>{{ patient.customer.id }}</td>
          </tr>
          <tr>
            <td>Tên khách hàng:</td>
            <td>{{ patient.customer.fullName }}</td>
          </tr>
          <tr>
            <td>CCCD/CMND:</td>
            <td>{{ patient.customer.identityCard }}</td>
          </tr>
          <tr>
            <td>Số điện thoại:</td>
            <td>{{ patient.customer.phone }}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{{ patient.customer.email }}</td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>{{ patient.customer.gender ? "Nữ" : "Nam" }}</td>
          </tr>
          <tr>
            <td>Ngày sinh:</td>
            <td>{{ patient.customer.dateOfBirth }}</td>
          </tr>
          <tr>
            <td>Địa chỉ:</td>
            <td>{{ patient.customer.address }}</td>
          </tr>
          <tr>
            <td>Nghề nghiệp:</td>
            <td>{{ patient.customer.career }}</td>
          </tr>
        </table>
      </div>
    </div>
  </BaseBlock>
</template>
