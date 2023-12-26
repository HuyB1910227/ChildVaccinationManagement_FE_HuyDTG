<script setup>
import { ref, watch, onMounted, computed } from "vue";
import UseAppointmentCardService from "@/services/useService/useAppointmentCardService";
import AssignmentService from "@/services/assignment.service";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useCheckRole } from "@/reuse/useCheckRole";

import { useTranslateAppoinmentCardStatus } from "@/reuse/useTranslateAppoinmentCardStatus";
const props = defineProps({
  appointmentCard: {
    type: Object,
    required: true,
  },
});
const checkHasAnyRole = useCheckRole();
const emits = defineEmits(["appoinmentCard:statusChanged"]);
const assignments = ref(null);
const { translateAppointmentCardStatus } = useTranslateAppoinmentCardStatus();
const appointmentCard = ref(props.appointmentCard);
const { formatDateFromInstantToDateTime, formatDateFromInstantToDate } =
  useChangeDateFormat();
const getAssignment = async (appointmentCardId) => {
  assignments.value = await UseAppointmentCardService.getAllAssignments(
    appointmentCardId
  );
  console.log(assignments.value);
};
watch(
  () => props.appointmentCard,
  (newVal) => {
    appointmentCard.value = newVal;
    getAssignment(appointmentCard.value.id);
  }
);

const changeSuccessStatusForAppointmentCard = async (appoinmentCardId) => {
  await UseAppointmentCardService.patch(appoinmentCardId, {
    id: appoinmentCardId,
    status: 4,
  });
};

