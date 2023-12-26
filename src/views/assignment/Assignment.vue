<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import UseAppointmentCardService from "@/services/useService/useAppointmentCardService";
import { useChangeDistanceDayType } from "@/reuse/useChangeDistanceDateType";
import AppointmentCardFormWAssign from "@/components/assignments/AppointmentCardFormWAssign.vue";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";

import NormalTable from "@/components/tables/NormalTable.vue";
import AssignmentService from "@/services/assignment.service";
import HistoriesOfPatientBox from "@/components/histories/HistoriesOfPatientBox.vue";
import AppointmentCarDetailBox from "@/components/appointmentCards/AppointmentCarDetailBox.vue";
import { useAssignmentStore } from "@/stores/Assignment";
import AssignmentAddBox from "@/components/assignments/AssignmentAddBox.vue";

import AppointmentCardService from "@/services/appointmentCard.service";
import SuggestionBox from "@/components/suggestions/SuggestionBox.vue";
import { useChangeCurrencyFormat } from "@/reuse/useChangeCurrencyFormat";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/AuthStore";

const router = useRouter();

const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const authStore = useAuthStore();
const { forecastDateString } = useChangeDistanceDayType();
const assignments = ref(null);
const appointmentCard = ref(null);
const assignmentStore = useAssignmentStore();
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const getAppointmentCard = async (id) => {
  appointmentCard.value = await UseAppointmentCardService.get(id);
};
const searchOb = reactive({
  appointmentCard: { id: props.id },
});

const retriveAssignmentsOfAppointmentCard = async () => {
  if (searchOb.appointmentCard) {
    try {
      const params = assignmentStore.getRequestParams(
        page.value,
        pageSize.value,
        searchOb
      );
      const res = await assignmentStore.getAll(params);
      assignments.value = res.data;
      headerResponse.value = res.headers;
      totalRecords.value = headerResponse.value["x-total-count"];
    } catch (error) {
      console.log(error);
    }
  }
};

const handlePageSizeChange = (value) => {
  pageSize.value = value;
  let total = Math.ceil(totalRecords.value / pageSize.value);
  if (page.value > total) {
    page.value = total;
  }
  retriveAssignmentsOfAppointmentCard();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveAssignmentsOfAppointmentCard();
};

