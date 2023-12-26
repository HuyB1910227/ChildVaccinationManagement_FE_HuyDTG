<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive, watch } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useFixedScheduleStore } from "@/stores/FixedScheduleStore";
import FixedScheduleService from "@/services/fixedSchedule.service";
import { VaccinationType } from "../../data/vaccinationType";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import Toggle from "@vueform/toggle";
import { useAuthStore } from "@/stores/AuthStore";
import Swal from "sweetalert2";
import FixedScheduleServiceInImmunizationUnit from "@/components/fixedSchedules/FixedScheduleServiceInImmunizationUnit.vue";
import FixedScheduleFormForDialog from "@/components/fixedSchedules/FixedScheduleFormForDialog.vue";
import FixedScheduleUpdatedDetailBoxForDialog from "@/components/fixedSchedules/FixedScheduleUpdatedDetailBoxForDialog.vue";
import { useTranslateWorkingDay } from "@/reuse/useTranslateWorkingDay";
import { useTranslateWorkingWeek } from "@/reuse/useTranslateWorkingWeek";
const { translateToWorkingDayVN } = useTranslateWorkingDay();
const { translateToWorkingWeekVN } = useTranslateWorkingWeek();
const fixedSchedules = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const fixedScheduleStore = useFixedScheduleStore();
const { formatDateFromInstantToTime } = useChangeDateFormat();

const authStore = useAuthStore();

const searchOb = reactive({
  workingDay: null,
  workingWeek: null,
  vaccinationType: VaccinationType.DICH_VU,
  note: null,
  startTime: null,
  endTime: null,
  immunizationUnit: { id: authStore.immunizationUnitId },
  isEnable: null,
});
const retriveFixedSchedules = async () => {
  try {
    const params = fixedScheduleStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await fixedScheduleStore.getAll(params);
    fixedSchedules.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
  } catch (error) {
    console.log(error);
  }
};

const handlePageSizeChange = (value) => {
  pageSize.value = value;
  let total = Math.ceil(totalRecords.value / pageSize.value);
  if (page.value > total) {
    page.value = total;
  }
  retriveFixedSchedules();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveFixedSchedules();
};

const handleSearch = () => {
  page.value = 1;
  retriveFixedSchedules();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.workingDay = null;
  searchOb.workingWeek = null;
  searchOb.note = null;
  searchOb.startTime = null;
  searchOb.endTime = null;
  searchOb.isEnable = null;
  retriveFixedSchedules();
};

