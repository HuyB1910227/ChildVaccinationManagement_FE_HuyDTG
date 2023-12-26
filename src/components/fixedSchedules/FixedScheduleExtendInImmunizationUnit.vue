<script setup>
import { ref, onMounted, reactive } from "vue";
import { useImmunizationUnitStore } from "@/stores/ImmunizationunitStore";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import fixedScheduleCalendarNonBox from "./fixedScheduleCalendarNonBox.vue";
import { VaccinationType } from "../../data/vaccinationType";
import Toggle from "@vueform/toggle";

const immunizationUnitStore = useImmunizationUnitStore();
const { formatDateFromInstantToTime } = useChangeDateFormat();
import Swal from "sweetalert2";

const props = defineProps({
  immunizationUnitId: {
    type: String,
    required: true,
  },
  isConfig: {
    type: Boolean,
    required: true,
  },
});

const immunizationUnitSelected = ref(null);
const retriveImmunizationUnitInformation = async (immunizationUnitId) => {
  try {
    immunizationUnitSelected.value = await immunizationUnitStore.get(
      immunizationUnitId
    );
  } catch (error) {
    console.log(error);
  }
};

const fixedScheduleCalendarNonBoxRef = ref(null);

const refreshCalendar = () => {
  fixedScheduleCalendarNonBoxRef.value.refreshEvents();
};

onMounted(() => {
  retriveImmunizationUnitInformation(props.immunizationUnitId);
});

defineExpose({
  refreshCalendar,
});
</script>

<template>
  <BaseBlock title="Thông tin lịch làm việc">
    <table class="table" v-if="immunizationUnitSelected">
      <tr>
        <td>Mã cơ sở:</td>
        <td>{{ immunizationUnitSelected.id }}</td>
        <td>Địa chỉ:</td>
        <td>{{ immunizationUnitSelected.address }}</td>
      </tr>
      <tr>
        <td>Tên cơ sở:</td>
        <td>{{ immunizationUnitSelected.name }}</td>
        <td>Hotline:</td>
        <td>{{ immunizationUnitSelected.hotline }}</td>
      </tr>
    </table>
    <hr />
    <h4 class="text-center">CHƯƠNG TRÌNH TIÊM MỞ RỘNG</h4>
    <fixedScheduleCalendarNonBox
      v-if="immunizationUnitId"
      :immunizationUnitId="immunizationUnitId"
      :vaccinationType="VaccinationType.MO_RONG"
      ref="fixedScheduleCalendarNonBoxRef"
    />
  </BaseBlock>
</template>
<style src="@vueform/toggle/themes/default.css"></style>
<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
<style lang="scss" scoped>
.gg-select {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(1);
  width: 22px;
  height: 22px;
}
.gg-select::after,
.gg-select::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}
.gg-select::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}
.gg-select::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}
th.sort {
  cursor: pointer;
  user-select: none;
  &.asc {
    .gg-select::after {
      opacity: 1;
    }
  }
  &.desc {
    .gg-select::before {
      opacity: 1;
    }
  }
}
</style>
