<script setup>
import { ref } from "vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();

const age = ref(null);
const isShow = ref(false);
const retriveUpdatedAgeInformation = (data) => {
  if (data) {
    console.log("get data");
    console.log(data);
    isShow.value = true;
    age.value = data;
  } else {
    isShow.value = false;
  }
};

defineExpose({
  retriveUpdatedAgeInformation,
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
        <td style="width: 250px">Từ:</td>
        <td>{{ age.minAge }} {{ age.minAgeType }}</td>
      </tr>
      <tr>
        <td>Đến:</td>
        <td>{{ age.maxAge }} {{ age.maxAgeType }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{
      formatDateFromInstantToDateTime(new Date())
    }}</em>
  </BaseBlock>
</template>
