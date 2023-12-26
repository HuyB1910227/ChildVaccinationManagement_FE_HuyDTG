<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import UseAppointmentCardService from "@/services/useService/useAppointmentCardService";
import AppointmentCardService from "@/services/appointmentCard.service";
import { useAuthStore } from "@/stores/AuthStore";
import { useImmunizationUnitStore } from "@/stores/ImmunizationunitStore";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import UseNotificationService from "@/services/useService/useNotificationService";
import { usePatientStore } from "@/stores/PatientStore";
import VueSelect from "vue-select";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import DiagnosedAppointmentCardDetailBox from "@/components/diagnosedAppointmentCards/DiagnosedAppointmentCardDetailBox.vue";
const appointmentCards = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const auth = useAuthStore();
const immunizationUnitStore = useImmunizationUnitStore();
const employeeStore = useEmployeeStore();
const patientStore = usePatientStore();
console.log(auth.id);

const { formatDateFromInstantToDate } = useChangeDateFormat();
import Swal from "sweetalert2";

const searchOb = reactive({
  id: null,
  appointmentDate: null,
  appointmentDateConfirmed: null,
  status: 2,
  note: null,
  patient: null,
  immunizationUnit: null,
  employee: null,
});
const retriveAppointmentCards = async () => {
  try {
    const params = UseAppointmentCardService.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await UseAppointmentCardService.getAll(params);
    appointmentCards.value = res.data;
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
  searchOb.note = null;
  searchOb.patient = null;
  searchOb.immunizationUnit = null;
  searchOb.employee = null;
  retriveAppointmentCards();
};

const cancelAppointmentCard = async (data) => {
  let cancel = false;
  const result = await Swal.fire({
    title: "Bạn chắc chắn muốn hủy?",
    text: "Phiếu tiêm sau khi hủy sẽ không thể hoàn tác!",
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
      const submitData = data;
      submitData.status = -2;
      submitData.employee = {
        id: auth.id,
      };
      try {
        const res = await AppointmentCardService.update(data.id, submitData);
        if (res) {
          await UseNotificationService.cancelNotificationConfirmAppointmentCard(
            res
          );
          cancel = true;
        }
        return cancel;
      } catch (error) {
        Swal.fire(
          "Thay đổi phiếu tiêm thất bại",
          "Không thể hủy phiếu tiêm này, yêu cầu kiểm tra lại!.",
          "error"
        );
      }
    },
  });

  if (result.isConfirmed) {
    if (cancel) {
      Swal.fire("Đã xóa thàng công!", "Phiếu tiêm đã được hủy.", "success");
      retriveAppointmentCards();
    } else {
      Swal.fire(
        "Hủy phiếu tiêm thất bại",
        "Không thể xóa được phiếu tiêm này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const optionImmunizationunits = ref(null);
const optionEmployees = ref(null);
const optionPatients = ref(null);
const retriveOption = async () => {
  optionImmunizationunits.value = await immunizationUnitStore.getFSelect();
  optionEmployees.value = await employeeStore.getFSelect();
  optionPatients.value = await patientStore.getFSelect();
};

const appointmentCardForDetail = ref(null);
const handlePropsAppoinmentCard = (data) => {
  appointmentCardForDetail.value = data;
};

const diagnosedAppointmentCardDetailBoxRef = ref(null);

const handleCloseAppointmentCardModal = () => {
  diagnosedAppointmentCardDetailBoxRef.value.isConfirmed = false;
};

onMounted(() => {
  retriveAppointmentCards();
  retriveOption();
});

const selectedCancelCard = ref(null);
const handleCancel = () => {
  if (selectedCancelCard.value) {
    cancelAppointmentCard(selectedCancelCard.value);
    const closeModalButton = document.getElementById(
      "close-modal-block-cancel"
    );
    closeModalButton.click();
    selectedCancelCard.value = ref(null);
  } else {
    Swal.fire(
      "Thay đổi phiếu tiêm thất bại",
      "Không thể hủy phiếu tiêm này, yêu cầu kiểm tra lại!.",
      "error"
    );
  }
};
</script>

<template>
  <BasePageHeading
    title="QUẢN LÝ TIÊM CHỦNG"
    subtitle="Giai đoạn phê duyệt tiêm chủng cho trẻ"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">Phiếu tiêm chủng</li>
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
              <label for="note" class="my-1">Ghi chú</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo ghi chú..."
                v-model="searchOb.note"
              />
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
            <div class="col-md-6 my-1" v-if="optionEmployees">
              <label for="employee" class="my-1">Nhân viên chỉ định</label>
              <VueSelect
                v-model="searchOb.employee"
                :options="optionEmployees"
                label="fullName"
                placeholder="Tìm kiếm theo nhân viên chỉ định.."
              >
                <template #option="option">
                  <span class="fw-bold">
                    {{ option.fullName }}
                  </span>
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-badge"></i> {{ option.id }}</span
                  >
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-card-clip"></i>
                    {{ option.employeeId }}</span
                  >
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-phone"></i> {{ option.phone }}</span
                  >
                </template>
              </VueSelect>
            </div>
            <div
              class="col-md-6 my-1"
              v-if="optionImmunizationunits && auth.hasRole('ADMINISTRATOR')"
            >
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
              <th class="d-none d-md-table-cell">Cơ sở</th>
              <th class="d-none d-md-table-cell">Mã phiếu</th>
              <th class="d-none d-md-table-cell">Trẻ em</th>
              <th class="d-none d-md-table-cell">Người thân</th>
              <th class="d-none d-md-table-cell">Bác sĩ chỉ định</th>
              <th class="d-none d-md-table-cell">Ghi chú</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="appointmentCard in appointmentCards"
              :key="appointmentCard._id"
            >
              <td class="d-none d-md-table-cell">
                {{ appointmentCard.immunizationUnit.name }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ appointmentCard.id }}
              </td>
              <td class="d-none d-md-table-cell">
                <span class="fs-md"
                  ><i class="fa-solid fa-child-reaching me-1 text-info"></i>
                  {{ appointmentCard.patient.fullName }}</span
                >
                <br />
                <span class="fs-md"
                  ><i class="fa-solid fa-cake-candles me-1 text-info"></i>
                  {{
                    formatDateFromInstantToDate(
                      appointmentCard.patient.dateOfBirth
                    )
                  }}</span
                >
              </td>
              <td class="d-none d-md-table-cell">
                <span class="fs-md"
                  ><i class="fa-solid fa-user me-1 text-info"></i>
                  {{ appointmentCard.patient.customer.fullName }}</span
                >
                <br />
                <span class="fs-md"
                  ><i class="fa-solid fa-phone me-1 text-info"></i>
                  {{ appointmentCard.patient.customer.phone }}</span
                >
              </td>

              <td class="d-none d-md-table-cell">
                <span class="fs-md"
                  ><i class="fa-solid fa-user-doctor me-1 text-info"></i>
                  {{ appointmentCard.employee.fullName }}</span
                >
                <br />
                <span class="fs-md"
                  ><i class="fa-regular fa-id-card me-1 text-info"></i>
                  {{ appointmentCard.employee.employeeId }}</span
                >
              </td>
              <td class="d-none d-md-table-cell">
                {{ appointmentCard.note ?? "Không có ghi chú" }}
              </td>

              <td class="text-center">
                <div class="btn-group fs-md">
                  <button
                    type="button"
                    class="btn btn-md btn-alt-success btn-md-action"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-apointment-cardk-detail"
                    @click="handlePropsAppoinmentCard(appointmentCard)"
                  >
                    <i class="fa-solid fa-clipboard fa-fw"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-md btn-alt-danger btn-md-action ml-0"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-cancel"
                    @click="selectedCancelCard = appointmentCard"
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
  </div>

  <div
    class="modal"
    id="modal-block-apointment-cardk-detail"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Thông tin phiếu tiêm" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="handleCloseAppointmentCardModal"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-sm">
              <DiagnosedAppointmentCardDetailBox
                ref="diagnosedAppointmentCardDetailBoxRef"
                v-if="appointmentCardForDetail"
                :appointmentCard="appointmentCardForDetail"
                @appoinmentCard:statusChanged="retriveAppointmentCards"
              />
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>

  <div
    class="modal"
    id="modal-block-cancel"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Hủy phiếu tiêm" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close-modal-block-cancel"
              @click="selectedCancelCard = null"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md" v-if="selectedCancelCard">
              <div
                class="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0 fw-bold">
                    + Hủy phiếu tiêm: {{ selectedCancelCard.id }} <br />
                    + Lưu ý: Phiếu tiêm sau khi hủy sẽ không thể hoàn tác. Nhân
                    viên y tế có thể nhập thêm lý do hủy phiếu tiêm này vào mục
                    ghi chú!<br />
                  </p>
                </div>
              </div>
              <label for="">Ghi chú</label>
              <textarea
                type="text"
                v-model="selectedCancelCard.note"
                class="form-control"
                maxlength="254"
              ></textarea>
              <br />
              <button
                class="btn btn-md btn-alt-primary mb-3"
                @click="handleCancel"
              >
                Tiếp tục
              </button>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>

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
