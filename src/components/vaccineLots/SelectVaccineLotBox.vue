<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive, watch } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useVaccineLotStore } from "@/stores/VaccineLotStore";
import dayjs from "dayjs";
import VaccineLotDetailForAssignment from "./VaccineLotDetailForAssignment.vue";
import VueSelect from "vue-select";
import { useVaccineStore } from "@/stores/VaccineStore";
import { useProviderStore } from "@/stores/ProviderStore";
import { useChangeCurrencyFormat } from "@/reuse/useChangeCurrencyFormat";
const { formatCurrencyFromDecimalToVND } = useChangeCurrencyFormat();
const vaccineLots = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const vaccineLotStore = useVaccineLotStore();
const vaccineStore = useVaccineStore();
const providerStore = useProviderStore();
const searchOb = reactive({
  name: null,
  status: 1,
  lotCode: null,
  quantity: null,
  manufacturingDate: null,
  expiredDate: null,
  transactionDate: null,
  vaccine: null,
  salePrice: null,
  provider: null,
});
const retriveVaccineLots = async () => {
  try {
    const params = vaccineLotStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await vaccineLotStore.getAll(params);
    vaccineLots.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
  } catch (error) {
    console.log(error);
  }
};

const handlePageSizeChange = (value) => {
  pageSize.value = value;
  let total = Math.ceil(totalRecords.value / pageSize.value);
  if (page.value > total) {
    page.value = total;
  }
  retriveVaccineLots();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveVaccineLots();
};

const handleSearch = () => {
  page.value = 1;
  retriveVaccineLots();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.lotCode = null;
  searchOb.quantity = null;
  searchOb.manufacturingDate = null;
  searchOb.expiredDate = null;
  searchOb.transactionDate = null;
  searchOb.status = 1;
  searchOb.vaccine = null;
  searchOb.salePrice = null;
  searchOb.provider = null;
  retriveVaccineLots();
};

const formatDate = (dateString) => {
  let date = dayjs(dateString);
  return date.format("DD/MM/YYYY");
};
const formatDateTime = (dateString) => {
  let date = dayjs(dateString);
  return date.format("HH:mm DD/MM/YYYY");
};

const generateStatus = (dateString) => {
  let currentDate = new Date();
  let expiredDate = new Date(dateString);
  let currentDateOnly = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  let expiredDateOnly = new Date(
    expiredDate.getFullYear(),
    expiredDate.getMonth(),
    expiredDate.getDate()
  );
  let currentDateMillis = currentDateOnly.getTime();
  let expiredDateMillis = expiredDateOnly.getTime();

  if (currentDateMillis > expiredDateMillis) {
    return -1;
  } else if (currentDateMillis < expiredDateMillis) {
    return 1;
  } else {
    return 0;
  }
};

const vaccineLotDetailsProp = ref(null);
const handlePropsVaccineLotDetail = (data) => {
  vaccineLotDetailsProp.value = data;
};

const emit = defineEmits(["selected:vaccineLot"], ["max:dosage"]);

const handelSelectVaccineLot = (vaccineLot) => {
  emit("selected:vaccineLot", vaccineLot);
};

const selectdVaccineLot = ref(props.assignmentVaccineLot);
const props = defineProps({
  assignmentVaccineLot: {
    type: Object,
    required: false,
  },
});

watch(
  () => props.assignmentVaccineLot,
  (newVal) => {
    selectdVaccineLot.value = newVal;
  }
);

const optionVaccines = ref(null);
const optionProviders = ref(null);
const retriveOption = async () => {
  optionVaccines.value = await vaccineStore.getFSelect();
  optionProviders.value = await providerStore.getFSelect();
};

onMounted(() => {
  retriveVaccineLots();
  retriveOption();
});

const htmlData = ref(null);
const propsHTMLData = (data) => {
  htmlData.value = data;
};
</script>

