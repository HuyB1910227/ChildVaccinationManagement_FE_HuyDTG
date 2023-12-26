<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { useTranslateAgeType } from "@/reuse/useTranslateAgeType";
import { useTranslateDistanceTimeType } from "@/reuse/useTranslateDistanceTimeType";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import useDiagnosisService from "@/services/useService/useDiagnosisService";
import { RequestAgeType } from "@/data/requestAgeType";
import dayjs from "dayjs";

const props = defineProps({
  vaccineId: {
    required: true,
    type: String,
  },
  appointmentCardId: {
    required: true,
    type: Number,
  },
});
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const vaccineId = ref(props.vaccineId);
const appointmentCardId = ref(props.appointmentCardId);
const { translateToDistanceTimeTypeVN } = useTranslateDistanceTimeType();
const { translateToAgeTypeVN } = useTranslateAgeType();
const incentive = ref(null);
const ageEligible = ref(null);
const submitStep2 = reactive({
  injection: null,
  optional: null,
});

const initSelectedInjection = (injectionData, optionalData) => {
  submitStep2.injection = injectionData;
  submitStep2.optional = optionalData;
};
const retriveEligibleInjection = async (vacId, appId) => {
  incentive.value = await useDiagnosisService.findEligibleInjection(
    vacId,
    appId
  );
  if (incentive.value) {
    if (incentive.value.ageEligible) {
      ageEligible.value = incentive.value.ageEligible;
      if (
        ageEligible.value.requestType == RequestAgeType.TIEU_CHUAN ||
        ageEligible.value.requestType == RequestAgeType.KHUYEN_CAO
      ) {
        if (incentive.value.injectionAdvise) {
          let t = null;
          if (incentive.value.injectionAdvise.injectionIdAdvise) {
            ageEligible.value.injections.forEach((injection) => {
              if (
                injection.id ==
                incentive.value.injectionAdvise.injectionIdAdvise
              ) {
                t = injection;
              }
            });
            initSelectedInjection(t, {
              injectionTime:
                incentive.value.injectionAdvise.injectionTimeIdAdvise,
            });
          }
        } else {
          initSelectedInjection(null, null);
        }
      } else if (ageEligible.value.requestType == RequestAgeType.TUY_CHON) {
        console.log("dô");
        initSelectedInjection(null, {
          injectionTime: incentive.value.injectionAdvise.injectionTimeIdAdvise,
        });
      }
    } else {
      ageEligible.value = null;
    }
  }
};

const changeInjectionForSubmitStep2 = (injection) => {
  submitStep2.injection = injection;
};

const theLastInjection = (injId, list) => {
  let injectionCompletionTimes = [];
  list.forEach((li) => {
    if (li.injectionId == injId) {
      injectionCompletionTimes.push(li.injectionCompletionTime);
    }
  });

  if (injectionCompletionTimes.length > 0) {
    let stringInjectionCompletionTimes = injectionCompletionTimes
      .map((i) => dayjs(i).format("HH:mm DD/MM/YYYY"))
      .join("; ");
    return "Đã tiêm: " + stringInjectionCompletionTimes;
  }
  return null;
};
const emits = defineEmits(["submit:step2"]);
const isShowContinueBtn = ref(true);
const handleUpdateSubmitStep2 = () => {
  if (submitStep2.optional == null) {
    alert("Đã xảy ra lỗi đối với xác định mũi tiêm! Vui lòng thử lại sau.");
  } else {
    emits("submit:step2", submitStep2);
    isShowContinueBtn.value = false;
  }
};
defineExpose({
  isShowContinueBtn,
});

onMounted(() => {
  retriveEligibleInjection(vaccineId.value, appointmentCardId.value);
});
</script>

