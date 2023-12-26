<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive, watch } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useFixedScheduleStore } from "@/stores/FixedScheduleStore";
import { useImmunizationUnitStore } from "@/stores/ImmunizationunitStore";
import VueSelect from "vue-select";
import { useTranslateWorkingDay } from "@/reuse/useTranslateWorkingDay";
import { useTranslateWorkingWeek } from "@/reuse/useTranslateWorkingWeek";
import { VaccinationType } from "../../data/vaccinationType";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useAuthStore } from "@/stores/AuthStore";
const fixedSchedules = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const fixedScheduleStore = useFixedScheduleStore();
const immunizationUnitStore = useImmunizationUnitStore();
const { formatDateFromInstantToTime } = useChangeDateFormat();

const authStore = useAuthStore();
const { translateToWorkingDayVN } = useTranslateWorkingDay();
const { translateToWorkingWeekVN } = useTranslateWorkingWeek();
const searchOb = reactive({
  workingDay: null,
  workingWeek: null,
  vaccinationType: null,
  note: null,
  startTime: null,
  endTime: null,
  immunizationUnit: null,
  isEnable: null,
});
const retriveFixedSchedules = async () => {
  try {
    const params = fixedScheduleStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await fixedScheduleStore.getAllV2(params);
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
  searchOb.vaccinationType = null;
  searchOb.note = null;
  searchOb.startTime = null;
  searchOb.endTime = null;
  searchOb.immunizationUnit = null;
  searchOb.isEnable = null;
  retriveFixedSchedules();
};

const optionImmunizationunits = ref(null);

const retriveOption = async () => {
  optionImmunizationunits.value = await immunizationUnitStore.getFSelect();
};

onMounted(() => {
  retriveFixedSchedules();
  retriveOption();
});
</script>

<template>
  <BasePageHeading title="TRA CỨU LỊCH LÀM VIỆC">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">Lịch làm việc</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-md-6 my-1">
              <label for="vaccinationType" class="my-1"
                >Hình thức phục vụ</label
              >
              <select
                name="vaccinationType"
                id="vaccinationType"
                class="form-select"
                v-model="searchOb.vaccinationType"
              >
                <option value="null">Tất cả</option>
                <option :value="VaccinationType.MO_RONG">Mở rộng</option>
                <option :value="VaccinationType.DICH_VU">Dịch vụ</option>
              </select>
            </div>
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

            <div class="col-md-6 my-1" v-if="optionImmunizationunits">
              <label for="" class="my-1">Cơ sở</label>
              <VueSelect
                v-model="searchOb.immunizationUnit"
                :options="optionImmunizationunits"
                placeholder="Chọn cơ sở"
                label="name"
              ></VueSelect>
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
              <th class="d-none d-md-table-cell">Cơ sở</th>
              <th class="d-none d-md-table-cell">Ngày làm việc</th>
              <th class="d-none d-md-table-cell">Tuần làm việc / tháng</th>
              <th class="d-none d-md-table-cell">Hình thức</th>
              <th class="d-none d-md-table-cell">Ghi chú</th>
              <th class="d-none d-md-table-cell">Bắt đầu</th>
              <th class="d-none d-md-table-cell">Kết thúc</th>
              <th class="d-none d-md-table-cell">Trạng thái</th>
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
                {{ fixedSchedule.immunizationUnit.name }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ translateToWorkingDayVN(fixedSchedule.workingDay) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ translateToWorkingWeekVN(fixedSchedule.workingWeek) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{
                  fixedSchedule.vaccinationType == "DICH_VU"
                    ? "Dịch vụ"
                    : "Mở rộng"
                }}
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
            </tr>
          </tbody>
        </table>
      </template>
    </NormalTable>
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