<template>
  <BaseLayoutSearch>
    <template #formSearch>
      <form @submit.prevent>
        <div class="row pb-2">
          <div class="col-6 my-1">
            <label for="lotCode " class="my-1">Mã lô vắc xin</label>
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm theo mã lô vắc xin..."
              v-model="searchOb.lotCode"
            />
          </div>
          <div class="col-6 my-1">
            <label for="quantity" class="my-1">Số lượng</label>
            <input
              type="number"
              class="form-control"
              placeholder="Tìm kiếm theo số lượng..."
              step="1"
              min="0"
              v-model="searchOb.quantity"
            />
          </div>
          <div class="col-6 my-1">
            <label for="manufacturingDate" class="my-1"
              >Ngày sản xuất kể từ:</label
            >
            <input
              type="date"
              class="form-control"
              v-model="searchOb.manufacturingDate"
            />
          </div>
          <div class="col-6 my-1">
            <label for="expiredDate" class="my-1">Ngày hết hạn kể từ:</label>
            <input
              type="date"
              class="form-control"
              v-model="searchOb.expiredDate"
            />
          </div>
          <div class="col-6 my-1">
            <label for="transactionDate" class="my-1"
              >Ngày nhập kho kể từ:</label
            >
            <input
              type="datetime-local"
              class="form-control"
              v-model="searchOb.transactionDate"
            />
          </div>
          <div class="col-6 my-1">
            <label for="salePrice" class="my-1">Giá</label>
            <input
              type="number"
              class="form-control"
              placeholder="Tìm kiếm theo số lượng..."
              step="1"
              min="0"
              v-model="searchOb.salePrice"
            />
          </div>
          <div class="col-6 my-1" v-if="optionVaccines">
            <label for="" class="my-1">Vắc xin</label>
            <VueSelect
              v-model="searchOb.vaccine"
              :options="optionVaccines"
              placeholder="Chọn vắc xin"
              label="name"
            ></VueSelect>
          </div>
          <div class="col-6 my-1" v-if="optionProviders">
            <label for="provider" class="my-1">Nhà cung cấp</label>
            <VueSelect
              v-model="searchOb.provider"
              :options="optionProviders"
              placeholder="Chọn vắc xin"
              label="name"
            ></VueSelect>
          </div>
        </div>
        <div class="row py-3">
          <div class="col-12">
            <button class="btn btn-primary me-2" @click="handleSearch">
              Tìm kiếm
            </button>
            <button
              type="reset"
              class="btn btn-outline-primary me-2"
              @click="clearSearch"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </form>
    </template>
  </BaseLayoutSearch>

  <NormalTable
    @update:pageSize="handlePageSizeChange"
    @update:page="handlePageChange"
    :totalRecordsc="totalRecords"
    :pagec="page"
  >
    <template #tableContent>
      <table class="table table-bordered table-striped table-vcenter">
        <thead>
          <tr>
            <th class="d-none d-md-table-cell">Tên</th>
            <th class="d-none d-md-table-cell">Mã lô</th>
            <th class="d-none d-md-table-cell">Còn lại</th>
            <th class="d-none d-md-table-cell">Giá</th>
            <th class="d-none d-md-table-cell">Hình thức</th>
            <th class="d-none d-md-table-cell">Mô tả</th>
            <th class="d-none d-md-table-cell">Chống chỉ định</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="vaccineLot in vaccineLots" :key="vaccineLot._id">
            <tr v-if="generateStatus(vaccineLot.expiredDate) != -1">
              <td class="d-none d-md-table-cell">
                {{ vaccineLot.lotCode }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ vaccineLot.vaccine.name }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ vaccineLot.quantity - vaccineLot.quantityUsed }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ formatCurrencyFromDecimalToVND(vaccineLot.salePrice) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{
                  vaccineLot.vaccinationType == "DICH_VU"
                    ? "Dịch vụ"
                    : "Mở rộng"
                }}
              </td>
              <td class="d-none d-md-table-cell text-center">
                <button
                  class="btn btn-md btn-alt-info"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-block-html-details"
                  @click="propsHTMLData(vaccineLot.vaccine.description)"
                >
                  <i class="fa-solid fa-circle-info"></i>
                </button>
              </td>
              <td
                class="d-none d-md-table-cell text-center"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-html-details"
                @click="propsHTMLData(vaccineLot.vaccine.contraindication)"
              >
                <button class="btn btn-md btn-alt-info">
                  <i class="fa-solid fa-circle-info"></i>
                </button>
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <button
                    class="btn btn-primary"
                    @click="handelSelectVaccineLot(vaccineLot)"
                    v-if="!selectdVaccineLot"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button class="btn btn-success" type="button">
                    <i
                      class="fa-solid fa-circle-info"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-block-info-vaccine-lot"
                      @click="handlePropsVaccineLotDetail(vaccineLot)"
                    ></i>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </NormalTable>
  <!-- </div> -->
  <div
    class="modal"
    id="modal-block-info-vaccine-lot"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Thông tin chi tiết vắc xin" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>
          <VaccineLotDetailForAssignment
            v-if="vaccineLotDetailsProp"
            :vaccineLot="vaccineLotDetailsProp"
          />
        </BaseBlock>
      </div>
    </div>
  </div>

  <div
    class="modal"
    id="modal-block-html-details"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Thông tin chi tiết" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-md" v-if="htmlData">
              <div v-html="htmlData"></div>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gg-select {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(1);
  width: 22px;
  height: 22px;
}
.gg-select::after,
.gg-select::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}
.gg-select::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}
.gg-select::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}
th.sort {
  cursor: pointer;
  user-select: none;
  &.asc {
    .gg-select::after {
      opacity: 1;
    }
  }
  &.desc {
    .gg-select::before {
      opacity: 1;
    }
  }
}
</style>
