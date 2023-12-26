<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, watch } from "vue";
import SelectVaccineLotBox from "../vaccineLots/SelectVaccineLotBox.vue";
import useDiagnosisService from "@/services/useService/useDiagnosisService";
import SelectInjection from "../injections/SelectInjection.vue";
import { useChangeDistanceDayType } from "@/reuse/useChangeDistanceDateType";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import moment from "moment";
const props = defineProps({
  assignment: {
    type: Object,
    required: true,
  },
  appointmentCard: {
    type: Object,
    required: true,
  },
});

const { forecastDateString } = useChangeDistanceDayType();

const emits = defineEmits(["submit:assignment"]);
const assignmentLocal = ref(props.assignment);
assignmentLocal.value.vaccineLot = props.assignment
  ? props.assignment.vaccineLot
  : null;
const maxDosage = ref(null);
watch(
  () => maxDosage.value,
  (newVal) => {
    console.log("change max dosage");
    console.log(newVal);
    assignmentLocal.value.dosage = newVal;
  }
);
const assignmentFormSchema = yup.object().shape({
  route: yup.string().required("Chưa nhập vị trí tiêm"),
  injectionTime: yup
    .number()
    .required("Chưa nhập mũi tiêm")
    .min(1, "Mũi tiêm phải lớn hơn 1"),
  vaccineLot: yup.object().required("Chưa chọn vắc xin tiêm"),
  maxDosage: yup
    .number()
    .required("Không tìm thấy liều lượng chỉ định của vắc xin"),
  dosage: yup
    .number()
    .required("Chưa nhập liều lượng")
    .min(0.05, "Liều lượng không được nhỏ hơn 0.05 ml")
    .test("is-availble", `Liệu lượng không hợp lệ`, function (value) {
      const { maxDosage } = this.parent;
      console.log("checker");
      console.log(maxDosage);
      console.log(value);
      console.log(value != maxDosage.value);
      return (
        value <= maxDosage ||
        this.createError({
          path: "dosage",
          message: `Liều lượng vắc xin không được lớn hơn ${maxDosage} ml`,
        })
      );
    }),
  nextAvailableInjectionDate: yup
    .date()
    .required("Chưa chọn thời gian tiêm tiếp theo")
    .min(new Date(Date.now()) + 1, "Ngày tiêm phải lớn hơn ngày hiện tại"),
});
console.log(new Date(Date.now()));
const confirmStep1 = ref(false);
const confirmStep2 = ref(false);
const submitAssignment = () => {
  const submitData = {};
  if (assignmentLocal.value.id == null || assignmentLocal.value.id < 1) {
    submitData.route = assignmentLocal.value.route;
    submitData.injectionTime = assignmentLocal.value.injectionTime;
    submitData.appointmentCard = props.appointmentCard;
    submitData.vaccineLot = assignmentLocal.value.vaccineLot;
    submitData.status = 0;
    submitData.price = assignmentLocal.value.vaccineLot.salePrice;
    submitData.injectionCompletionTime = null;
    submitData.injection = assignmentLocal.value.injection;
    submitData.dosage = assignmentLocal.value.dosage;
    submitData.note = assignmentLocal.value.note;
    submitData.nextAvailableInjectionDate = new Date(
      assignmentLocal.value.nextAvailableInjectionDate
    ).toISOString();
    emits("submit:assignment", submitData);
  }
};

watch(
  () => props.assignment,
  (newVal) => {
    if (newVal.vaccineLot) {
      assignmentLocal.value.vaccineLot = newVal.vaccineLot;
    } else {
      assignmentLocal.value.vaccineLot = null;
    }
    console.log(assignmentLocal.value.vaccineLot);
  }
);
const checkerLog = ref(null);
const listCheckerLog = ref(null);
const requestTestApproriateVaccineLot = async (data, appointmentCardId) => {
  checkerLog.value = null;
  listCheckerLog.value = null;
  const dataResult = await useDiagnosisService.checkVaccineLot(
    data.id,
    appointmentCardId
  );
  if (Array.isArray(dataResult)) {
    listCheckerLog.value = dataResult;
    console.log(listCheckerLog.value);
  } else {
    checkerLog.value = dataResult;
  }
  if (
    checkerLog.value &&
    (checkerLog.value.type == "PRIMARY" || checkerLog.value.type == "WARNING")
  ) {
    assignmentLocal.value.vaccineLot = data;
  }
  if (listCheckerLog.value && listCheckerLog.value.length > 0) {
    assignmentLocal.value.vaccineLot = data;
  }
};
const handleSelectedVaccineLot = (data) => {
  if (data.id) {
    requestTestApproriateVaccineLot(data, props.appointmentCard.id);
    console.log("dosage data:");
    console.log(data);
    maxDosage.value = data.vaccine.dosage;
  }
};