<template>
  <div v-if="ageEligible && incentive">
    <div>
      <p>
        Độ tuổi hiện tại:
        <span class="fw-bold text-primary"
          >{{ incentive.ageOfPatient.age }}
          {{ translateToAgeTypeVN(incentive.ageOfPatient.ageType) }}</span
        >
      </p>
    </div>
    <div
      v-if="ageEligible.requestType == RequestAgeType.TUY_CHON"
      class="pull-x"
      style="max-height: 600px; overflow-y: auto"
    >
      <div v-if="incentive.lastAges">
        <table
          class="table table-hover table-vcenter fs-md"
          v-for="lastAge in incentive.lastAges"
          :key="lastAge.id"
        >
          <thead>
            <tr>
              <td colspan="4" class="m-0">
                <div
                  class="rounded p-3 m-0"
                  :class="[
                    ageEligible.id == lastAge.id
                      ? 'bg-success-light'
                      : 'bg-black-25',
                  ]"
                >
                  <div class="d-flex justify-content-between">
                    <span>
                      Giai đoạn: Từ
                      <span class="fw-bold"
                        >{{ lastAge.minAge }}
                        {{ translateToAgeTypeVN(lastAge.minAgeType) }}</span
                      >
                      đến
                      <span class="fw-bold">
                        {{ lastAge.maxAge }}
                        {{ translateToAgeTypeVN(lastAge.maxAgeType) }}
                      </span>
                    </span>
                    <span>
                      Loại mũi tiêm:
                      <span class="fw-bold">
                        {{
                          lastAge.requestType == RequestAgeType.TIEU_CHUAN
                            ? "BẮT BUỘC TUÂN THỦ"
                            : lastAge.requestType == RequestAgeType.KHUYEN_CAO
                            ? "CÓ THỂ THAY ĐỔI"
                            : "YÊU CẦU CHỈ ĐỊNH TỪ BÁC SĨ"
                        }}
                      </span>
                    </span>
                  </div>
                  <span>Ghi chú: {{ lastAge.note ?? "Không có ghi chú" }}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <template v-if="incentive.injectionAdvise.lastInjections">
              <tr
                v-for="lastInjection in incentive.injectionAdvise
                  .lastInjections"
                :key="lastInjection.assignmentId"
              >
                <td>Lần tiêm: {{ lastInjection.injectionTime }}</td>
                <td>
                  Đã tiêm:
                  {{
                    formatDateFromInstantToDateTime(
                      lastInjection.injectionCompletionTime
                    )
                  }}
                </td>
                <td>
                  <span
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info m-1"
                  >
                    Mũi tiêm theo chỉ định của bác sĩ
                  </span>
                </td>
              </tr>
              <tr>
                <td style="width: 300px">
                  <span v-if="submitStep2.optional">
                    Lần tiêm:
                    {{ submitStep2.optional.injectionTime }}
                  </span>
                  <span v-else>Không tim thấy mũi tiêm hợp lệ</span>
                </td>
                <td>
                  <div class="text-danger">
                    Bác sĩ vui lòng chọn ngày tiêm kế tiếp ở bước tiếp theo!
                  </div>
                </td>
                <td>
                  <span
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning m-1"
                  >
                    Bác sĩ chỉ định
                  </span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div>
          <button
            class="btn btn-primary"
            @click="handleUpdateSubmitStep2"
            v-if="isShowContinueBtn"
          >
            Tiếp tục
          </button>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-warning d-flex align-items-center" role="alert">
          <div class="flex-shrink-0">
            <i class="fa-solid fa-exclamation"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="mb-0 fw-bold">
              Chưa đến thời điểm tiêm chủng cho trẻ! Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="ageEligible.requestType == RequestAgeType.KHUYEN_CAO"
      class="pull-x"
      style="max-height: 600px; overflow-y: auto"
    >
      <div v-if="incentive.lastAges">
        <table
          class="table table-hover table-vcenter fs-md"
          v-for="lastAge in incentive.lastAges"
          :key="lastAge.id"
        >
          <thead>
            <tr>
              <td colspan="4" class="m-0">
                <div
                  class="rounded p-3 m-0"
                  :class="[
                    ageEligible.id == lastAge.id
                      ? 'bg-success-light'
                      : 'bg-black-25',
                  ]"
                >
                  <div class="d-flex justify-content-between">
                    <span>
                      Giai đoạn: Từ
                      <span class="fw-bold"
                        >{{ lastAge.minAge }}
                        {{ translateToAgeTypeVN(lastAge.minAgeType) }}</span
                      >
                      đến
                      <span class="fw-bold">
                        {{ lastAge.maxAge }}
                        {{ translateToAgeTypeVN(lastAge.maxAgeType) }}
                      </span>
                    </span>
                    <span>
                      Loại mũi tiêm:
                      <span class="fw-bold">
                        {{
                          lastAge.requestType == RequestAgeType.TIEU_CHUAN
                            ? "BẮT BUỘC TUÂN THỦ"
                            : lastAge.requestType == RequestAgeType.KHUYEN_CAO
                            ? "CÓ THỂ THAY ĐỔI"
                            : "YÊU CẦU CHỈ ĐỊNH TỪ BÁC SĨ"
                        }}
                      </span>
                    </span>
                  </div>
                  <span>Ghi chú: {{ lastAge.note ?? "Không có ghi chú" }}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="injection in lastAge.injections" :key="injection.id">
              <td class="text-center" style="width: 100px">
                <div class="form-check d-inline-block">
                  <input
                    class="form-check-input"
                    type="radio"
                    :id="injection.id"
                    name="inbox-msg15"
                    :checked="
                      incentive.injectionAdvise &&
                      incentive.injectionAdvise.injectionIdAdvise ===
                        injection.id
                    "
                    :class="ageEligible.id == lastAge.id ? null : 'd-none'"
                    @change="changeInjectionForSubmitStep2(injection)"
                  />
                  <label class="form-check-label" for="inbox-msg15"></label>
                </div>
              </td>
              <td
                class="d-none d-sm-table-cell fw-semibold"
                style="width: 200px"
              >
                Mũi tiêm: {{ injection.injectionTime }}
              </td>
              <td style="width: 200px">
                <div class="fw-semibold text-primary">
                  {{ injection.distanceFromPrevious }}
                  {{
                    translateToDistanceTimeTypeVN(
                      injection.distanceFromPreviousType
                    )
                  }}
                </div>
              </td>
              <td>
                <span
                  v-if="
                    incentive.injectionAdvise &&
                    incentive.injectionAdvise.injectionIdAdvise === injection.id
                  "
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info m-1"
                >
                  Mũi tiêm khuyến cáo
                </span>
                <span
                  v-if="
                    incentive.injectionAdvise.lastInjections &&
                    incentive.injectionAdvise.lastInjections.length > 0 &&
                    theLastInjection(
                      injection.id,
                      incentive.injectionAdvise.lastInjections
                    )
                  "
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success text-white m-1"
                >
                  {{
                    theLastInjection(
                      injection.id,
                      incentive.injectionAdvise.lastInjections
                    )
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button
            class="btn btn-primary"
            @click="handleUpdateSubmitStep2"
            v-if="isShowContinueBtn"
          >
            Tiếp tục
          </button>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-warning d-flex align-items-center" role="alert">
          <div class="flex-shrink-0">
            <i class="fa-solid fa-exclamation"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="mb-0 fw-bold">
              Chưa đến thời điểm tiêm chủng cho trẻ! Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="pull-x" style="max-height: 600px; overflow-y: auto">
      <div v-if="incentive.lastAges">
        <table
          class="table table-hover table-vcenter fs-md"
          v-for="lastAge in incentive.lastAges"
          :key="lastAge.id"
        >
          <thead>
            <tr>
              <td colspan="4" class="m-0">
                <div
                  class="rounded p-3 m-0"
                  :class="[
                    ageEligible.id == lastAge.id
                      ? 'bg-success-light'
                      : 'bg-black-25',
                  ]"
                >
                  <div class="d-flex justify-content-between">
                    <span>
                      Giai đoạn: Từ
                      <span class="fw-bold"
                        >{{ lastAge.minAge }}
                        {{ translateToAgeTypeVN(lastAge.minAgeType) }}</span
                      >
                      đến
                      <span class="fw-bold">
                        {{ lastAge.maxAge }}
                        {{ translateToAgeTypeVN(lastAge.maxAgeType) }}
                      </span>
                    </span>
                    <span>
                      Loại mũi tiêm:
                      <span class="fw-bold">
                        {{
                          lastAge.requestType == RequestAgeType.TIEU_CHUAN
                            ? "BẮT BUỘC TUÂN THỦ"
                            : lastAge.requestType == RequestAgeType.KHUYEN_CAO
                            ? "CÓ THỂ THAY ĐỔI"
                            : "YÊU CẦU CHỈ ĐỊNH TỪ BÁC SĨ"
                        }}
                      </span>
                    </span>
                  </div>

                  <span>Ghi chú: {{ lastAge.note ?? "Không có ghi chú" }}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="injection in lastAge.injections" :key="injection.id">
              <td class="text-center" style="width: 100px">
                <div class="form-check d-inline-block">
                  <input
                    class="form-check-input"
                    type="radio"
                    :id="injection.id"
                    name="inbox-msg15"
                    :checked="
                      incentive.injectionAdvise &&
                      incentive.injectionAdvise.injectionIdAdvise ===
                        injection.id
                    "
                    :class="
                      incentive.injectionAdvise &&
                      incentive.injectionAdvise.injectionIdAdvise ===
                        injection.id
                        ? null
                        : 'd-none'
                    "
                    @change="updateSelectedInjectionId(injection.id)"
                  />
                  <label class="form-check-label" for="inbox-msg15"></label>
                </div>
              </td>
              <td
                class="d-none d-sm-table-cell fw-semibold"
                style="width: 200px"
              >
                Mũi tiêm: {{ injection.injectionTime }}
              </td>
              <td style="width: 200px">
                <div class="fw-semibold text-primary">
                  {{ injection.distanceFromPrevious }}
                  {{
                    translateToDistanceTimeTypeVN(
                      injection.distanceFromPreviousType
                    )
                  }}
                </div>
              </td>
              <td>
                <span
                  v-if="
                    incentive.injectionAdvise &&
                    incentive.injectionAdvise.injectionIdAdvise === injection.id
                  "
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info m-1"
                >
                  Mũi tiêm tiêu chuẩn
                </span>
                <span
                  v-if="
                    incentive.injectionAdvise.lastInjections &&
                    incentive.injectionAdvise.lastInjections.length > 0 &&
                    theLastInjection(
                      injection.id,
                      incentive.injectionAdvise.lastInjections
                    )
                  "
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success text-white m-1"
                >
                  {{
                    theLastInjection(
                      injection.id,
                      incentive.injectionAdvise.lastInjections
                    )
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button
            class="btn btn-primary"
            @click="handleUpdateSubmitStep2"
            v-if="isShowContinueBtn"
          >
            Tiếp tục
          </button>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-warning d-flex align-items-center" role="alert">
          <div class="flex-shrink-0">
            <i class="fa-solid fa-exclamation"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="mb-0 fw-bold">
              Chưa đến thời điểm tiêm chủng cho trẻ! Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="alert alert-warning d-flex align-items-center" role="alert">
      <div class="flex-shrink-0">
        <i class="fa-solid fa-exclamation"></i>
      </div>
      <div class="flex-grow-1 ms-3">
        <p class="mb-0 fw-bold">
          Chưa đến thời điểm tiêm chủng cho trẻ! Vui lòng thử lại sau.
        </p>
      </div>
    </div>
  </div>
</template>
