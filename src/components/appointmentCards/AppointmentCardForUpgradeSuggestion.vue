<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import UseAppointmentCardService from "@/services/useService/useAppointmentCardService";
import VueSelect from "vue-select";
import { useTranslateAppoinmentCardStatus } from "@/reuse/useTranslateAppoinmentCardStatus";

const appointmentCards = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
import { useImmunizationUnitStore } from "@/stores/ImmunizationunitStore";
import { usePatientStore } from "@/stores/PatientStore";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const immunizationUnitStore = useImmunizationUnitStore();
const patientStore = usePatientStore();
const { formatDateFromInstantToDateTime, formatDateFromInstantToDate } =
  useChangeDateFormat();
const { translateAppointmentCardStatus } = useTranslateAppoinmentCardStatus();

const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
});
const searchOb = reactive({
  id: null,
  appointmentDate: null,
  appointmentDateConfirmed: null,
  arrayStatus: [0, 1],
  note: null,
  patient: props.patient,
  immunizationUnit: null,
  //   employee: null,
});

const retriveAppointmentCards = async () => {
  try {
    const params = UseAppointmentCardService.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await UseAppointmentCardService.getAllNoValidateRole(params);
    appointmentCards.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
    console.log(res.data);
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
  retriveAppointmentCards();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveAppointmentCards();
};

const handleSearch = () => {
  page.value = 1;
  retriveAppointmentCards();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.id = null;
  searchOb.appointmentDate = null;
  searchOb.appointmentDateConfirmed = null;
  searchOb.arrayStatus = [0, 1];
  searchOb.note = null;
  searchOb.immunizationUnit = null;
  retriveAppointmentCards();
};

const optionImmunizationunits = ref(null);
const retriveOption = async () => {
  optionImmunizationunits.value = await immunizationUnitStore.getFSelect();
};
const selectedStatus = ref("ALL");
watch(
  () => selectedStatus.value,
  () => {
    if (selectedStatus.value == 1) searchOb.arrayStatus = [1];
    else if (selectedStatus.value == 0) searchOb.arrayStatus = [0];
    else selectedStatus.value = [0, 1];
  }
);

onMounted(() => {
  retriveAppointmentCards();
  retriveOption();
});
</script>
<template>
  <BaseBlock title="Nhật ký đăng ký" btn-option-content>
    <div class="row">
      <BaseLayoutSearch>
        <template #formSearch>
          <form @submit.prevent>
            <div class="row pb-2">
              <div class="col-md-6 my-1">
                <label for="appointmentDate" class="my-1"
                  >Thời điểm đăng ký:</label
                >
                <input
                  type="datetime-local"
                  class="form-control"
                  v-model="searchOb.appointmentDate"
                />
              </div>
              <div class="col-md-6 my-1">
                <label for="appointmentDateConfirmed" class="my-1"
                  >Thời điểm tiếp nhận:</label
                >
                <input
                  type="datetime-local"
                  class="form-control"
                  v-model="searchOb.appointmentDateConfirmed"
                />
              </div>
              <div class="col-md-6 my-1">
                <label for="arrayStatus" class="my-1">Trạng thái</label>
                <select
                  name="selectedStatus"
                  id="selectedStatus"
                  class="form-select"
                  v-model="selectedStatus"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="0">Đã đăng ký</option>
                  <option value="1">Đã hẹn</option>
                  <!-- <option value="1">Đã hẹn</option> -->
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
                <th class="d-none d-md-table-cell">Mã phiếu</th>
                <th class="d-none d-md-table-cell">Mã cơ sở</th>
                <th class="d-none d-md-table-cell">Cơ sở</th>
                <th class="d-none d-md-table-cell">Ngày hẹn (yêu cầu)</th>
                <th class="d-none d-md-table-cell">Ngày hẹn (xác nhận)</th>
                <th class="d-none d-md-table-cell">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(appointmentCard, index) in appointmentCards"
                :key="appointmentCard._id"
              >
                <td class="d-none d-md-table-cell">
                  {{ appointmentCard.id }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ appointmentCard.immunizationUnit.id }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ appointmentCard.immunizationUnit.name }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{
                    formatDateFromInstantToDateTime(
                      appointmentCard.appointmentDate
                    )
                  }}
                </td>
                <td class="d-none d-md-table-cell">
                  <span v-if="appointmentCard.appointmentDateConfirmed">
                    {{
                      formatDateFromInstantToDateTime(
                        appointmentCard.appointmentDateConfirmed
                      )
                    }}
                  </span>
                  <span v-else class="fw-bold fs-sm fst-italic text-danger">
                    Chưa đặt lịch khám
                  </span>
                </td>

                <td class="d-none d-md-table-cell">
                  <span
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill"
                    :class="{
                      'bg-light text-dark': appointmentCard.status == 0,
                      'bg-info-light text-info': appointmentCard.status == 1,
                      'bg-info-light text-primary':
                        appointmentCard.status == 2 ||
                        appointmentCard.status == 3,
                      'bg-success-light text-success':
                        appointmentCard.status == 4,
                      'bg-danger-light text-danger':
                        appointmentCard.status == -2,
                    }"
                  >
                    {{ translateAppointmentCardStatus(appointmentCard.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </NormalTable>
    </div>
  </BaseBlock>
</template>
