<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import UseAppointmentCardService from "@/services/useService/useAppointmentCardService";
import AppointmentCardService from "@/services/appointmentCard.service";
import { useAuthStore } from "@/stores/AuthStore";
import { useImmunizationUnitStore } from "@/stores/ImmunizationunitStore";
import UseNotificationService from "@/services/useService/useNotificationService";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import { usePatientStore } from "@/stores/PatientStore";
import VueSelect from "vue-select";
import { useCheckRole } from "@/reuse/useCheckRole";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useTranslateAppoinmentCardStatus } from "@/reuse/useTranslateAppoinmentCardStatus";
const checkHasAnyRole = useCheckRole();
const appointmentCards = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const auth = useAuthStore();
const immunizationUnitStore = useImmunizationUnitStore();
const employeeStore = useEmployeeStore();
const patientStore = usePatientStore();
const { translateAppointmentCardStatus } = useTranslateAppoinmentCardStatus();
console.log(auth.id);
const { formatDateFromInstantToDateTime, formatDateFromInstantToDate } =
  useChangeDateFormat();
import Swal from "sweetalert2";

const searchOb = reactive({
  id: null,
  appointmentDate: null,
  appointmentDateFrom: null,
  appointmentDateTo: null,
  appointmentDateConfirmedFrom: null,
  appointmentDateConfirmedTo: null,
  appointmentDateConfirmed: null,
  status: null,
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
  searchOb.status = null;
  searchOb.note = null;
  searchOb.patient = null;
  searchOb.immunizationUnit = null;
  searchOb.employee = null;
  searchOb.appointmentDateFrom = null;
  searchOb.appointmentDateTo = null;
  searchOb.appointmentDateConfirmedFrom = null;
  searchOb.appointmentDateConfirmedTo = null;
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
      Swal.fire("Đã xóa!", "Phiếu tiêm đã được hủy.", "success");
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
const optionPhysician = ref(null);
const retriveOption = async () => {
  optionImmunizationunits.value = await immunizationUnitStore.getFSelect();
  optionEmployees.value = await employeeStore.getFSelect();
  optionPatients.value = await patientStore.getFSelect();

  optionPhysician.value = await employeeStore.getPhysicianInImmunizationUnit();
  console.log(optionPhysician.value);
};

const selectedPhysician = ref(null);
const selectedAppointmentCard = ref(null);
const handleSelectedPhysician = (physicianData, appointmentCardData) => {
  if (appointmentCardData) {
    selectedAppointmentCard.value = appointmentCardData;
    if (physicianData) {
      selectedPhysician.value = physicianData;
    } else {
      selectedPhysician.value = null;
    }
  }
};

const handleUpdatePhysicianForAppointmentCard = async (
  appointmentCardData,
  physicianData
) => {
  const submitData = appointmentCardData;
  submitData.employee = physicianData;
  try {
    const res = await AppointmentCardService.update(
      appointmentCardData.id,
      submitData
    );
    let cancel = false;
    if (res) {
      cancel = true;
    }

    if (cancel) {
      var t =
        "Đã phân công bác sĩ: " +
        physicianData.fullName +
        " cho phiếu tiêm: " +
        appointmentCardData.id;
      Swal.fire("Cập nhật thành công", t, "success");
      document.getElementById("close-modal-block-physicans-select").click();
      retriveAppointmentCards();
    } else {
      Swal.fire(
        "Cập nhật phiếu tiêm thất bại",
        "Không thể cập nhật được phiếu tiêm này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  } catch (error) {
    Swal.fire(
      "Thay đổi phiếu tiêm thất bại",
      "Không thể hủy phiếu tiêm này, yêu cầu kiểm tra lại!.",
      "error"
    );
  }
};

onMounted(() => {
  retriveAppointmentCards();
  retriveOption();
});

const selectedCancelCard = ref(null);
const handleCancel = () => {
  if (selectedCancelCard.value) {
    cancelAppointmentCard(selectedCancelCard.value);
    //sự kiện click
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
    subtitle="Giai đoạn tiếp nhận, lập phiếu hẹn, chỉ định tiêm chủng cho trẻ"
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
                >Thời điểm đăng ký (Bắt đầu)</label
              >
              <input
                type="datetime-local"
                class="form-control"
                v-model="searchOb.appointmentDateFrom"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="appointmentDateConfirmed" class="my-1"
                >Thời điểm đăng ký (Kết thúc):</label
              >
              <input
                type="datetime-local"
                class="form-control"
                v-model="searchOb.appointmentDateTo"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="appointmentDate" class="my-1"
                >Thời điểm xác nhận (Bắt đầu)</label
              >
              <input
                type="datetime-local"
                class="form-control"
                v-model="searchOb.appointmentDateConfirmedFrom"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="appointmentDateConfirmed" class="my-1"
                >Thời điểm xác nhận (Kết thúc):</label
              >
              <input
                type="datetime-local"
                class="form-control"
                v-model="searchOb.appointmentDateConfirmedTo"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="status" class="my-1">Trạng thái</label>
              <select
                name="status"
                id="status"
                class="form-select"
                v-model="searchOb.status"
              >
                <option value="null">Tất cả</option>
                <option value="0">Đã đăng ký</option>
                <option value="1">Đã hẹn</option>
                <option value="2">Đã chỉ định</option>
                <option value="3">Được phép tiêm</option>
                <option value="4">Hoàn thành</option>
                <option value="-2">Đã hủy</option>
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
              <th class="d-none d-md-table-cell">Cơ sở</th>
              <th class="d-none d-md-table-cell">Ngày hẹn (yêu cầu)</th>
              <th class="d-none d-md-table-cell">Ngày hẹn (xác nhận)</th>
              <th class="d-none d-md-table-cell">Bệnh nhi</th>
              <th class="d-none d-md-table-cell">Người thân</th>
              <th class="d-none d-md-table-cell">Ghi chú</th>
              <th class="d-none d-md-table-cell">Trạng thái</th>
              <th class="text-center">Thao tác</th>
              <th class="d-none d-md-table-cell">BS chỉ định</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(appointmentCard, index) in appointmentCards"
              :key="appointmentCard._id"
            >
              <td class="fw-semibold fs-sm">
                {{ appointmentCard.id }}
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
                {{ appointmentCard.note }}
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
                    'bg-danger-light text-danger': appointmentCard.status <= -2,
                  }"
                >
                  {{ translateAppointmentCardStatus(appointmentCard.status) }}
                </span>
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    :to="{
                      name: 'edit-appointment-card',
                      params: { id: appointmentCard.id },
                    }"
                    type="button"
                    class="btn btn-md btn-alt-primary"
                    v-if="
                      appointmentCard.status < 1 &&
                      appointmentCard.status > -1 &&
                      checkHasAnyRole(['MANAGER', 'STAFF'])
                    "
                  >
                    <i class="fa fa-fw fa-pencil-alt"></i>
                  </RouterLink>
                  <RouterLink
                    type="button"
                    class="btn btn-md btn-alt-success"
                    :to="{
                      name: 'assignment',
                      params: { id: appointmentCard.id },
                    }"
                    v-if="
                      appointmentCard.status == 1 &&
                      checkHasAnyRole(['PHYSICIAN']) &&
                      appointmentCard.employee.user &&
                      appointmentCard.employee.user.id == auth.id
                    "
                  >
                    <i class="fa-solid fa-clipboard fa-fw"></i>
                  </RouterLink>
                  <button
                    type="button"
                    class="btn btn-md btn-alt-danger"
                    @click="selectedCancelCard = appointmentCard"
                    v-if="
                      appointmentCard.status < 2 &&
                      appointmentCard.status > -1 &&
                      checkHasAnyRole(['MANAGER', 'STAFF'])
                    "
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-cancel"
                  >
                    <i class="fa fa-fw fa-times"></i>
                  </button>
                </div>
              </td>
              <td class="d-none d-md-table-cell">
                <template
                  v-if="appointmentCard.employee && appointmentCard.status > 0"
                >
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-card-clip"></i>
                    {{ appointmentCard.employee.employeeId }}</span
                  >
                  <br />
                  <span class="fw-bold">
                    {{ appointmentCard.employee.fullName }}
                  </span>

                  <br />
                  <button
                    class="btn btn-sm btn-alt-primary"
                    v-if="
                      appointmentCard.status < 2 &&
                      appointmentCard.status > -1 &&
                      checkHasAnyRole(['STAFF', 'MANAGER'])
                    "
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-physicans-select"
                    @click="handleSelectedPhysician(null, appointmentCard)"
                  >
                    Thay đổi
                  </button>
                </template>
                <template
                  v-if="
                    !appointmentCard.employee &&
                    optionPhysician &&
                    checkHasAnyRole(['STAFF', 'MANAGER']) &&
                    appointmentCard.status >= 1 &&
                    appointmentCard.status <= 2
                  "
                >
                  <button
                    class="btn btn-md btn-alt-primary text-center"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-physicans-select"
                    @click="handleSelectedPhysician(null, appointmentCard)"
                  >
                    <i class="fa-solid fa-plus"></i> &nbsp;
                    <i class="fa-solid fa-user-doctor"></i>
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </NormalTable>
  </div>

  <!-- dialog -->
  <div
    class="modal"
    id="modal-block-physicans-select"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Phân công bác sĩ chỉ định" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close-modal-block-physicans-select"
              @click="selectedPhysician = null"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md" v-if="optionPhysician">
              <label for="" class="text-danger">Chọn bác sĩ chỉ định (*)</label>
              <VueSelect
                v-model="selectedPhysician"
                :options="optionPhysician"
                label="fullName"
                placeholder="Chọn BS"
              >
                <template #option="option">
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-card-clip"></i>
                    {{ option.employeeId }}</span
                  >
                  <br />
                  <span class="fw-bold">
                    {{ option.fullName }}
                  </span>
                  <br />
                </template>
              </VueSelect>
              <!-- <div v-if="selectedPhysician">
                {{ selectedPhysician }}
              </div> -->

              <br />
              <button
                class="btn btn-md btn-alt-primary mb-3"
                v-if="selectedAppointmentCard"
                @click="
                  handleUpdatePhysicianForAppointmentCard(
                    selectedAppointmentCard,
                    selectedPhysician
                  )
                "
              >
                Lưu
              </button>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>

  <!-- dialog cancel -->
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
