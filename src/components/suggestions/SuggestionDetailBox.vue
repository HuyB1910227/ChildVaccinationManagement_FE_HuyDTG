<script setup>
import { watch, ref } from "vue";
import UseDiagnosisService from "@/services/useService/useDiagnosisService";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useChangeDistanceDayType } from "../../reuse/useChangeDistanceDateType";
import { RequestAgeType } from "../../data/requestAgeType";
const props = defineProps({
  diseaseId: {
    type: Number,
  },
  appointmentCardId: {
    type: Number,
  },
});
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const diseaseId = ref(props.diseaseId);
const { forecastDateString } = useChangeDistanceDayType();
const theLastAssignment = ref(null);
watch(
  () => props.diseaseId,
  (newVal) => {
    diseaseId.value = newVal;
    if (diseaseId.value > 0) {
      retriveSuggestionForDiseaseDetail(
        props.appointmentCardId,
        diseaseId.value
      );
    }
  }
);
const suggestionDetails = ref(null);
const retriveSuggestionForDiseaseDetail = async (
  appointmentCardId,
  diseaseId
) => {
  suggestionDetails.value =
    await UseDiagnosisService.getSuggestionDetailByDisease(
      appointmentCardId,
      diseaseId
    );
  if (suggestionDetails.value.previousAssignments.length > 0) {
    theLastAssignment.value =
      suggestionDetails.value.previousAssignments[
        suggestionDetails.value.previousAssignments.length - 1
      ];
  }
};
</script>

<template>
  <div v-if="diseaseId > 0 && suggestionDetails">
    <div class="card p-2">
      <table class="table">
        <tr>
          <td style="width: 200px">Mã dịch bệnh:</td>
          <td>{{ suggestionDetails.currentDisease.id }}</td>
        </tr>
        <tr>
          <td>Tên dịch bệnh:</td>
          <td>{{ suggestionDetails.currentDisease.name }}</td>
        </tr>
        <tr>
          <td>Mô tả:</td>
          <td>{{ suggestionDetails.currentDisease.description }}</td>
        </tr>
      </table>
    </div>
    <hr />
    <div
      class="card mb-3 p-2 bg-success"
      v-for="(assignment, index) in suggestionDetails.previousAssignments"
      :key="assignment.id"
    >
      <div class="d-flex align-items-center">
        <div class="flex-grow-0 bg-success">
          <div class="text-center text-white pe-2">
            <h3>{{ ++index }}</h3>
          </div>
        </div>
        <div class="flex-grow-1 border bg-white">
          <div class="card-body p-1">
            <div class="row">
              <div class="col-6">{{ assignment.vaccineLot.vaccine.name }}</div>
              <div class="col-6 text-end">
                {{
                  formatDateFromInstantToDateTime(
                    assignment.injectionCompletionTime
                  )
                }}
              </div>
            </div>
            <h5 class="card-title"></h5>
            <div class="card-text">
              <table class="table">
                <tr>
                  <td style="width: 200px">Mã lô:</td>
                  <td>{{ assignment.vaccineLot.lotCode }}</td>
                </tr>
                <tr>
                  <td>Liều lượng:</td>
                  <td>{{ assignment.dosage }} ml</td>
                </tr>
                <tr>
                  <td>Vị trí tiêm:</td>
                  <td>{{ assignment.route }}</td>
                </tr>
                <tr v-if="assignment.injection != null">
                  <td>Loại mũi tiêm:</td>
                  <td>
                    {{
                      assignment.injection.age.requestType ==
                      RequestAgeType.TIEU_CHUAN
                        ? "Mũi tiêm tiêu chuẩn"
                        : "Mũi tiêm khuyến cáo"
                    }}
                  </td>
                </tr>
                <tr v-else>
                  <td>Loại mũi tiêm:</td>
                  <td>
                    {{
                      assignment.nextAvailableInjectionDate != null
                        ? "Tiêm theo chỉ định của bác sĩ"
                        : "Không xác định"
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Ghi chú:</td>
                  <td>{{ assignment.note ?? "Không có ghi chú" }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="card mb-3 p-2 bg-primary"
      v-if="suggestionDetails.currentAssignment"
    >
      <div class="d-flex align-items-center">
        <div class="flex-grow-0 bg-primary">
          <div class="text-center text-white pe-2">
            <i class="fa-solid fa-clipboard-check"></i>
          </div>
        </div>
        <div class="flex-grow-1 border bg-white">
          <div class="card-body p-1">
            <div class="row">
              <div class="col-6">
                {{
                  suggestionDetails.currentAssignment.vaccineLot.vaccine.name
                }}
              </div>
              <div class="col-6 text-end">
                {{
                  suggestionDetails.currentAssignment.injectionCompletionTime
                    ? formatDateFromInstantToDateTime(
                        suggestionDetails.currentAssignment
                          .injectionCompletionTime
                      )
                    : "Chưa tiêm"
                }}
              </div>
            </div>
            <h5 class="card-title"></h5>
            <div class="card-text">
              <table class="table">
                <tr>
                  <td style="width: 200px">Mã lô:</td>
                  <td>
                    {{ suggestionDetails.currentAssignment.vaccineLot.lotCode }}
                  </td>
                </tr>
                <tr>
                  <td>Liều lượng:</td>
                  <td>{{ suggestionDetails.currentAssignment.dosage }} ml</td>
                </tr>
                <tr>
                  <td>Vị trí tiêm:</td>
                  <td>{{ suggestionDetails.currentAssignment.route }}</td>
                </tr>
                <tr
                  v-if="suggestionDetails.currentAssignment.injection != null"
                >
                  <td>Loại mũi tiêm:</td>
                  <td>
                    {{
                      suggestionDetails.currentAssignment.injection.age
                        .requestType == RequestAgeType.TIEU_CHUAN
                        ? "Mũi tiêm tiêu chuẩn"
                        : "Mũi tiêm khuyến cáo"
                    }}
                  </td>
                </tr>
                <tr v-else>
                  <td>Loại mũi tiêm:</td>
                  <td>
                    {{
                      suggestionDetails.currentAssignment
                        .nextAvailableInjectionDate != null
                        ? "Tiêm theo chỉ định của bác sĩ"
                        : "Không xác định"
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Ghi chú:</td>
                  <td>
                    {{
                      suggestionDetails.currentAssignment.note ??
                      "Không có ghi chú"
                    }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <div class="text-primary text-center"><h4>Vắc xin phòng bệnh</h4></div>
    <div>
      <table class="table table-bordered table-striped">
        <tr>
          <th>Tên vắc xin</th>
          <th>Phòng bệnh</th>
        </tr>
        <template v-if="suggestionDetails.currentDisease.vaccines">
          <tr
            v-for="vaccine in suggestionDetails.currentDisease.vaccines"
            :key="vaccine.id"
          >
            <td>{{ vaccine.name }}</td>
            <td>{{ vaccine.diseases.map((d) => d.name).join(" ; ") }}</td>
          </tr>
        </template>
      </table>
    </div>

    <div
      v-if="
        theLastAssignment && suggestionDetails.previousAssignments.length > 0
      "
    >
      Ngày tiêm khả dụng tiếp theo:

      {{
        theLastAssignment.injection != null
          ? forecastDateString(
              theLastAssignment.injectionCompletionTime,
              theLastAssignment.injection.distanceFromPrevious,
              theLastAssignment.injection.distanceFromPreviousType
            ).format("HH:mm DD/MM/YYYY")
          : formatDateFromInstantToDateTime(
              theLastAssignment.nextAvailableInjectionDate
            )
      }}
    </div>
  </div>
</template>