watch(
  () => checkerLog.value,
  (newVal) => {
    if (newVal && newVal.type == "PRIMARY") {
      confirmStep1.value = true;
    } else {
      confirmStep1.value = false;
    }
  }
);

const handleRemoveSelectedVaccineLot = () => {
  confirmStep1.value = false;
  confirmStep2.value = false;
  assignmentLocal.value.vaccineLot = null;
};

const handleConfirmWarning = () => {
  confirmStep1.value = true;
};

watch(
  () => assignmentLocal.value.vaccineLot,
  (newVal) => {
    if (newVal) {
      console.log(newVal.vaccine.id);
    }
  }
);

const resetAll = () => {
  checkerLog.value = null;
  listCheckerLog.value = null;
  if (assignmentLocal.value.vaccineLot) {
    assignmentLocal.value.vaccineLot = null;
  }
  if (assignmentLocal.value.injection) {
    assignmentLocal.value.injection = null;
  }
  if (assignmentLocal.value.injectionTime) {
    assignmentLocal.value.injectionTime = null;
  }
  assignmentLocal.value.note = null;
  assignmentLocal.value.route = null;
  confirmStep1.value = false;
  confirmStep2.value = false;
};

const handleGetSubmitStep2 = (obData) => {
  assignmentLocal.value.injection = obData.injection;
  assignmentLocal.value.injectionTime = obData.optional.injectionTime;
  if (assignmentLocal.value.injection) {
    assignmentLocal.value.nextAvailableInjectionDate = forecastDateString(
      new Date(),
      assignmentLocal.value.injection.distanceFromPrevious,
      assignmentLocal.value.injection.distanceFromPreviousType
    ).format("YYYY-MM-DD HH:mm");
  } else {
    assignmentLocal.value.nextAvailableInjectionDate = undefined;
  }
  confirmStep2.value = true;
};

defineExpose({
  resetAll,
});
</script>