watch(
  () => assignments.value,
  (newVal) => {
    let checkStatus = newVal.filter((n) => n.status == 0);
    if (checkStatus.length == 0 && newVal.length > 0) {
      changeSuccessStatusForAppointmentCard(appointmentCard.value.id);
      console.log("emits");
      emits("appoinmentCard:statusChanged");
    }
  }
);
import Swal from "sweetalert2";
const confirmAssignment = async (assignment) => {
  let confirmed = false;
  const result = await Swal.fire({
    title: "Xác nhận mũi tiêm?",
    text: "Vui lòng chỉ xác nhận sau khi đã tiêm thành công!",
    icon: "warning",
    showCancelButton: true,
    customClass: {
      confirmButton: "btn btn-danger m-1",
      cancelButton: "btn btn-secondary m-1",
    },
    confirmButtonText: "Tiếp tục",
    cancelButtonText: "Hủy",
    html: false,
    preConfirm: async () => {
      try {
        const res = await AssignmentService.patch(assignment.id, {
          id: assignment.id,
          status: 1,
          injectionCompletionTime: new Date().toISOString(),
        });
        if (res) {
          confirmed = true;
        }
        return confirmed;
      } catch (error) {
        Swal.fire(
          "Thay đổi thông tin thất bại",
          "Đã xảy ra lỗi, yêu cầu kiểm tra lại!.",
          "error"
        );
      }
    },
  });

  if (result.isConfirmed) {
    if (confirmed) {
      getAssignment(appointmentCard.value.id);
    } else {
      Swal.fire(
        "Thay đổi thông tin thất bại",
        "Đã xảy ra lỗi, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const getAssignmentProgress = computed(() => {
  if (assignments.value) {
    let totalAssignment = assignments.value.length;
    let completedAssignments = assignments.value.filter((r) => r.status === 1);
    let totalCompletedAssignments = completedAssignments.length;
    return (totalCompletedAssignments / totalAssignment) * 100;
  }
  return 0;
});
onMounted(() => {
  getAssignment(appointmentCard.value.id);
});

//

const cancelAssignment = async (data) => {
  let cancel = false;
  const result = await Swal.fire({
    title: "Bạn chắc chắn muốn hủy?",
    text: "Mũi tiêm đã chỉ định sau khi hủy sẽ không thể hoàn tác!",
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
      let submitData = {
        id: data.id,
        note: data.note,
        status: -1,
      };

      try {
        const res = await AssignmentService.patch(data.id, submitData);
        if (res) {
          cancel = true;
        }
        return cancel;
      } catch (error) {
        Swal.fire(
          "Thay đổi mũi tiêm thất bại",
          "Không thể hủy mũi tiêm này, yêu cầu kiểm tra lại!.",
          "error"
        );
      }
    },
  });

  if (result.isConfirmed) {
    if (cancel) {
      Swal.fire("Đã xóa thàng công!", "Mũi tiêm đã được hủy.", "success");
      getAssignment(appointmentCard.value.id);
    } else {
      Swal.fire(
        "Thay đổi mũi tiêm thất bại",
        "Không thể hủy mũi tiêm này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const selectedCancelAssignment = ref(null);
const handleCancel = () => {
  if (selectedCancelAssignment.value) {
    cancelAssignment(selectedCancelAssignment.value);
    const closeModalButton = document.getElementById(
      "close-modal-block-cancel"
    );
    closeModalButton.click();
    selectedCancelAssignment.value = ref(null);
  } else {
    Swal.fire(
      "Thay đổi mũi tiêm thất bại",
      "Không thể hủy mũi tiêm này, yêu cầu kiểm tra lại!.",
      "error"
    );
  }
};
</script>

<template>
  <BaseBlock title="Cập nhật mũi tiêm">
    <div class="row">
      <div class="col-md-12 col-lg-6 space-y-5">
        <table class="table">
          <tr>
            <td colspan="2">
              <span class="text-primary fw-bold">
                -- <i class="fa-solid fa-paperclip me-1"></i> Thông tin phiếu
                tiêm --
              </span>
            </td>
          </tr>
          <tr style="width: 200px">
            <td>Mã số:</td>
            <td>{{ appointmentCard.id }}</td>
          </tr>
          <tr>
            <td>Ngày đăng ký:</td>
            <td>
              {{
                formatDateFromInstantToDateTime(appointmentCard.appointmentDate)
              }}
            </td>
          </tr>
          <tr>
            <td>Lịch hẹn:</td>
            <td>
              {{
                appointmentCard.appointmentDateConfirmed
                  ? formatDateFromInstantToDateTime(
                      appointmentCard.appointmentDateConfirmed
                    )
                  : "Chưa xác nhận lịch hẹn"
              }}
            </td>
          </tr>
          <tr>
            <td>Ghi chú:</td>
            <td>{{ appointmentCard.note ?? "Không có ghi chú" }}</td>
          </tr>
          <tr>
            <td>Trạng thái:</td>
            <td>
              {{ translateAppointmentCardStatus(appointmentCard.status) }}
            </td>
          </tr>
        </table>
      </div>
      <div class="col-md-12 col-lg-6 space-y-5">
        <table class="table">
          <tr>
            <td colspan="2">
              <span class="text-primary fw-bold">
                -- <i class="fa-solid fa-child-reaching me-1"></i> Thông tin trẻ
                --
              </span>
            </td>
          </tr>
          <tr>
            <td style="width: 200px">Mã số:</td>
            <td>{{ appointmentCard.patient.id }}</td>
          </tr>
          <tr>
            <td>Họ và tên:</td>
            <td>{{ appointmentCard.patient.fullName }}</td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>{{ appointmentCard.patient.gender ? "Nữ" : "Nam" }}</td>
          </tr>
          <tr>
            <td>Ngày sinh:</td>
            <td>
              {{
                formatDateFromInstantToDate(appointmentCard.patient.dateOfBirth)
              }}
            </td>
          </tr>
          <tr>
            <td>Địa chỉ:</td>
            <td>{{ appointmentCard.patient.address }}</td>
          </tr>
        </table>
      </div>
      <div class="col-md-12 col-lg-6 space-y-5">
        <table class="table">
          <tr>
            <td colspan="2">
              <span class="text-primary fw-bold"
                >-- <i class="fa-solid fa-user me-1"></i> Người giám hộ --</span
              >
            </td>
          </tr>
          <tr>
            <td style="width: 200px">Mã khách hàng:</td>
            <td>{{ appointmentCard.patient.customer.id }}</td>
          </tr>
          <tr>
            <td>Tên khách hàng:</td>
            <td>{{ appointmentCard.patient.customer.fullName }}</td>
          </tr>
          <tr>
            <td>CCCD/CMND:</td>
            <td>{{ appointmentCard.patient.customer.identityCard }}</td>
          </tr>
          <tr>
            <td>Số điện thoại:</td>
            <td>{{ appointmentCard.patient.customer.phone }}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{{ appointmentCard.patient.customer.email }}</td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>
              {{ appointmentCard.patient.customer.gender ? "Nữ" : "Nam" }}
            </td>
          </tr>
          <tr>
            <td>Ngày sinh:</td>
            <td>
              {{
                formatDateFromInstantToDate(
                  appointmentCard.patient.customer.dateOfBirth
                )
              }}
            </td>
          </tr>
          <tr>
            <td>Địa chỉ:</td>
            <td>{{ appointmentCard.patient.customer.address }}</td>
          </tr>
          <tr>
            <td>Nghề nghiệp:</td>
            <td>{{ appointmentCard.patient.customer.career }}</td>
          </tr>
        </table>
      </div>
      <div class="col-md-12 col-lg-6 space-y-5">
        <table class="table">
          <tr>
            <td colspan="2">
              <span class="text-primary fw-bold"
                >-- <i class="fa-solid fa-user-doctor me-1"></i>Bác sĩ chỉ định
                --</span
              >
            </td>
          </tr>
          <tr>
            <td style="width: 200px">Họ và tên:</td>
            <td>{{ appointmentCard.employee.fullName }}</td>
          </tr>
          <tr>
            <td>Số điện thoại:</td>
            <td>{{ appointmentCard.employee.phone }}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{{ appointmentCard.employee.email }}</td>
          </tr>
          <tr>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="2">
              <span class="text-primary fw-bold"
                >-- <i class="fa-solid fa-hospital me-1"></i> Nơi tiêm --</span
              >
            </td>
          </tr>
          <tr>
            <td>Mã số:</td>
            <td>{{ appointmentCard.immunizationUnit.id }}</td>
          </tr>
          <tr>
            <td>Tên cơ sở:</td>
            <td>{{ appointmentCard.immunizationUnit.name }}</td>
          </tr>
          <tr>
            <td>Địa chỉ:</td>
            <td>{{ appointmentCard.immunizationUnit.address }}</td>
          </tr>
          <tr>
            <td>Đường dây nóng:</td>
            <td>{{ appointmentCard.immunizationUnit.hotline }}</td>
          </tr>
        </table>
      </div>
    </div>
    <hr />

    <table class="table table-bordered table-striped" v-if="assignments">
      <thead>
        <tr>
          <th class="d-none d-md-table-cell">Tên vắc xin</th>
          <th class="d-none d-md-table-cell">Mã lô</th>
          <th class="d-none d-md-table-cell">Hình thức</th>
          <th class="d-none d-md-table-cell">Đường tiêm</th>
          <th class="d-none d-md-table-cell">Liều lượng</th>
          <th class="d-none d-md-table-cell">Trạng thái</th>
          <th class="d-none d-md-table-cell">Thời gian tiêm</th>
          <th class="d-none d-md-table-cell">Ghi chú</th>
          <th class="d-none d-md-table-cell">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="assignment in assignments" :key="assignment.id">
          <td>{{ assignment.vaccineLot.vaccine.name }}</td>
          <td>{{ assignment.vaccineLot.lotCode }}</td>
          <td>
            {{
              assignment.vaccineLot.vaccinationType == "DICH_VU"
                ? "Dịch vụ"
                : "Mở rộng"
            }}
          </td>
          <td>{{ assignment.route }}</td>
          <td>{{ assignment.dosage }} ml</td>
          <td>
            <span
              v-if="assignment.status == -1"
              class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-danger-light text-danger"
            >
              Đã hủy
            </span>
            <span
              v-else-if="assignment.status == 0"
              class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info"
            >
              Chưa hoàn thành
            </span>
            <span
              v-else
              class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-success"
            >
              Hoàn thành
            </span>
          </td>
          <td>
            {{
              formatDateFromInstantToDateTime(
                assignment.injectionCompletionTime
              )
            }}
          </td>
          <td>
            {{ assignment.note ?? "Không có ghi chú" }}
          </td>
          <td>
            <div v-if="assignment.status == 0">
              <button
                class="btn btn-primary me-2 mb-2"
                @click="confirmAssignment(assignment)"
              >
                Xác nhận
              </button>

              <button
                class="btn btn-danger mb-2"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-cancel"
                @click="selectedCancelAssignment = assignment"
                v-if="checkHasAnyRole(['MANAGER'])"
              >
                Hủy tiêm
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mb-4">
      <p class="text-primary fw-bold">
        Tiến trình tiêm chủng {{ getAssignmentProgress }} %
      </p>

      <div class="progress mb-1" style="height: 10px">
        <div
          class="progress-bar bg-success progress-bar-animated progress-bar-striped"
          role="progressbar"
          :style="{ width: getAssignmentProgress + '%' }"
          aria-valuenow="8"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  </BaseBlock>

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
        <BaseBlock title="Hủy mũi tiêm đã chỉ định" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close-modal-block-cancel"
              @click="selectedCancelAssignment = null"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md" v-if="selectedCancelAssignment">
              <div
                class="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0 fw-bold">
                    + Hủy mũi tiêm:
                    {{ selectedCancelAssignment.vaccineLot.vaccine.name }} (Mã
                    lô: {{ selectedCancelAssignment.vaccineLot.lotCode }})
                    <br />
                    + Lưu ý: Mũi tiêm sau khi hủy sẽ không thể hoàn tác. Nhân
                    viên y tế có thể nhập thêm lý do hủy mũi tiêm này vào mục
                    ghi chú!<br />
                  </p>
                </div>
              </div>
              <label for="">Ghi chú</label>
              <textarea
                type="text"
                v-model="selectedCancelAssignment.note"
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
