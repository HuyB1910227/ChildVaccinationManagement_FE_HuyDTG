<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import UseHistoryService from "@/services/useService/useHistoryService";
import HistoryDetailBox from "@/components/histories/HistoryDetailBox.vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useChangeCurrencyFormat } from "@/reuse/useChangeCurrencyFormat";
const props = defineProps({
  patient: {
    required: true,
    type: Object,
  },
});

const patient = ref(props.patient);
watch(
  () => props.patient,
  (newVal) => {
    patient.value = newVal;
  }
);
const { formatDateFromInstantToDate, formatDateFromInstantToDateTime } =
  useChangeDateFormat();
const { formatCurrencyFromDecimalToVND } = useChangeCurrencyFormat();
const histories = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);

const searchOb = reactive({
  patient: patient.value,
  vaccinationDate: null,
  statusAfterInjection: null,
  appointmentCard: null,
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
  searchOb.vaccinationDate = null;
  searchOb.statusAfterInjection = null;
  searchOb.appointmentCard = null;
  searchOb.patient = patient.value;
  retriveHistories();
};

const historyProps = ref(null);
const handlePropsHistory = (data) => {
  historyProps.value = data;
};

onMounted(() => {
  retriveHistories();
});
</script>
<template>
  <BaseBlock title="Lịch sử tiêm chủng" btn-option-content>
    <div class="row">
      <div class="col-lg-12 space-y-2">
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
                  <th class="d-none d-md-table-cell">Ngày tiêm</th>
                  <th class="d-none d-md-table-cell">Mã phiếu tiêm</th>
                  <th class="d-none d-md-table-cell">Người chỉ định</th>

                  <!-- <th class="d-none d-md-table-cell">
                    Liên hệ (người giám hộ)
                  </th> -->
                  <th class="d-none d-md-table-cell">Trạng thái sau tiêm</th>
                  <th class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(history, index) in histories" :key="history._id">
                  <td class="fw-semibold fs-sm">
                    {{ ++index }}
                  </td>

                  <td class="d-none d-md-table-cell">
                    {{
                      formatDateFromInstantToDateTime(history.vaccinationDate)
                    }}
                  </td>
                  <td class="d-none d-md-table-cell">
                    {{ history.appointmentCard.id }}
                  </td>
                  <td class="d-none d-md-table-cell">
                    {{ history.appointmentCard.employee.fullName }}
                  </td>

                  <td class="d-none d-md-table-cell">
                    {{ history.statusAfterInjection }}
                  </td>
                  <td class="text-center">
                    <div class="btn-group">
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
      </div>
    </div>
  </BaseBlock>
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
</template>
