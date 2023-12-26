<script setup>
import { ref, watch, onMounted, computed } from "vue";
import UseAppointmentCardService from "@/services/useService/useAppointmentCardService";
import UseHistoryService from "@/services/useService/useHistoryService";
import { useChangeCurrencyFormat } from "@/reuse/useChangeCurrencyFormat";
const { formatCurrencyFromDecimalToVND } = useChangeCurrencyFormat();
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useTranslateAppoinmentCardStatus } from "@/reuse/useTranslateAppoinmentCardStatus";
const { translateAppointmentCardStatus } = useTranslateAppoinmentCardStatus();
const { formatDateFromInstantToDateTime, formatDateFromInstantToDate } =
  useChangeDateFormat();
const props = defineProps({
  appointmentCard: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["appoinmentCard:statusChanged"]);
const assignments = ref(null);
const appointmentCard = ref(props.appointmentCard);
const getAssignment = async (appointmentCardId) => {
  assignments.value = await UseAppointmentCardService.getAllAssignments(
    appointmentCardId
  );
};
watch(
  () => props.appointmentCard,
  (newVal) => {
    appointmentCard.value = newVal;
    getAssignment(appointmentCard.value.id);
    updatedHistory.value = null;
    isEligibleForInjection.value = false;
  }
);
const updatedHistory = ref(null);
const isEligibleForInjection = ref(false);
const isConfirmed = ref(false);
const handleEligibleForInjectionToAppointmentCard = async () => {
  await UseAppointmentCardService.patch(appointmentCard.value.id, {
    id: appointmentCard.value.id,
    status: 3,
  });
  updatedHistory.value = await UseHistoryService.create({
    vaccinationDate: new Date().toISOString(),
    appointmentCard: appointmentCard.value,
    patient: appointmentCard.value.patient,
  });
  if (updatedHistory.value) {
    isConfirmed.value = true;
  }

  emits("appoinmentCard:statusChanged");
};

const generateBillTotal = computed(() => {
  let total = 0;
  if (assignments.value) {
    assignments.value.forEach((e) => (total += e.price));
  }
  return total;
});

defineExpose({
  isConfirmed,
});
onMounted(() => {
  getAssignment(appointmentCard.value.id);
});
</script>
<template>
  <div class="row">
    <div class="col-md-12 col-lg-6 space-y-5">
      <table class="table">
        <tr>
          <td colspan="2">
            <span class="text-primary fw-bold">
              -- <i class="fa-solid fa-paperclip me-1"></i> Thông tin phiếu tiêm
              --
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
        <tr class="mb-2">
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
        <th class="d-none d-md-table-cell">Ghi chú</th>
        <th class="d-none d-md-table-cell">Đơn giá</th>
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
        <td>{{ assignment.note ?? "Không có ghi chú" }}</td>
        <td>{{ formatCurrencyFromDecimalToVND(assignment.price) }}</td>
      </tr>
      <tr>
        <td colspan="6" class="text-end fw-bold fs-md">TỔNG TIỀN</td>
        <td>
          {{ formatCurrencyFromDecimalToVND(generateBillTotal) }}
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="updatedHistory == null && !isConfirmed">
    <div class="alert alert-warning d-flex align-items-center" role="alert">
      <div class="flex-grow-1 ms-3">
        <p class="mb-0 fw-bold">
          Lưu ý: Vui lòng kiểm tra thông tin phiếu tiêm. <br />
          + Nếu thông tin có sai sót, vui lòng liên hệ đến nhân viên chuẩn đoán
          (chỉ định tiêm) để sửa chửa theo yêu cầu! <br />+ Nếu thông tin đều
          chính xác, sau khi thanh toán thành công (đối với tiêm chủng dịch vụ),
          vui lòng chọn
          <span class="text-danger">Đủ điều kiện tiêm chủng</span> để tiến hành
          giai đoạn tiêm chủng.
        </p>
      </div>
    </div>
    <label for="check" class="mb-2">
      <input
        type="checkbox"
        @change="isEligibleForInjection = !isEligibleForInjection"
        name="check"
        :checked="isEligibleForInjection"
      />
      Đã đủ điều kiện tiêm chủng
    </label>
    <br />
    <button
      class="btn btn-primary mb-3"
      v-if="isEligibleForInjection"
      @click="handleEligibleForInjectionToAppointmentCard"
    >
      Chấp nhận tiêm
    </button>
  </div>
  <div v-else>
    <div
      class="alert alert-success d-flex align-items-center animated bounceInRight"
      role="alert"
    >
      <div class="flex-grow-1 ms-3">
        <p class="mb-0 fw-bold">
          Đã xác nhận phiếu tiêm, có thể tiến hành tiêm chủng cho trẻ!
        </p>
      </div>
    </div>
  </div>
</template>
