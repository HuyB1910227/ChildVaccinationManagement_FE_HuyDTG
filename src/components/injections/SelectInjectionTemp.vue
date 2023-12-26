<script setup>
import { useAgeStore } from "@/stores/AgeStore";
import useDiagnosisService from "@/services/useService/useDiagnosisService";
import { watch, ref, onMounted, computed } from "vue";
import { useTranslateDistanceTimeType } from "@/reuse/useTranslateDistanceTimeType";
import { useTranslateAgeType } from "@/reuse/useTranslateAgeType";
import { number } from "yup";
import dayjs from "dayjs";
const ageStore = useAgeStore();
const props = defineProps({
  vaccineId: {
    required: true,
    type: String,
  },
  appointmentCardId: {
    required: true,
    type: Number,
  },
  injectionId: {
    required: false,
    type: Number,
  },
});
const { translateToDistanceTimeTypeVN } = useTranslateDistanceTimeType();
const { translateToAgeTypeVN } = useTranslateAgeType();
const selectedInjectionId = ref(null);
const emits = defineEmits(["submit:injectionId"]);
const ageList = ref(null);
const vaccineId = ref(props.vaccineId);
const appointmentCardId = ref(props.appointmentCardId);

const adviseInjection = ref(null);
const retriveAge = async (vacId) => {
  ageList.value = await ageStore.getAllAgeByVaccine(vacId);
};
const retriveEligibleInjection = async (vacId, appId) => {
  adviseInjection.value = await useDiagnosisService.findEligibleInjection(
    vacId,
    appId
  );
  if (adviseInjection.value) {
    selectedInjectionId.value = adviseInjection.value.injectionIdAdvise;
  }
};

watch(
  () => props.vaccineId,
  (newVal) => {
    if (newVal) {
      vaccineId.value = newVal;
      retriveAge(vaccineId.value);
    }
  }
);
const isShowContinueBtn = ref(true);
watch(
  () => props.injectionId,
  (newVal, oldVal) => {
    injectionId.value = newVal;
    if (injectionId.value && injectionId.value > 0 && newVal != oldVal) {
      isShowContinueBtn.value = false;
    }

    console.log("changed");
  }
);
const injectionId = ref(props.injectionId);

const theLastInjection = (injId) => {
  if (
    adviseInjection.value &&
    adviseInjection.value.lastInjections.length > 0
  ) {
    let injectionCompletionTimes = [];
    adviseInjection.value.lastInjections.forEach((li) => {
      if (li.injectionId == injId) {
        injectionCompletionTimes.push(li.injectionCompletionTime);
      }
    });

    console.log(injectionCompletionTimes);
    if (injectionCompletionTimes.length > 0) {
      let stringInjectionCompletionTimes = injectionCompletionTimes
        .map((i) => dayjs(i).format("HH:mm DD/MM/YYYY"))
        .join("; ");
      return "Đã tiêm: " + stringInjectionCompletionTimes;
    }
    return null;
  }
  return null;
};

const updateSelectedInjectionId = (id) => {
  selectedInjectionId.value = id;
};
onMounted(() => {
  retriveAge(vaccineId.value);
  retriveEligibleInjection(vaccineId.value, appointmentCardId.value);
});

const handleEmitInjectionId = () => {
  if (selectedInjectionId.value) {
    console.log(selectedInjectionId.value);
    emits("submit:injectionId", selectedInjectionId.value);
  } else {
    confirm("lỗi");
  }
};
</script>

<template>
  <div
    class="pull-x"
    v-if="adviseInjection && adviseInjection.injectionIdAdvise"
    style="max-height: 600px; overflow-y: auto"
  >
    <table
      class="table table-hover table-vcenter fs-sm"
      v-for="age in ageList"
      :key="age.id"
    >
      <thead>
        <tr>
          <td colspan="4">
            Giai đoạn: Từ {{ age.minAge }}
            {{ translateToAgeTypeVN(age.minAgeType) }} đến
            {{ age.maxAge }}
            {{ translateToAgeTypeVN(age.maxAgeType) }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="injection in age.injections" :key="injection.id">
          <td class="text-center" style="width: 100px">
            <div class="form-check d-inline-block">
              <input
                class="form-check-input"
                type="radio"
                :id="injection.id"
                name="inbox-msg15"
                :checked="adviseInjection.injectionIdAdvise === injection.id"
                :class="
                  adviseInjection.injectionIdAdvise === injection.id
                    ? null
                    : 'd-none'
                "
                @change="updateSelectedInjectionId(injection.id)"
              />
              <label class="form-check-label" for="inbox-msg15"></label>
            </div>
          </td>
          <td class="d-none d-sm-table-cell fw-semibold" style="width: 200px">
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
              v-if="adviseInjection.injectionIdAdvise === injection.id"
              class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info m-1"
            >
              Mũi tiêm tiêu chuẩn
            </span>
            <span
              v-if="theLastInjection(injection.id) !== null"
              class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success text-white m-1"
            >
              {{ theLastInjection(injection.id) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button
        class="btn btn-primary"
        @click="handleEmitInjectionId"
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
</template>
