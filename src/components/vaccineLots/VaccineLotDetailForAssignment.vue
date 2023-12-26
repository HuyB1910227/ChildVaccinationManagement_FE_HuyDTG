<script setup>
import { ref, watch } from "vue";
import { useChangeCurrencyFormat } from "@/reuse/useChangeCurrencyFormat";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatCurrencyFromDecimalToVND } = useChangeCurrencyFormat();
const { formatDateFromInstantToDateTime, formatDateFromInstantToDate } =
  useChangeDateFormat();
const props = defineProps({
  vaccineLot: {
    required: true,
    type: Object,
  },
});

const vaccineLot = ref(props.vaccineLot);

watch(
  () => props.vaccineLot,
  (newVal) => {
    vaccineLot.value = newVal;
  }
);
</script>
<template>
  <div class="row">
    <div class="col-12 col-md-6">
      <table class="table">
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold">
              -- Thông tin lô vắc xin--
            </span>
          </td>
        </tr>
        <tr>
          <td style="width: 150px">Mã lô:</td>
          <td>{{ vaccineLot.lotCode }}</td>
        </tr>
        <tr>
          <td>Tên vắc xin:</td>
          <td>{{ vaccineLot.vaccine.name }}</td>
        </tr>
        <tr>
          <td>Ngày sản xuất:</td>
          <td>
            {{ formatDateFromInstantToDate(vaccineLot.manufacturingDate) }}
          </td>
        </tr>
        <tr>
          <td>Ngày hết hạn:</td>
          <td>{{ formatDateFromInstantToDate(vaccineLot.expiredDate) }}</td>
        </tr>
        <tr>
          <td>Ngày nhập kho:</td>
          <td>
            {{ formatDateFromInstantToDateTime(vaccineLot.transactionDate) }}
          </td>
        </tr>
        <tr>
          <td>Nơi lưu trữ:</td>
          <td>{{ vaccineLot.immunizationUnit.name }}</td>
        </tr>
        <tr>
          <td>Nhà cung cấp:</td>
          <td>{{ vaccineLot.provider.name }}</td>
        </tr>
        <tr>
          <td>Số lượng:</td>
          <td>{{ vaccineLot.quantity }}</td>
        </tr>
        <tr>
          <td>Giá:</td>
          <td>{{ formatCurrencyFromDecimalToVND(vaccineLot.salePrice) }}</td>
        </tr>
      </table>
    </div>
    <div class="col-12 col-md-6">
      <table class="table" v-if="vaccineLot.vaccine">
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold">
              -- Thông tin chung vắc xin--
            </span>
          </td>
        </tr>
        <tr>
          <td style="width: 150px">Mã vắc xin:</td>
          <td>{{ vaccineLot.vaccine.id }}</td>
        </tr>
        <tr>
          <td>Liều lượng:</td>
          <td>{{ vaccineLot.vaccine.dosage }} ml</td>
        </tr>
        <tr>
          <td>Phản ứng thường gặp:</td>
          <td>{{ vaccineLot.vaccine.commonReaction }}</td>
        </tr>
        <tr>
          <td>Phòng bệnh:</td>
          <td>
            {{
              vaccineLot.vaccine.diseases
                .map((disease) => disease.name)
                .join("; ")
            }}
          </td>
        </tr>
        <tr>
          <td>Phân loại:</td>
          <td>{{ vaccineLot.vaccine.vaccineType.name }}</td>
        </tr>
      </table>
    </div>
  </div>
  <hr />
  <div class="row">
    <div v-html="vaccineLot.vaccine.description"></div>
    <div v-html="vaccineLot.vaccine.contraindication"></div>
  </div>
</template>
