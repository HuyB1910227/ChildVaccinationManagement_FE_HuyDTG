<script setup>
import { ref, watch, onMounted } from "vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useTranslateAppoinmentCardStatus } from "@/reuse/useTranslateAppoinmentCardStatus";
import useAppointmentCardService from "@/services/useService/useAppointmentCardService";
const props = defineProps({
  history: {
    type: Object,
    required: true,
  },
});
const history = ref(props.history);
const { formatDateFromInstantToDate, formatDateFromInstantToDateTime } =
  useChangeDateFormat();

const assignmentsOfHistory = ref([]);
const retriveAssignmentHistories = async (appId) => {
  assignmentsOfHistory.value =
    await useAppointmentCardService.getAllAssignments(appId);
};
const { translateAppointmentCardStatus } = useTranslateAppoinmentCardStatus();
watch(
  () => props.history,
  (newVal) => {
    history.value = newVal;
    if (history.value) {
      retriveAssignmentHistories(history.value.appointmentCard.id);
    }
  }
);

onMounted(() => {
  retriveAssignmentHistories(props.history.appointmentCard.id);
});
</script>
<template>
  <div class="row">
    <div class="col-md-12 col-lg-6 space-y-5">
      <table class="table">
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold">
              -- Thông tin phiếu tiêm --
            </span>
          </td>
        </tr>
        <tr style="width: 200px">
          <td>Mã số:</td>
          <td>{{ history.appointmentCard.id }}</td>
        </tr>
        <tr>
          <td>Ngày đăng ký:</td>
          <td>
            {{
              formatDateFromInstantToDateTime(
                history.appointmentCard.appointmentDate
              )
            }}
          </td>
        </tr>
        <tr>
          <td>Lịch hẹn:</td>
          <td>
            {{
              history.appointmentCard.appointmentDateConfirmed
                ? formatDateFromInstantToDateTime(
                    history.appointmentCard.appointmentDateConfirmed
                  )
                : "Chưa xác nhận lịch hẹn"
            }}
          </td>
        </tr>
        <tr>
          <td>Ghi chú:</td>
          <td>{{ history.appointmentCard.note ?? "Không có ghi chú" }}</td>
        </tr>
        <tr>
          <td>Trạng thái:</td>
          <td>
            {{ translateAppointmentCardStatus(history.appointmentCard.status) }}
          </td>
        </tr>
      </table>
    </div>
    <div class="col-md-12 col-lg-6 space-y-5">
      <table class="table">
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold"> -- Thông tin trẻ -- </span>
          </td>
        </tr>
        <tr>
          <td style="width: 200px">Mã số:</td>
          <td>{{ history.appointmentCard.patient.id }}</td>
        </tr>
        <tr>
          <td>Họ và tên:</td>
          <td>{{ history.appointmentCard.patient.fullName }}</td>
        </tr>
        <tr>
          <td>Giới tính:</td>
          <td>{{ history.appointmentCard.patient.gender ? "Nữ" : "Nam" }}</td>
        </tr>
        <tr>
          <td>Ngày sinh:</td>
          <td>
            {{
              formatDateFromInstantToDate(
                history.appointmentCard.patient.dateOfBirth
              )
            }}
          </td>
        </tr>
        <tr>
          <td>Địa chỉ:</td>
          <td>{{ history.appointmentCard.patient.address }}</td>
        </tr>
      </table>
    </div>
    <div class="col-md-12 col-lg-6 space-y-5">
      <table class="table">
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold">-- Người giám hộ --</span>
          </td>
        </tr>
        <tr>
          <td style="width: 200px">Mã khách hàng:</td>
          <td>{{ history.appointmentCard.patient.customer.id }}</td>
        </tr>
        <tr>
          <td>Tên khách hàng:</td>
          <td>{{ history.appointmentCard.patient.customer.fullName }}</td>
        </tr>
        <tr>
          <td>CCCD/CMND:</td>
          <td>{{ history.appointmentCard.patient.customer.identityCard }}</td>
        </tr>
        <tr>
          <td>Số điện thoại:</td>
          <td>{{ history.appointmentCard.patient.customer.phone }}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td>{{ history.appointmentCard.patient.customer.email }}</td>
        </tr>
        <tr>
          <td>Giới tính:</td>
          <td>
            {{ history.appointmentCard.patient.customer.gender ? "Nữ" : "Nam" }}
          </td>
        </tr>
        <tr>
          <td>Ngày sinh:</td>
          <td>
            {{
              formatDateFromInstantToDate(
                history.appointmentCard.patient.customer.dateOfBirth
              )
            }}
          </td>
        </tr>
        <tr>
          <td>Địa chỉ:</td>
          <td>{{ history.appointmentCard.patient.customer.address }}</td>
        </tr>
        <tr>
          <td>Nghề nghiệp:</td>
          <td>{{ history.appointmentCard.patient.customer.career }}</td>
        </tr>
      </table>
    </div>
    <div class="col-md-12 col-lg-6 space-y-5">
      <table class="table">
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold">-- Bác sĩ chỉ định --</span>
          </td>
        </tr>
        <tr>
          <td style="width: 200px">Họ và tên:</td>
          <td>{{ history.appointmentCard.employee.fullName }}</td>
        </tr>
        <tr>
          <td>Số điện thoại:</td>
          <td>{{ history.appointmentCard.employee.phone }}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td>{{ history.appointmentCard.employee.email }}</td>
        </tr>
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold">-- Nơi tiêm --</span>
          </td>
        </tr>
        <tr>
          <td>Mã số:</td>
          <td>{{ history.appointmentCard.immunizationUnit.id }}</td>
        </tr>
        <tr>
          <td>Tên cơ sở:</td>
          <td>{{ history.appointmentCard.immunizationUnit.name }}</td>
        </tr>
        <tr>
          <td>Địa chỉ:</td>
          <td>{{ history.appointmentCard.immunizationUnit.address }}</td>
        </tr>
        <tr>
          <td>Đường dây nóng:</td>
          <td>{{ history.appointmentCard.immunizationUnit.hotline }}</td>
        </tr>
      </table>
    </div>
    <div
      class="col-12"
      v-if="assignmentsOfHistory && assignmentsOfHistory.length > 0"
    >
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th class="d-none d-md-table-cell">Tên vắc xin</th>
            <th class="d-none d-md-table-cell">Mã lô</th>
            <th class="d-none d-md-table-cell">Hình thức</th>
            <th class="d-none d-md-table-cell">Đường tiêm</th>
            <th class="d-none d-md-table-cell">Liều lượng</th>
            <th class="d-none d-md-table-cell">Trạng thái</th>
            <th class="d-none d-md-table-cell">Thời điểm tiêm</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assignment in assignmentsOfHistory" :key="assignment.id">
            <td>{{ assignment.vaccineLot.vaccine.name }}</td>
            <td>{{ assignment.vaccineLot.lotCode }}</td>
            <td>
              {{
                assignment.vaccineLot.vaccinetionType == "DICH_VU"
                  ? "Dịch vụ"
                  : "Mở rộng"
              }}
            </td>
            <td>{{ assignment.route }}</td>
            <td>{{ assignment.dosage }} ml</td>
            <td>
              <span
                v-if="assignment.status == 1"
                class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-info"
              >
                Đã tiêm
              </span>
              <span
                v-else
                class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                >Không xác định</span
              >
            </td>
            <td>
              {{
                assignment.injectionCompletionTime
                  ? formatDateFromInstantToDateTime(
                      assignment.injectionCompletionTime
                    )
                  : "Không xác định"
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-12">
      Tình trạng sau tiêm:
      {{ history.statusAfterInjection ?? "Chưa cập nhật" }}
    </div>
  </div>
</template>
