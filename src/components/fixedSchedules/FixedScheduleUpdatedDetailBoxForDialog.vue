<script setup>
import { ref } from "vue";
import { useTranslateWorkingDay } from "@/reuse/useTranslateWorkingDay";
import { useTranslateWorkingWeek } from "@/reuse/useTranslateWorkingWeek";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";
const { translateToWorkingDayVN } = useTranslateWorkingDay();
const { translateToWorkingWeekVN } = useTranslateWorkingWeek();
const { formatDateFromInstantToTime, formatDateFromInstantToDateTime } =
  useChangeDateFormat();
const fixedSchedule = ref(null);
const isShow = ref(false);
const retriveUpdatedScheduleInformation = (data) => {
  if (data) {
    isShow.value = true;
    fixedSchedule.value = data;
  } else {
    isShow.value = false;
  }
};

defineExpose({
  retriveUpdatedScheduleInformation,
});
</script>
<template>
  <BaseBlock
    title="Thêm / Cập nhật"
    subtitle="Thông tin vừa được thêm / cập nhật thành công"
    btn-option-content
    btn-option-close
    header-class="bg-success"
    themed
    v-if="isShow"
  >
    <table class="table">
      <tr>
        <td style="width: 200px">Ngày làm việc:</td>
        <td>{{ translateToWorkingDayVN(fixedSchedule.workingDay) }}</td>
      </tr>
      <tr>
        <td>Tuần làm việc:</td>
        <td>{{ translateToWorkingWeekVN(fixedSchedule.workingWeek) }}</td>
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
        <td>{{ fixedSchedule.note ?? "Không có ghi chú" }}</td>
      </tr>
      <tr>
        <td>Bắt đầu:</td>
        <td>{{ formatDateFromInstantToTime(fixedSchedule.startTime) }}</td>
      </tr>
      <tr>
        <td>Kết thúc</td>
        <td>{{ formatDateFromInstantToTime(fixedSchedule.endTime) }}</td>
      </tr>
      <tr>
        <td>Trạng thái:</td>
        <td>{{ fixedSchedule.isEnable ? "Đang sử dụng" : "Ngừng sử dụng" }}</td>
      </tr>
    </table>
    <em class="text-secondary fw-lighter">{{
      formatDateFromInstantToDateTime(new Date())
    }}</em>
  </BaseBlock>
</template>
