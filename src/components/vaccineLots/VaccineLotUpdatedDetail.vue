<script setup>
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime, formatDateFromInstantToDate } =
  useChangeDateFormat();
import { useChangeCurrencyFormat } from "@/reuse/useChangeCurrencyFormat";
const { formatCurrencyFromDecimalToVND } = useChangeCurrencyFormat();

const props = defineProps({
  vaccineLot: {
    required: true,
    type: Object,
  },
});
</script>
<template>
  <BaseBlock
    title="Thêm / Cập nhật"
    subtitle="Thông tin vừa được lưu thành công"
    btn-option-content
    header-class="bg-success"
    themed
  >
    <table class="table">
      <tr>
        <td style="width: 250px">Mã lô:</td>
        <td>{{ props.vaccineLot.lotCode }}</td>
      </tr>
      <tr>
        <td>Tên vắc xin:</td>
        <td>{{ props.vaccineLot.vaccine.name }}</td>
      </tr>
      <tr>
        <td>Ngày sản xuất:</td>
        <td>
          {{ formatDateFromInstantToDate(props.vaccineLot.manufacturingDate) }}
        </td>
      </tr>
      <tr>
        <td>Ngày hết hạn:</td>
        <td>{{ formatDateFromInstantToDate(props.vaccineLot.expiredDate) }}</td>
      </tr>
      <tr>
        <td>Ngày nhập kho:</td>
        <td>
          {{
            formatDateFromInstantToDateTime(props.vaccineLot.transactionDate)
          }}
        </td>
      </tr>
      <tr>
        <td>Nơi lưu trữ:</td>
        <td>{{ props.vaccineLot.immunizationUnit.name }}</td>
      </tr>
      <tr>
        <td>Nhà cung cấp:</td>
        <td>{{ props.vaccineLot.provider.name }}</td>
      </tr>
      <tr>
        <td>Số lượng:</td>
        <td>{{ props.vaccineLot.quantity }}</td>
      </tr>
      <tr>
        <td>Giá:</td>
        <td>
          {{ formatCurrencyFromDecimalToVND(props.vaccineLot.salePrice) }}
        </td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{
      formatDateFromInstantToDateTime(new Date())
    }}</em>
  </BaseBlock>
</template>
