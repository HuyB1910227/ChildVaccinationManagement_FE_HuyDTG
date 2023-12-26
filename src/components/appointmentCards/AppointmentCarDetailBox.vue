<script setup>
import { ref } from "vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const props = defineProps({
  appointmentCard: {
    type: Object,
    required: true,
  },
});
const { formatDateFromInstantToDate, formatDateFromInstantToDateTime } =
  useChangeDateFormat();
const appointmentCard = ref(props.appointmentCard);
</script>
<template>
  <BaseBlock title="Thông tin trẻ em" btn-option-content>
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
          <tr>
            <td style="width: 150px">Mã số:</td>
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
            <td>{{ appointmentCard.note }}</td>
          </tr>
          <tr>
            <td>Trạng thái:</td>
            <td>{{ appointmentCard.status == 0 ? "Đã đăng ký" : "Đã hẹn" }}</td>
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
            <td style="width: 150px">Mã số:</td>
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
              <span class="text-primary fw-bold">-- Người giám hộ --</span>
            </td>
          </tr>
          <tr>
            <td style="width: 150px">Mã khách hàng:</td>
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
    </div>
  </BaseBlock>
</template>