const showAddVaccineLotBox = ref(true);
const targetDiv = ref(null);
const { formatCurrencyFromDecimalToVND } = useChangeCurrencyFormat();

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
    confirmButtonText: "Đồng ý xóa!",
    cancelButtonText: "Hủy",
    html: false,
    preConfirm: async () => {
      try {
        const res = await AssignmentService.delete(id);
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
      retriveAssignmentsOfAppointmentCard();
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};
const appointmentCardFormWAssignRef = ref(null);
const isAddApointmentCard = ref(false);
const handleCheckAppointmentCardBeforeUpdateAssignment = async (
  appointmentCardId
) => {
  if (isAddApointmentCard.value) {
    let message = await appointmentCardFormWAssignRef.value.invalidMessage();
    console.log(message);
    if (message) {
      Swal.fire({
        title: "Lịch hẹn tiêm không hợp lệ!",
        text: message,
        icon: "warning",
      });
    } else {
      await appointmentCardFormWAssignRef.value.submit();
      await handleSuccessAssignmentForAppointmentCard(appointmentCardId);
    }
  } else {
    handleSuccessAssignmentForAppointmentCard(appointmentCardId);
  }
};

const handleSuccessAssignmentForAppointmentCard = async (appointmentCardId) => {
  let updated = false;
  const result = await Swal.fire({
    title: "Bạn chắc chắn muốn hoàn thành chỉ định tiêm?",
    text: "Các mũi tiêm sau khi cập nhật theo chỉ định sẽ không được phép sửa!",
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
        const res = await AppointmentCardService.updateDiagnosis(props.id, {
          id: appointmentCardId,
          status: 2,
          employee: {
            id: authStore.id,
          },
        });
        if (res) {
          updated = true;
        }
        return updated;
      } catch (error) {
        Swal.fire(
          "Cập nhật phiếu tiêm thất bại",
          "Không thể cập nhật phiếu tiêm, yêu cầu kiểm tra lại!.",
          "error"
        );
      }
    },
  });

  if (result.isConfirmed) {
    if (updated) {
      Swal.fire({
        title: "Đã cập nhật!",
        text: "Dữ liệu đã được cập nhật thành công.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          retriveAssignmentsOfAppointmentCard();
          router.replace({ name: "appointment-cards" });
        }
      });
    } else {
      Swal.fire(
        "Cập nhật phiếu tiêm thất bại",
        "Không thể cập nhật phiếu tiêm, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const createAndPrintPDF = async () => {
  try {
    const response = await UseAppointmentCardService.getAppointmentCardPDF(
      appointmentCard.value.id
    );

    window.open(response).print();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getAppointmentCard(props.id);
  retriveAssignmentsOfAppointmentCard();
});
</script>
<template>
  <BasePageHeading title="CHỈ ĐỊNH TIÊM CHỦNG">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'appointment-cards' }" class="link-fx"
              >Quản lý phiếu tiêm</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Chỉ định tiêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <AppointmentCarDetailBox
      v-if="appointmentCard"
      :appointmentCard="appointmentCard"
    />
    <HistoriesOfPatientBox
      v-if="appointmentCard && appointmentCard.patient"
      :patient="appointmentCard.patient"
    />
    <div class="row" ref="targetDiv">
      <div class="col-lg-12">
        <SuggestionBox
          v-if="appointmentCard && assignments"
          :appointmentCard="appointmentCard"
          :assignments="assignments"
        ></SuggestionBox>
      </div>
      <div class="col-lg-12" v-if="showAddVaccineLotBox">
        <AssignmentAddBox
          v-if="appointmentCard"
          :appointmentCard="appointmentCard"
          @updated:assignment="retriveAssignmentsOfAppointmentCard"
        />
      </div>
      <div class="col-lg-12">
        <NormalTable
          @update:pageSize="handlePageSizeChange"
          @update:page="handlePageChange"
          :totalRecordsc="totalRecords"
          :pagec="page"
        >
          <template #topRightEdgeOfTheTable>
            <button
              class="float-end btn btn-primary"
              @click="createAndPrintPDF"
              v-if="assignments && assignments.length > 0"
            >
              <i class="fa-solid fa-print"></i> In chỉ định
            </button>
          </template>
          <template #tableContent>
            <table class="table table-bordered table-striped table-vcenter">
              <thead>
                <tr>
                  <!-- <th style="width: 20px">STT</th> -->
                  <th class="d-none d-md-table-cell">Vắc xin</th>
                  <th class="d-none d-md-table-cell">Số lô</th>

                  <th class="d-none d-md-table-cell">Đường tiêm</th>
                  <th class="d-none d-md-table-cell">Liều lượng</th>
                  <th class="d-none d-md-table-cell">Đơn giá</th>
                  <th class="d-none d-md-table-cell">Hình thức</th>
                  <th class="d-none d-md-table-cell">Ngày tiêm kế tiếp</th>

                  <th class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="assignment in assignments" :key="assignment._id">
                  <td class="d-none d-md-table-cell">
                    {{ assignment.vaccineLot.vaccine.name }}
                  </td>
                  <td class="d-none d-md-table-cell">
                    {{ assignment.vaccineLot.lotCode }}
                  </td>
                  <td class="d-none d-md-table-cell">
                    {{ assignment.route }}
                  </td>
                  <td class="d-none d-md-table-cell">
                    {{ assignment.dosage }} ml
                  </td>
                  <td class="d-none d-md-table-cell">
                    {{ formatCurrencyFromDecimalToVND(assignment.price) }}
                  </td>
                  <td class="d-none d-md-table-cell">
                    {{
                      assignment.vaccineLot.vaccinationType == "DICH_VU"
                        ? "Dịch vụ"
                        : "Mở rộng"
                    }}
                  </td>
                  <td>
                    {{
                      assignment.nextAvailableInjectionDate
                        ? formatDateFromInstantToDateTime(
                            assignment.nextAvailableInjectionDate
                          )
                        : "Không tìm thấy ngày tiêm"
                    }}
                  </td>

                  <td class="text-center">
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-md btn-alt-danger"
                        @click="deleteData(assignment.id)"
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
      <div class="col-12" v-if="assignments && assignments.length > 0">
        <BaseBlock title="Hoàn thành chuẩn đoán">
          <button
            class="btn btn-primary mb-3"
            v-if="!isAddApointmentCard"
            @click="isAddApointmentCard = true"
          >
            Thêm lịch hẹn kế tiếp
          </button>
          <div
            class="border p-3 rounded my-3"
            v-if="appointmentCard && isAddApointmentCard"
          >
            <div class="d-flex">
              <div class="text-primary">THÊM LỊCH HẸN</div>
              <button
                class="btn btn-danger ms-auto"
                @click="isAddApointmentCard = false"
              >
                x
              </button>
            </div>

            <AppointmentCardFormWAssign
              :immunizationUnitId="appointmentCard.immunizationUnit.id"
              :patient="appointmentCard.patient"
              ref="appointmentCardFormWAssignRef"
            />
          </div>
          <div
            class="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            <div class="flex-shrink-0">
              <i class="fa-solid fa-exclamation"></i>
            </div>
            <div class="flex-grow-1 ms-3">
              <p class="mb-0 fw-bold">
                Lưu ý: Vui lòng kiểm tra các chỉ định tiêm trước khi chọn
                <span class="text-danger">Hoàn thành chuẩn đoán</span>. Sau khi
                xác nhận các mũi tiêm đã chỉ định, bác sĩ không được phép thêm
                hoặc chỉnh sửa các mũi tiêm cho phiếu tiêm này!
              </p>
            </div>
          </div>
          <button
            class="btn btn-primary mb-3"
            @click="
              handleCheckAppointmentCardBeforeUpdateAssignment(
                appointmentCard.id
              )
            "
          >
            Hoàn thành chuẩn đoán
          </button>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>
