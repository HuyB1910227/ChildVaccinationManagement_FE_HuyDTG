<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, onMounted, reactive, watch } from "vue";
import { useVaccineStore } from "@/stores/VaccineStore";
import { useProviderStore } from "@/stores/ProviderStore";
import VueSelect from "vue-select";
import dayjs from "dayjs";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import { useAuthStore } from "@/stores/AuthStore";
import { VaccinationType } from "@/data/vaccinationType";
import moment from "moment";
const authStore = useAuthStore();
const isAministrator = authStore.hasRole("ADMINISTRATOR");
const props = defineProps({
  vaccineLot: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["submit:vaccineLot"]);
const vaccineLotLocal = ref(props.vaccineLot);
const vaccineStore = useVaccineStore();
const providerStore = useProviderStore();
const immunizationUnitStore = useImmunizationUnitStore();
const optionVaccines = ref(null);
const optionImmunizationUnits = ref(null);
const optionProviders = ref(null);
vaccineLotLocal.value.immunizationUnit = !isAministrator
  ? { id: authStore.immunizationUnitId, name: "Cơ sở đang công tác" }
  : props.vaccineLot != {}
  ? props.vaccineLot.immunizationUnit
  : null;

const retriveOption = async () => {
  optionVaccines.value = await vaccineStore.getFSelect();
  optionImmunizationUnits.value = await immunizationUnitStore.getFSelect();
  optionProviders.value = await providerStore.getFSelect();
};

const changeFromLocalDatetoDate = () => {
  if (props.vaccineLot.manufacturingDate) {
    vaccineLotLocal.value.manufacturingDate = dayjs(
      props.vaccineLot.manufacturingDate
    ).format("YYYY-MM-DD");
  }
  if (props.vaccineLot.expiredDate) {
    vaccineLotLocal.value.expiredDate = dayjs(
      props.vaccineLot.expiredDate
    ).format("YYYY-MM-DD");
  }
  if (props.vaccineLot.transactionDate) {
    vaccineLotLocal.value.transactionDate = dayjs(
      props.vaccineLot.transactionDate
    ).format("YYYY-MM-DD HH:mm");
  }
};

const vaccinationTypeOption = reactive([
  {
    name: "Dịch vụ",
    value: VaccinationType.DICH_VU,
  },
  {
    name: "Mở rộng",
    value: VaccinationType.MO_RONG,
  },
]);

const vaccineLotFormSchemaCreate = yup.object().shape({
  vaccine: yup.object().required("Chưa chọn vắc xin"),
  immunizationUnit: yup.object().required("Chưa chọn cơ sở lưu trữ"),
  provider: yup.object().required("Chưa chọn nhà cung cấp"),
  lotCode: yup.string().required("Chưa nhập mã lô vắc xin"),
  quantity: yup
    .number()
    .required("Chưa nhập số lượng")
    .positive("Số lượng phải lớn hơn 0"),
  transactionDate: yup
    .date()
    .required("Chưa chọn ngày nhập")
    .max(new Date(Date.now()), "Ngày nhập không được lớn hơn ngày hiện tại"),

  manufacturingDate: yup
    .date()
    .required("Chưa chọn ngày sản xuất")
    .test(
      "is-greater",
      "Ngày sản xuất không được lớn hơn ngày nhập kho",
      function (value) {
        const { transactionDate } = this.parent;
        return moment(value, "DD-MM-YYYY").isSameOrBefore(
          moment(transactionDate, "DD-MM-YYYY")
        );
      }
    ),
  expiredDate: yup
    .date()
    .required("Chưa chọn ngày hết hạn")
    .min(new Date(Date.now()), "Ngày hết hạn không được nhỏ hơn ngày hiện tại"),
  salePrice: yup
    .number()

    .test("non-negative", "Số lượng phải là một số không âm", (value) => {
      return value >= 0;
    }),
  vaccinationType: yup.string().required("Chưa chọn hình thức phục vụ"),
  status: yup.number().required("Chưa chọn trạng thái sử dụng"),
});

const vaccineLotFormSchemaUpdate = yup.object().shape({
  vaccine: yup.object().required("Chưa chọn vắc xin"),
  immunizationUnit: yup.object().required("Chưa chọn cơ sở lưu trữ"),
  provider: yup.object().required("Chưa chọn nhà cung cấp"),
  lotCode: yup.string().required("Chưa nhập mã lô vắc xin"),
  quantity: yup
    .number()
    .required("Chưa nhập số lượng")
    .positive("Số lượng phải lớn hơn 0"),
  transactionDate: yup
    .date()
    .required("Chưa chọn ngày nhập")
    .max(new Date(Date.now()), "Ngày nhập không được lớn hơn ngày hiện tại"),
  manufacturingDate: yup
    .date()
    .required("Chưa chọn ngày sản xuất")

    .test(
      "is-greater",
      "Ngày sản xuất không được lớn hơn ngày nhập kho",
      function (value) {
        const { transactionDate } = this.parent;
        return moment(value, "DD-MM-YYYY").isSameOrBefore(
          moment(transactionDate, "DD-MM-YYYY")
        );
      }
    ),
  expiredDate: yup
    .date()
    .required("Chưa chọn ngày hết hạn")
    .test(
      "is-greater",
      "Ngày hết hạn không được nhỏ hơn ngày sản xuất",
      function (value) {
        const { manufacturingDate } = this.parent;
        return moment(value, "DD-MM-YYYY").isSameOrAfter(
          moment(manufacturingDate, "DD-MM-YYYY")
        );
      }
    ),
  salePrice: yup
    .number()
    .test("non-negative", "Giá vắc xin phải là một số không âm", (value) => {
      return value >= 0;
    }),

  vaccinationType: yup.string().required("Chưa chọn hình thức phục vụ"),
  status: yup.number().required("Chưa chọn trạng thái sử dụng"),
});

const submitVaccine = () => {
  const submitData = {};
  if (vaccineLotLocal.value.id == null || vaccineLotLocal.value.id < 1) {
    submitData.lotCode = vaccineLotLocal.value.lotCode;
    submitData.quantity = vaccineLotLocal.value.quantity;
    submitData.expiredDate = new Date(
      vaccineLotLocal.value.expiredDate
    ).toISOString();
    submitData.transactionDate = new Date(
      vaccineLotLocal.value.transactionDate
    ).toISOString();
    submitData.manufacturingDate = new Date(
      vaccineLotLocal.value.manufacturingDate
    ).toISOString();
    submitData.salePrice = vaccineLotLocal.value.salePrice;
    submitData.vaccine = vaccineLotLocal.value.vaccine;
    submitData.provider = vaccineLotLocal.value.provider;
    submitData.immunizationUnit = vaccineLotLocal.value.immunizationUnit;
    submitData.quantityUsed = 0;
    submitData.vaccinationType = vaccineLotLocal.value.vaccinationType;
    submitData.status = vaccineLotLocal.value.status;
    emits("submit:vaccineLot", submitData);
  } else {
    submitData.id = vaccineLotLocal.value.id;
    submitData.lotCode = vaccineLotLocal.value.lotCode;
    submitData.quantity = vaccineLotLocal.value.quantity;
    submitData.expiredDate = new Date(
      vaccineLotLocal.value.expiredDate
    ).toISOString();
    submitData.transactionDate = new Date(
      vaccineLotLocal.value.transactionDate
    ).toISOString();
    submitData.manufacturingDate = new Date(
      vaccineLotLocal.value.manufacturingDate
    ).toISOString();
    submitData.salePrice = vaccineLotLocal.value.salePrice;
    submitData.vaccine = vaccineLotLocal.value.vaccine;
    submitData.provider = vaccineLotLocal.value.provider;
    submitData.immunizationUnit = vaccineLotLocal.value.immunizationUnit;
    submitData.quantityUsed = props.vaccineLot.quantityUsed;
    submitData.vaccinationType = vaccineLotLocal.value.vaccinationType;
    submitData.status = vaccineLotLocal.value.status;
    console.log(submitData);
    emits("submit:vaccineLot", submitData);
  }
};

const statusOption = reactive([
  {
    name: "Ngừng sử dụng",
    value: 0,
  },
  {
    name: "Sử dụng",
    value: 1,
  },
]);

watch(
  () => vaccineLotLocal.value.vaccinationType,
  (newVal) => {
    console.log(newVal);
    if (newVal == "MO_RONG") {
      vaccineLotLocal.value.salePrice = 0;
    }
    console.log(newVal);
  }
);

onMounted(() => {
  retriveOption();
  changeFromLocalDatetoDate();
});
</script>

<template>
  <Form
    @submit="submitVaccine"
    :validation-schema="
      vaccineLotLocal.id
        ? vaccineLotFormSchemaUpdate
        : vaccineLotFormSchemaCreate
    "
    class="space-y-4"
  >
    <div class="row">
      <div class="col-md-6 my-1">
        <label for="lotCode">Mã lô <span class="text-danger">*</span></label>
        <Field
          type="text"
          name="lotCode"
          class="form-control my-1"
          v-model="vaccineLotLocal.lotCode"
          placeholder="Mã lô vắc xin..."
        />
        <ErrorMessage name="lotCode" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label for="transactionDate"
          >Ngày nhập <span class="text-danger">*</span></label
        >
        <Field
          type="datetime-local"
          name="transactionDate"
          class="form-control my-1"
          v-model="vaccineLotLocal.transactionDate"
          placeholder="Ngày nhập..."
        />
        <ErrorMessage
          name="transactionDate"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-6 my-1">
        <label for="manufacturingDate"
          >Ngày sản xuất <span class="text-danger">*</span></label
        >
        <Field
          type="date"
          name="manufacturingDate"
          class="form-control my-1"
          v-model="vaccineLotLocal.manufacturingDate"
          placeholder="Ngày sản xuất..."
        />
        <ErrorMessage
          name="manufacturingDate"
          class="animated fadeIn text-danger"
        />
      </div>
      <div class="col-md-6 my-1">
        <label for="expiredDate"
          >Ngày hết hạn <span class="text-danger">*</span></label
        >
        <Field
          type="date"
          name="expiredDate"
          class="form-control my-1"
          v-model="vaccineLotLocal.expiredDate"
          placeholder="Ngày sản xuất..."
        />
        <ErrorMessage name="expiredDate" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-6 my-1" v-if="optionVaccines">
        <label for="vaccine"
          >Loại vắc xin <span class="text-danger">*</span></label
        >
        <Field
          name="vaccine"
          class="form-control my-1"
          v-model="vaccineLotLocal.vaccine"
          placeholder="Chọn..."
        >
          <VueSelect
            v-model="vaccineLotLocal.vaccine"
            :options="optionVaccines"
            placeholder="Chọn loại vắc xin.."
            label="name"
            class="my-1"
            name="vaccine"
          ></VueSelect>
        </Field>
        <ErrorMessage name="vaccine" class="animated fadeIn text-danger" />
      </div>
      <!-- Đối với admin -->
      <template
        v-if="
          !vaccineLotLocal.immunizationUnit ||
          (isAministrator && vaccineLotLocal.immunizationUnit)
        "
      >
        <div class="col-md-6 my-1" v-if="optionImmunizationUnits">
          <label for="immunizationUnit"
            >Cơ sở lưu trữ <span class="text-danger">*</span></label
          >
          <Field
            name="immunizationUnit"
            class="form-control my-1"
            v-model="vaccineLotLocal.immunizationUnit"
            placeholder="Chọn cơ sở..."
          >
            <VueSelect
              v-model="vaccineLotLocal.immunizationUnit"
              :options="optionImmunizationUnits"
              placeholder="Chọn loại vắc xin.."
              label="name"
              class="my-1"
              name="immunizationUnit"
            ></VueSelect>
          </Field>
          <ErrorMessage
            name="immunizationUnit"
            class="animated fadeIn text-danger"
          />
        </div>
      </template>
      <!-- Đối với manager -->
      <template v-else>
        <div class="col-md-6 my-1" v-if="vaccineLotLocal.immunizationUnit">
          <label for="immunizationUnit"
            >Cơ sở lưu trữ <span class="text-danger">*</span></label
          >
          <Field
            name="immunizationUnit"
            class="form-control my-1"
            placeholder="Chọn cơ sở..."
            v-model="vaccineLotLocal.immunizationUnit"
          >
            <VueSelect
              v-model="vaccineLotLocal.immunizationUnit"
              :options="[vaccineLotLocal.immunizationUnit]"
              placeholder="Chọn loại vắc xin.."
              label="name"
              class="my-1"
              disabled
              name="immunizationUnit"
            ></VueSelect>
          </Field>
          <ErrorMessage
            name="immunizationUnit"
            class="animated fadeIn text-danger"
          />
        </div>
      </template>

      <div class="col-md-6 my-1" v-if="optionProviders">
        <label for="provider"
          >Nhà cung cấp <span class="text-danger">*</span></label
        >
        <Field
          name="provider"
          class="form-control my-1"
          v-model="vaccineLotLocal.provider"
          placeholder="Chọn cơ sở..."
        >
          <VueSelect
            v-model="vaccineLotLocal.provider"
            :options="optionProviders"
            placeholder="Chọn nhà cung cấp.."
            label="name"
            class="my-1"
            name="provider"
          ></VueSelect>
        </Field>
        <ErrorMessage name="provider" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label for="quantity">Số lượng<span class="text-danger">*</span></label>
        <Field
          type="number"
          name="quantity"
          class="form-control my-1"
          v-model="vaccineLotLocal.quantity"
          min="0"
          step="1"
          placeholder="Số lượng vắc xin..."
        />
        <ErrorMessage name="quantity" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1">
        <label for="salePrice">Giá (VNĐ) / 1 vắc xin </label>
        <Field
          type="number"
          name="salePrice"
          class="form-control my-1"
          v-model="vaccineLotLocal.salePrice"
          placeholder="Mã lô vắc xin..."
          :readonly="vaccineLotLocal.vaccinationType === 'MO_RONG'"
        />
        <ErrorMessage name="salePrice" class="animated fadeIn text-danger" />
      </div>

      <div class="col-md-6 my-1" v-if="statusOption">
        <label class="" for="status"
          >Trạng thái <span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="status"
          as="select"
          class="form-select my-1"
          v-model="vaccineLotLocal.status"
        >
          <option value="" disabled>--Chọn--</option>
          <option v-for="data in statusOption" :key="data" :value="data.value">
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage name="status" class="animated fadeIn text-danger" />
      </div>
      <div class="col-md-6 my-1" v-if="vaccinationTypeOption">
        <label for="vaccinationType"
          >Hình thức<span class="text-danger">*</span></label
        >
        <Field
          v-slot="{ value }"
          name="vaccinationType"
          as="select"
          class="form-select"
          v-model="vaccineLotLocal.vaccinationType"
        >
          <option value="" disabled>--Chọn--</option>
          <option
            v-for="data in vaccinationTypeOption"
            :key="data"
            :value="data.value"
            :selected="value && value.includes(vaccinationTypeOption)"
          >
            {{ data.name }}
          </option>
        </Field>
        <ErrorMessage
          name="vaccinationType"
          class="animated fadeIn text-danger"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 ms-auto my-2">
        <button type="submit" class="btn btn-primary mx-1">Lưu</button>
        <button
          v-if="!vaccineLot.id"
          class="btn btn-outline-secondary mr-0"
          type="reset"
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