<template>
  <Form
    @submit="submitAssignment"
    :validation-schema="assignmentFormSchema"
    class="space-y-4"
    v-slot="{ errors }"
  >
    <ul
      class="timeline timeline-alt"
      :class="{
        'timeline-centered': false,
      }"
    >
      <li class="timeline-event">
        <div
          class="timeline-event-icon"
          :class="[errors.vaccineLot ? 'bg-danger' : 'bg-smooth']"
        >
          1
        </div>
        <BaseBlock
          title="Chọn vắc xin"
          class="timeline-event-block"
          :class="[errors.vaccineLot ? 'border border-danger' : '']"
        >
          <template #options>
            <div
              class="timeline-event-time block-options-item fs-sm fw-semibold"
            >
              Vui lòng chọn 1 vắc xin cần tiêm
            </div>
          </template>

          <SelectVaccineLotBox
            @selected:vaccineLot="handleSelectedVaccineLot"
            :assignmentVaccineLot="assignmentLocal.vaccineLot"
          />
          <div
            class="alert alert-success d-flex align-items-center"
            role="alert"
            v-if="
              assignmentLocal.vaccineLot &&
              checkerLog &&
              checkerLog.type == 'PRIMARY'
            "
          >
            <div class="flex-shrink-0">
              <i class="fa fa-fw fa-check"></i>
            </div>
            <div class="flex-grow-1 ms-3">
              <p class="mb-0 fw-bold">Đã chọn vắc xin</p>

              <div class="bg-white rounded m-0">
                <span class="p-1">
                  Tên vắc xin:&nbsp;
                  {{ assignmentLocal.vaccineLot.vaccine.name }}
                </span>
                <br />
                <span class="p-1">
                  Mã lô vắc xin:&nbsp;
                  {{ assignmentLocal.vaccineLot.lotCode }}
                </span>
                <br />
                <span class="p-1">
                  Phòng bệnh:&nbsp;
                  {{
                    assignmentLocal.vaccineLot.vaccine.diseases
                      .map((d) => d.name)
                      .join("; ")
                  }}
                </span>
              </div>
              <button
                class="btn btn-danger m-1"
                type="button"
                @click="handleRemoveSelectedVaccineLot"
              >
                <i class="fa-solid fa-ban"></i>
              </button>
            </div>
          </div>
          <div
            class="alert alert-warning d-flex align-items-center"
            role="alert"
            v-if="
              assignmentLocal.vaccineLot &&
              ((checkerLog && checkerLog.type == 'WARNING') ||
                (listCheckerLog && listCheckerLog.length > 0))
            "
          >
            <div class="flex-shrink-0">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div class="flex-grow-1 ms-3">
              <p class="mb-0 fw-bold">Chỉ định tiêm có tính tương tác cao!</p>
              <p class="mb-0 fw-bold">
                Bác sĩ chuẩn đoán cần chuẩn đoán kỹ trước khi chỉ định vắc xin
                này! Chọn tiếp tục để đến bước tiếp theo
              </p>

              Vắc xin đã chọn:
              <div class="bg-white rounded m-0">
                <span class="p-1">
                  Tên vắc xin:&nbsp;
                  {{ assignmentLocal.vaccineLot.vaccine.name }}
                </span>
                <br />
                <span class="p-1">
                  Mã lô vắc xin:&nbsp;
                  {{ assignmentLocal.vaccineLot.lotCode }}
                </span>
                <br />
                <span class="p-1">
                  Phòng bệnh:&nbsp;
                  {{
                    assignmentLocal.vaccineLot.vaccine.diseases
                      .map((d) => d.name)
                      .join("; ")
                  }}
                </span>
              </div>
              Lưu ý:
              <div
                class="bg-white rounded m-0 p-2"
                v-if="checkerLog && checkerLog.type == 'WARNING'"
              >
                {{ checkerLog.message }}
              </div>
              <div
                class="bg-white rounded m-0"
                v-if="listCheckerLog && listCheckerLog.length > 0"
              >
                <div v-for="checker in listCheckerLog" :key="checker">
                  <span class="p-2">
                    {{ checker.message }}
                  </span>
                  <br />
                </div>
              </div>
              <button
                class="btn btn-danger m-1"
                type="button"
                @click="handleRemoveSelectedVaccineLot"
              >
                <i class="fa-solid fa-ban"></i>
              </button>
              <button
                class="btn btn-alt-secondary m-1"
                type="button"
                @click="handleConfirmWarning"
                v-if="!confirmStep1"
              >
                Tiếp tục >
              </button>
            </div>
          </div>
          <div
            class="alert alert-danger d-flex align-items-center"
            role="alert"
            v-if="checkerLog && checkerLog.type == 'DANGER'"
          >
            <div class="flex-shrink-0">
              <i class="fa-solid fa-land-mine-on"></i>
            </div>
            <div class="flex-grow-1 ms-3">
              <p class="mb-0 fw-bold">Vắc xin chống chỉ định!</p>
              <p class="mb-0 fw-bold">Nguyên nhân: {{ checkerLog.message }}</p>
            </div>
          </div>

          <div
            class="alert alert-danger d-flex align-items-center"
            role="alert"
            v-if="
              (errors.vaccineLot &&
                checkerLog &&
                checkerLog.type == 'DANGER') ||
              (errors.vaccineLot && !checkerLog)
            "
          >
            <div class="flex-shrink-0">
              <i class="fa-solid fa-exclamation"></i>
            </div>
            <div class="flex-grow-1 ms-3">
              <p class="mb-0 fw-bold">{{ errors.vaccineLot }}</p>
            </div>
          </div>
        </BaseBlock>
      </li>
      <li class="timeline-event" :class="confirmStep1 == false ? 'd-none' : ''">
        <div class="timeline-event-icon bg-smooth">2</div>
        <BaseBlock title="Xác định mũi tiêm" class="timeline-event-block">
          <template #options>
            <div
              class="timeline-event-time block-options-item fs-sm fw-semibold"
            >
              Xác định mũi tiêm
            </div>
          </template>

          <div class="row">
            <SelectInjection
              v-if="assignmentLocal.vaccineLot"
              :vaccineId="assignment.vaccineLot.vaccine.id"
              :appointmentCardId="appointmentCard.id"
              ref="SelectInjectionRef"
              @submit:step2="handleGetSubmitStep2"
            />
          </div>
        </BaseBlock>
      </li>

      <li class="timeline-event" :class="confirmStep2 == false ? 'd-none' : ''">
        <div
          class="timeline-event-icon"
          :class="[
            errors.route || errors.injectionTime ? 'bg-danger' : 'bg-smooth',
          ]"
        >
          3
        </div>
        <BaseBlock
          title="Chỉ định tiêm"
          class="timeline-event-block"
          :class="[
            errors.route || errors.injectionTime ? 'border border-danger' : '',
          ]"
        >
          <template #options>
            <div
              class="timeline-event-time block-options-item fs-sm fw-semibold"
            >
              Nhập vào các chỉ định tiêm
            </div>
          </template>

          <div class="row">
            <div class="col-md-4 my-1 d-none">
              <label for="vaccineLot"
                >Mã vắc xin <span class="text-danger">*</span></label
              >
              <Field
                type="text"
                name="vaccineLot"
                class="form-control my-1"
                v-model="assignmentLocal.vaccineLot"
                placeholder="Vị trí tiêm..."
                disabled
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="injectionTime"
                >Lần tiêm <span class="text-danger">*</span></label
              >
              <Field
                type="text"
                name="injectionTime"
                class="form-control my-1"
                v-model="assignmentLocal.injectionTime"
                placeholder="Vị trí tiêm..."
                disabled
              />
              <ErrorMessage
                name="injectionTime"
                class="animated fadeIn text-danger"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="route"
                >Vị trí tiêm <span class="text-danger">*</span></label
              >
              <Field
                type="text"
                name="route"
                class="form-control my-1"
                v-model="assignmentLocal.route"
                placeholder="Vị trí tiêm..."
              />
              <ErrorMessage name="route" class="animated fadeIn text-danger" />
            </div>
            <div class="col-md-6 my-1 d-none">
              <label for="maxDosage"
                >Liều lượng tối đa<span class="text-danger">*</span></label
              >
              <Field
                type="number"
                name="maxDosage"
                class="form-control my-1"
                v-model="maxDosage"
                placeholder="0.1"
                step="0.1"
                min="0.1"
                disabled
              />
              <ErrorMessage
                name="maxDosage"
                class="animated fadeIn text-danger"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="dosage"
                >Liều lượng
                <span class="text-danger"
                  >* (tối đa không quá: {{ maxDosage }}) ml</span
                >
              </label>
              <Field
                type="number"
                name="dosage"
                class="form-control my-1"
                v-model="assignmentLocal.dosage"
                placeholder="0.1"
                step="0.1"
                min="0.1"
              />
              <ErrorMessage name="dosage" class="animated fadeIn text-danger" />
            </div>
            <div class="col-md-6 my-1">
              <label for="nextAvailableInjectionDate"
                >Ngày tiêm khả dụng kế tiếp
                <span class="text-danger"> *</span></label
              >
              <Field
                type="datetime-local"
                name="nextAvailableInjectionDate"
                class="form-control my-1"
                v-model="assignmentLocal.nextAvailableInjectionDate"
                placeholder="Ngày hẹn..."
                :disabled="assignmentLocal.injection"
              />
              <ErrorMessage
                name="nextAvailableInjectionDate"
                class="animated fadeIn text-danger"
              />
            </div>
            <div class="col-md-12 my-1 mb-3">
              <label for="Ghi chú mũi tiêm">Ghi chú</label>
              <Field
                as="textarea"
                name="note"
                class="form-control my-1"
                v-model="assignmentLocal.note"
                placeholder="Thêm ghi chú"
                step="1"
                min="0"
                col="3"
              />
              <ErrorMessage name="note" class="animated fadeIn text-danger" />
            </div>
          </div>
        </BaseBlock>
      </li>
    </ul>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <div
          class="alert alert-warning d-flex align-items-center"
          role="alert"
          v-if="errors.vaccineLot || errors.route || errors.injectionTime"
        >
          <div class="flex-shrink-0">
            <i class="fa-solid fa-exclamation"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="mb-0 fw-bold">
              Vui lòng chọn đầy đủ các thông tin trước khi lưu chỉ định
            </p>
          </div>
        </div>
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!assignment.id"
          class="btn btn-outline-secondary mr-0"
          type="reset"
          @click="resetAll"
        >
          Đặt lại
        </button>
      </div>
    </div>
  </Form>
</template>
<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>
