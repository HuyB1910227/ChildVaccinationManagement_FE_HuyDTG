<script setup>
import { ref, onMounted, reactive } from "vue";
import { useFixedScheduleStore } from "@/stores/FixedScheduleStore";
import { useImmunizationUnitStore } from "@/stores/ImmunizationunitStore";

import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import Toggle from "@vueform/toggle";
const fixedSchedules = ref([]);
const headerResponse = ref(null);
const totalRecords = ref(null);
const fixedScheduleStore = useFixedScheduleStore();
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
const emits = defineEmits(["updated:statusOfSchedule", "activeSchedule"]);
const searchOb = reactive({
  immunizationUnit: props.immunizationUnitId,
  isEnable: 1,
});
const retriveFixedSchedules = async () => {
  try {
    const params = fixedScheduleStore.getRequestParams(0, 500, searchOb);
    const res = await fixedScheduleStore.getAll(params);
    fixedSchedules.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
    emits("activeSchedule", fixedSchedules.value);
  } catch (error) {
    console.log(error);
  }
};

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

const CancelSchedule = async (scheduleId) => {
  await Swal.fire({
    title: "Bạn chắc chắn muốn ngừng sử dụng lịch làm việc này?",
    icon: "warning",
    showCancelButton: true,
    customClass: {
      confirmButton: "btn btn-danger m-1",
      cancelButton: "btn btn-secondary m-1",
    },
    confirmButtonText: "Đồng ý xóa!",
    cancelButtonText: "Hủy",
    html: false,
    preConfirm: async () => {
      try {
        const a = await fixedScheduleStore.patch(scheduleId, {
          id: scheduleId,
          isEnable: false,
        });
        console.log(a);
        retriveFixedSchedules();
        emits("updated:statusOfSchedule");
      } catch (error) {
        console.log(error);
        Swal.fire("Cập nhật dữ liệu thất bại");
      }
    },
  });
};
const dOn = ref(true);
onMounted(() => {
  retriveImmunizationUnitInformation(props.immunizationUnitId);
  retriveFixedSchedules();
});

defineExpose({
  retriveFixedSchedules,
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
    <div class="bg-warning p-3 text-white rounded">
      <span
        >Lưu ý: Nhà quản lý chỉ được kích hoạt 1 lịch làm việc duy nhất cho mỗi
        chương trình tiêm chủng. <br />
        + Để có thể kích hoạt một lích tiêm chủng mới, nhà quản trị chọn
        <button class="btn btn-alt-warning">Ngừng sử dụng</button> lịch tiêm của
        hoặc tùy chỉnh về <Toggle onLabel="ON" offLabel="OFF" /> đối với chương
        trình cần thay đổi, sau đó kích hoạt lịch tiêm phù hợp
        <Toggle v-model="dOn" onLabel="ON" offLabel="OFF" /> để hệ thống cập
        nhật lịch tiêm.
      </span>
    </div>
    <hr />
    <div v-if="fixedSchedules">
      <h4 class="text-center">Chương trình tiêm mở rộng</h4>
      <div v-for="fixedSchedule in fixedSchedules" :key="fixedSchedule.id">
        <div v-if="fixedSchedule.vaccinationType == 'MO_RONG'">
          <div class="card">
            <div class="card-body">
              <table class="table">
                <tr>
                  <td>Ngày làm việc:</td>
                  <td>{{ fixedSchedule.workingDay }}</td>
                </tr>
                <tr>
                  <td>Tuần làm việc:</td>
                  <td>{{ fixedSchedule.workingWeek }}</td>
                </tr>
                <tr>
                  <td>Mở cửa:</td>
                  <td>
                    {{ formatDateFromInstantToTime(fixedSchedule.startTime) }}
                  </td>
                </tr>
                <tr>
                  <td>Đóng cửa:</td>
                  <td>
                    {{ formatDateFromInstantToTime(fixedSchedule.endTime) }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="card-footer" v-if="isConfig">
              <button
                class="btn btn-alt-warning"
                @click="CancelSchedule(fixedSchedule.id)"
              >
                Ngừng sử dụng
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h4 class="text-center">Chương trình tiêm dịch vụ</h4>
      <template v-for="fixedSchedule in fixedSchedules" :key="fixedSchedule.id">
        <div v-if="fixedSchedule.vaccinationType == 'DICH_VU'" class="mb-3">
          <div class="card">
            <div class="card-body">
              <table class="table">
                <tr>
                  <td>Ngày làm việc:</td>
                  <td>{{ fixedSchedule.workingDay }}</td>
                </tr>
                <tr>
                  <td>Tuần làm việc:</td>
                  <td>{{ fixedSchedule.workingWeek }}</td>
                </tr>
                <tr>
                  <td>Mở cửa:</td>
                  <td>
                    {{ formatDateFromInstantToTime(fixedSchedule.startTime) }}
                  </td>
                </tr>
                <tr>
                  <td>Đóng cửa:</td>
                  <td>
                    {{ formatDateFromInstantToTime(fixedSchedule.endTime) }}
                  </td>
                </tr>
              </table>
            </div>
            <div class="card-footer" v-if="isConfig">
              <button
                class="btn btn-alt-warning"
                @click="CancelSchedule(fixedSchedule.id)"
              >
                Ngừng sử dụng
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
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
