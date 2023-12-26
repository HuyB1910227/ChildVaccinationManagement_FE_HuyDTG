<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import UseHistoryService from "@/services/useService/useHistoryService";
import VueSelect from "vue-select";
import UpdateStatusDiv from "@/components/histories/UpdateStatusDiv.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { usePatientStore } from "@/stores/PatientStore";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import HistoryDetailBox from "@/components/histories/HistoryDetailBox.vue";
import { useTranslateAppoinmentCardStatus } from "@/reuse/useTranslateAppoinmentCardStatus";
import UseAppointmentCardService from "../../services/useService/useAppointmentCardService";
const patientStore = usePatientStore();
const histories = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const { translateAppointmentCardStatus } = useTranslateAppoinmentCardStatus();
const authStore = useAuthStore();
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const searchOb = reactive({
  id: null,
  vaccinationDate: null,
  statusAfterInjection: null,
  appointmentCard: null,
  patient: null,
});
const retriveHistories = async () => {
  try {
    const params = UseHistoryService.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await UseHistoryService.getAll(params);
    histories.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
    console.log(histories.value);
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
  retriveHistories();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveHistories();
};

const handleSearch = () => {
  page.value = 1;
  retriveHistories();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.id = null;
  searchOb.vaccinationDate = null;
  searchOb.statusAfterInjection = null;
  searchOb.appointmentCard = null;
  searchOb.patient = null;
  retriveHistories();
};

const historyProps = ref(null);
const handlePropsHistory = (history) => {
  historyProps.value = history;
};

const optionPatients = ref(null);
const optionAppointmentCards = ref(null);
const retriveOption = async () => {
  optionPatients.value = await patientStore.getFSelect();
  let optionData = await UseAppointmentCardService.getFSelect();
  if (optionData) {
    optionAppointmentCards.value = optionData;
  }
};
const updateStatusDivRef = ref(null);
const handleAfterUpdate = (data) => {
  console.log(data.statusAfterInjection);
  retriveHistories();
  updateStatusDivRef.value.changeSucessAlert("on");
};

const handleCloseUpdateStatusForm = () => {
  retriveHistories();
  updateStatusDivRef.value.changeSucessAlert("off");
};

onMounted(() => {
  retriveHistories();
  retriveOption();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ LỊCH SỬ TIÊM">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            Lịch sử tiêm chủng
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      ></div>
    </div>

    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-md-6 my-1">
              <label for="vaccinationDate" class="my-1">Ngày tiêm:</label>
              <input
                type="date"
                class="form-control"
                v-model="searchOb.vaccinationDate"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="statusAfterInjection" class="my-1"
                >Trạng thái sau tiêm</label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo ghi chú..."
                v-model="searchOb.statusAfterInjection"
              />
            </div>

            <div class="col-md-6 my-1" v-if="optionAppointmentCards">
              <label for="appointmentCard" class="my-1">Phiếu tiêm</label>
              <VueSelect
                v-model="searchOb.appointmentCard"
                :options="optionAppointmentCards"
                label="id"
                placeholder="Tìm kiếm theo phiếu tiêm chủng.."
              >
                <template #option="option">
                  Mã số phiếu:
                  <span class="fw-bold">
                    {{ option.id }}
                  </span>
                  <br />
                  <span class="fs-sm">
                    Ngày hẹn:
                    {{
                      formatDateFromInstantToDateTime(
                        option.appointmentDateConfirmed
                      )
                    }}</span
                  >
                  <br />
                  <span class="fs-sm">
                    Trạng thái:
                    {{ translateAppointmentCardStatus(option.status) }}</span
                  >
                </template>
              </VueSelect>
            </div>

            <div class="col-md-6 my-1" v-if="optionPatients">
              <label for="patient" class="my-1">Trẻ em</label>
              <VueSelect
                v-model="searchOb.patient"
                :options="optionPatients"
                label="fullName"
                placeholder="Tìm kiếm theo thông tin trẻ.."
              >
                <template #option="option">
                  <span class="fw-bold">
                    {{ option.fullName }}
                  </span>
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-cake-candles"></i>
                    {{ option.dateOfBirth }}</span
                  >
                </template>
              </VueSelect>
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
              <th class="d-none d-md-table-cell">Cơ sở</th>
              <th class="d-none d-md-table-cell">Ngày tiêm</th>
              <th class="d-none d-md-table-cell">Mã phiếu tiêm</th>
              <th class="d-none d-md-table-cell">Người chỉ định</th>
              <th class="d-none d-md-table-cell">Tên bệnh nhi</th>
              <th class="d-none d-md-table-cell">Liên hệ (người giám hộ)</th>
              <th class="d-none d-md-table-cell">Trạng thái sau tiêm</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="history in histories" :key="history._id">
              <td class="d-none d-md-table-cell">
                {{ history.appointmentCard.immunizationUnit.name }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ formatDateFromInstantToDateTime(history.vaccinationDate) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ history.appointmentCard.id }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ history.appointmentCard.employee.fullName }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ history.appointmentCard.patient.fullName }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ history.appointmentCard.patient.customer.phone }}
                ({{ history.appointmentCard.patient.customer.fullName }})
              </td>
              <td class="d-none d-md-table-cell">
                {{ history.statusAfterInjection }}
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <button
                    v-if="
                      history.appointmentCard.immunizationUnit.id ==
                        authStore.immunizationUnitId &&
                      history.appointmentCard.status == 4
                    "
                    type="button"
                    class="btn btn-md btn-alt-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-edit-status-history"
                    @click="handlePropsHistory(history)"
                  >
                    <i class="fa-solid fa-notes-medical"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-md btn-alt-success"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-history-detail"
                    @click="handlePropsHistory(history)"
                  >
                    <i class="fa-solid fa-circle-info"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </NormalTable>

    <div
      class="modal"
      id="modal-block-edit-status-history"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-block-extra-large"
      aria-hidden="true"
      data-bs-keyboard="false"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <BaseBlock
            title="Cập nhật trạng thái sau tiêm chi trẻ"
            transparent
            class="mb-0"
          >
            <template #options>
              <button
                type="button"
                class="btn-block-option"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="handleCloseUpdateStatusForm"
              >
                <i class="fa fa-fw fa-times"></i>
              </button>
            </template>

            <template #content>
              <div class="block-content fs-md">
                <UpdateStatusDiv
                  ref="updateStatusDivRef"
                  :history="historyProps"
                  @updatedwithPatch:history="handleAfterUpdate"
                />
              </div>
            </template>
          </BaseBlock>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="modal-block-history-detail"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-block-extra-large"
      aria-hidden="true"
      data-bs-keyboard="false"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <BaseBlock title="Thông tin chi tiết" transparent class="mb-0">
            <template #options>
              <button
                type="button"
                class="btn-block-option"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="fa fa-fw fa-times"></i>
              </button>
            </template>

            <template #content>
              <div class="block-content fs-md">
                <HistoryDetailBox v-if="historyProps" :history="historyProps" />
              </div>
              <div class="block-content block-content-full text-end bg-body">
                <button
                  type="button"
                  class="btn btn-sm btn-alt-secondary me-1"
                  data-bs-dismiss="modal"
                >
                  Thoát
                </button>
              </div>
            </template>
          </BaseBlock>
        </div>
      </div>
    </div>
  </div>
</template>

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