const deleteData = async (id) => {
  let deleted = false;
  const result = await Swal.fire({
    title: "Bạn chắc chắn muốn xóa?",
    text: "Dữ liệu sao khi xóa sẽ không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    customClass: {
      confirmButton: "btn btn-danger m-1",
      cancelButton: "btn btn-secondary m-1",
    },
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy",
    html: false,
    preConfirm: async () => {
      try {
        const res = await FixedScheduleService.delete(id);
        if (res.status == 204) {
          deleted = true;
        }
        return deleted;
      } catch (error) {
        Swal.fire(
          "Xóa dữ liệu thất bại",
          "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
          "error"
        );
      }
    },
  });

  if (result.isConfirmed) {
    if (deleted) {
      Swal.fire("Đã xóa!", "Dữ liệu đã được xóa thành công.", "success");
      retriveFixedSchedules();
      fixedScheduleInImmunuzationUnitComponent.value.refreshCalendar();
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};
const fixedSchedulePropsToFormModal = ref({
  immunizationUnit: { id: authStore.immunizationUnitId },
  vaccinationType: VaccinationType.DICH_VU,
  isEnable: 1,
});
const fixedScheduleFormForDialogRef = ref(null);
const FixedScheduleUpdatedDetailBoxForDialogRef = ref(null);
const createExtendSchedule = async (data) => {
  try {
    const res = await fixedScheduleStore.create(data);
    if (res) {
      await retriveFixedSchedules();
      fixedScheduleInImmunuzationUnitComponent.value.refreshCalendar();
      FixedScheduleUpdatedDetailBoxForDialogRef.value.retriveUpdatedScheduleInformation(
        res
      );

      fixedScheduleFormForDialogRef.value.clearForm();
    }
  } catch (error) {
    console.log(error);
    Swal.fire(
      "Cập nhật dữ liệu thất bại",
      "Hệ thống không thể cập nhật dữ liệu! Vui lòng thử lại sau...",
      "error"
    );
  }
};

const activeSchedule = ref(null);
const getActiveSchedule = (data) => {
  activeSchedule.value = data;
};

const fixedScheduleInImmunuzationUnitComponent = ref(null);

const toggleStatus = async (scheduleId, statusVal) => {
  console.log(statusVal);
  try {
    const result = await fixedScheduleStore.patch(scheduleId, {
      id: scheduleId,
      isEnable: statusVal,
    });
    if (!result) {
      Swal.fire(
        "Cập nhật trạng thái lịch tiêm thất bại! Vui lòng thử lại sau."
      );
      retriveFixedSchedules();
      fixedScheduleInImmunuzationUnitComponent.value.refreshCalendar();
    } else {
      retriveFixedSchedules();
      fixedScheduleInImmunuzationUnitComponent.value.refreshCalendar();
    }
  } catch (error) {
    Swal.fire("Cập nhật trạng thái lịch tiêm thất bại! Vui lòng thử lại sau.");
  }
};

const handleExitFormModal = () => {
  retriveFixedSchedules();
  fixedScheduleInImmunuzationUnitComponent.value.refreshCalendar();
  FixedScheduleUpdatedDetailBoxForDialogRef.value.retriveUpdatedScheduleInformation(
    null
  );
};

onMounted(() => {
  retriveFixedSchedules();
});
</script>

<template>
  <BasePageHeading
    title="LỊCH LÀM VIỆC (TCDV)"
    subtitle="Quản lý / tra cứu lịch tiêm thuộc chường trình tiêm chủng dịch vụ (TCDV) tại cơ sở"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">Lịch làm việc</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2" v-if="authStore.hasRole('MANAGER')">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <RouterLink
          class="btn btn-primary"
          :to="{ name: 'add-fixed-schedule' }"
          data-bs-toggle="modal"
          data-bs-target="#modal-block-fixed-schedule-form"
          >Thêm lịch làm việc</RouterLink
        >
      </div>
    </div>

    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-md-6 my-1">
              <label for="workingDay" class="my-1">Ngày làm việc</label>
              <select
                name="workingDay"
                id="workingDay"
                class="form-select"
                v-model="searchOb.workingDay"
              >
                <option value="null">Tất cả</option>
                <option value="Mon">Thứ Hai</option>
                <option value="Tue">Thứ Ba</option>
                <option value="Web">Thứ Tư</option>
                <option value="Thu">Thứ Năm</option>
                <option value="Fri">Thứ Sáu</option>
                <option value="Sat">Thứ Bảy</option>
                <option value="Sun">Chủ Nhật</option>
                <option v-for="i in 31" :key="i" :value="'D' + i">
                  Ngày {{ i }}
                </option>
                <option value="END_OF_MONTH">Cuối tháng</option>
              </select>
            </div>
            <div class="col-md-6 my-1">
              <label for="workingWeek" class="my-1"
                >Tuần làm việc / tháng</label
              >
              <select
                name="workingWeek"
                id="workingWeek"
                class="form-select"
                v-model="searchOb.workingWeek"
              >
                <option value="null">Tất cả</option>
                <option v-for="i in 4" :key="i" :value="'W' + i">
                  Tuần {{ i }}
                </option>
                <option value="ALL">Hàng tuần</option>
              </select>
            </div>

            <div class="col-md-6 my-1">
              <label for="startTime" class="my-1">Giờ bắt đầu:</label>
              <div class="input-group mb-3">
                <span class="input-group-text">Bắt đầu từ:</span>
                <input
                  type="time"
                  class="form-control"
                  v-model="searchOb.startTime"
                />
              </div>
            </div>
            <div class="col-md-6 my-1">
              <label for="endTime" class="my-1">Giờ kết thúc:</label>
              <div class="input-group mb-3">
                <span class="input-group-text">Trước thời điểm:</span>
                <input
                  type="time"
                  class="form-control"
                  v-model="searchOb.endTime"
                />
              </div>
            </div>
            <div class="col-md-6 my-1">
              <label for="isEnable" class="my-1">Trạng thái</label>
              <select
                name="isEnable"
                id="isEnable"
                class="form-select"
                v-model="searchOb.isEnable"
              >
                <option value="null">Tất cả</option>
                <option value="0">Ngừng sử dụng</option>
                <option value="1">Đang sử dụng</option>
              </select>
            </div>
            <div class="col-md-6 my-1">
              <label for="note" class="my-1">Ghi chú</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo ghi chú..."
                v-model="searchOb.note"
              />
            </div>
          </div>
          <div class="row py-3">
            <div class="col-12">
              <button class="btn btn-primary me-2" @click="handleSearch">
                Tìm kiếm
              </button>
              <button
                type="reset"
                class="btn btn-outline-primary me-2"
                @click="clearSearch"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </form>
      </template>
    </BaseLayoutSearch>

    <NormalTable
      @update:pageSize="handlePageSizeChange"
      @update:page="handlePageChange"
      :totalRecordsc="totalRecords"
      :pagec="page"
    >
      <template #tableContent>
        <table class="table table-bordered table-striped table-vcenter">
          <thead>
            <tr>
              <th style="width: 20px">STT</th>
              <th class="d-none d-md-table-cell">Ngày làm việc</th>
              <th class="d-none d-md-table-cell">Tuần làm việc / tháng</th>
              <th class="d-none d-md-table-cell">Ghi chú</th>
              <th class="d-none d-md-table-cell">Bắt đầu</th>
              <th class="d-none d-md-table-cell">Kết thúc</th>
              <th class="d-none d-md-table-cell">Trạng thái</th>
              <th class="text-center" v-if="authStore.hasRole('MANAGER')">
                Sử dụng
              </th>
              <th
                class="d-none d-md-table-cell"
                v-if="authStore.hasRole('MANAGER')"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(fixedSchedule, index) in fixedSchedules"
              :key="fixedSchedule._id"
            >
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>

              <td class="d-none d-md-table-cell">
                {{ translateToWorkingDayVN(fixedSchedule.workingDay) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ translateToWorkingWeekVN(fixedSchedule.workingWeek) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ fixedSchedule.note }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ formatDateFromInstantToTime(fixedSchedule.startTime) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ formatDateFromInstantToTime(fixedSchedule.endTime) }}
              </td>
              <td class="d-none d-md-table-cell">
                <span
                  v-if="fixedSchedule.isEnable == 1"
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info"
                >
                  Hoạt động
                </span>
                <span
                  v-else
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                >
                  Ngừng hoạt động
                </span>
              </td>
              <td
                v-if="
                  authStore.hasRole('MANAGER') &&
                  fixedSchedule.vaccinationType == 'DICH_VU'
                "
              >
                <Toggle
                  v-model="fixedSchedule.isEnable"
                  @click="
                    toggleStatus(
                      fixedSchedule.id,
                      fixedSchedule.isEnable ? 1 : 0
                    )
                  "
                  onLabel="ON"
                  offLabel="OFF"
                />
              </td>
              <td class="text-center" v-if="authStore.hasRole('MANAGER')">
                <div class="btn-group">
                  <button
                    type="button"
                    class="btn btn-sm btn-alt-danger"
                    @click="deleteData(fixedSchedule.id)"
                  >
                    <i class="fa fa-fw fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </NormalTable>

    <template v-if="authStore.immunizationUnitId != 'null'">
      <FixedScheduleServiceInImmunizationUnit
        v-if="authStore.immunizationUnitId"
        :immunizationUnitId="authStore.immunizationUnitId"
        @activeSchedule="getActiveSchedule"
        ref="fixedScheduleInImmunuzationUnitComponent"
        :isConfig="authStore.hasRole('MANAGER')"
      />
    </template>
  </div>

  <div
    class="modal"
    id="modal-block-fixed-schedule-form"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Thêm thông tin lịch tiêm" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="handleExitFormModal"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md">
              <FixedScheduleFormForDialog
                ref="fixedScheduleFormForDialogRef"
                v-if="fixedSchedulePropsToFormModal"
                :fixedSchedule="fixedSchedulePropsToFormModal"
                @submit:add:fixedSchedule="createExtendSchedule"
              />
              <FixedScheduleUpdatedDetailBoxForDialog
                ref="FixedScheduleUpdatedDetailBoxForDialogRef"
              />
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
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
