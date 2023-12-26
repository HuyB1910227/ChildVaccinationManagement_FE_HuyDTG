<script setup>
import { ref } from "vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
import { useTranslateAgeType } from "../../reuse/useTranslateAgeType";
import { useTranslateDistanceTimeType } from "../../reuse/useTranslateDistanceTimeType";
const injection = ref(null);
const isShow = ref(false);
const { translateToDistanceTimeTypeVN } = useTranslateDistanceTimeType();
const { translateToAgeTypeVN } = useTranslateAgeType();

const retriveUpdatedInjectionInformation = (data) => {
  if (data) {
    isShow.value = true;
    injection.value = data;
  } else {
    isShow.value = false;
  }
};

defineExpose({
  retriveUpdatedInjectionInformation,
});
</script>
<template>
  <BaseBlock
    title="Thêm / Cập nhật"
    subtitle="Thông tin vừa được lưu thành công"
    btn-option-content
    btn-option-close
    header-class="bg-success"
    themed
    v-if="isShow"
  >
    <table class="table">
      <tr>
        <td>Giai đoạn:</td>
        <td>
          Từ {{ injection.age.minAge }}
          {{ translateToAgeTypeVN(injection.age.minAgeType) }} đến
          {{ injection.age.maxAge }}
          {{ translateToAgeTypeVN(injection.age.maxAgeType) }}
        </td>
      </tr>
      <tr>
        <td style="width: 250px">Mũi tiêm:</td>
        <td>
          {{ injection.injectionTime }}
        </td>
      </tr>
      <tr>
        <td>Hiệu lực:</td>
        <td>
          {{ injection.distanceFromPrevious }}
          {{
            translateToDistanceTimeTypeVN(injection.distanceFromPreviousType)
          }}
        </td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter"
      >{{ formatDateFromInstantToDateTime(new Date()) }}
    </em>
  </BaseBlock>
</template>
