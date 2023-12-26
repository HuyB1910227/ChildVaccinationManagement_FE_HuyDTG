<script setup>
import VueSelect from "vue-select";
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive, watch } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useVaccineLotStore } from "@/stores/VaccineLotStore";
import VaccineLotService from "@/services/vaccineLot.service";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import { useVaccineStore } from "@/stores/VaccineStore";
import { useProviderStore } from "@/stores/ProviderStore";
import { useCheckRole } from "../../reuse/useCheckRole";
import { useChangeCurrencyFormat } from "@/reuse/useChangeCurrencyFormat";
import dayjs from "dayjs";
import { VaccinationType } from "../../data/vaccinationType";

const checkHasAnyRole = useCheckRole();
const vaccineLots = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const vaccineLotStore = useVaccineLotStore();
const immunizationUnitStore = useImmunizationUnitStore();
const vaccineStore = useVaccineStore();
const providerStore = useProviderStore();
const { formatCurrencyFromDecimalToVND } = useChangeCurrencyFormat();
import Swal from "sweetalert2";

const searchOb = reactive({
  lotCode: null,
  quantity: null,
  manufacturingDate: null,
  expiredDate: null,
  transactionDate: null,
  immunizationUnit: null,
  status: null,
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
  searchOb.immunizationUnit = null;
  searchOb.status = null;
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
const deleteData = async (id) => {
  let deleted = false;
  const result = await Swal.fire({
    title: "Bạn chắc chắn muốn xóa?",
    text: "Dữ liệu sao khi xóa sẽ không thể hoàn tác!",
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
      try {
        const res = await VaccineLotService.delete(id);
        if (res.status == 204) {
          deleted = true;
        }
        return deleted;
      } catch (error) {
        Swal.fire(
          "Xóa dữ liệu thất bại",
          "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
          "error"
        );
      }
    },
  });

  if (result.isConfirmed) {
    if (deleted) {
      Swal.fire("Đã xóa!", "Dữ liệu đã được xóa thành công.", "success");
      retriveVaccineLots();
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};
const optionVaccines = ref(null);
const optionImmunizationunits = ref(null);
const optionProviders = ref(null);
const retriveOption = async () => {
  optionVaccines.value = await vaccineStore.getFSelect();
  optionImmunizationunits.value = await immunizationUnitStore.getFSelect();
  optionProviders.value = await providerStore.getFSelect();
};

watch(
  () => searchOb.quantity,
  (newVal) => {
    if (newVal < 0) {
      searchOb.quantity = 0;
    }
  }
);

onMounted(() => {
  retriveVaccineLots();
  retriveOption();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ LÔ VẮC XIN">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">Lô vắc xin</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
        v-if="checkHasAnyRole(['ADMINISTRATOR', 'MANAGER'])"
      >
        <RouterLink class="btn btn-primary" :to="{ name: 'add-vaccine-lot' }"
          >Thêm lô vắc xin</RouterLink
        >
      </div>
    </div>

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
            <div class="col-6 my-2">
              <label for="status">Trạng thái</label>
              <select
                name="status"
                id="status"
                class="form-select"
                v-model="searchOb.status"
              >
                <option value="null">Tất cả</option>
                <option value="0">Ngừng sử dụng</option>
                <option value="1">Đang sử dụng</option>
              </select>
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

            <div
              class="col-6 my-1"
              v-if="
                optionImmunizationunits && checkHasAnyRole(['ADMINISTRATOR'])
              "
            >
              <label for="" class="my-1">Cơ sở lưu trữ</label>
              <VueSelect
                v-model="searchOb.immunizationUnit"
                :options="optionImmunizationunits"
                placeholder="Chọn vắc xin"
                label="name"
              ></VueSelect>
            </div>

            <div class="col-md-6 my-1">
              <label for="vaccinationType" class="my-1"
                >Hình thức phục vụ</label
              >
              <select
                name="vaccinationType"
                id="vaccinationType"
                class="form-select"
                v-model="searchOb.vaccinationType"
              >
                <option value="null">Tất cả</option>
                <option :value="VaccinationType.MO_RONG">Mở rộng</option>
                <option :value="VaccinationType.DICH_VU">Dịch vụ</option>
              </select>
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
        <div style="overflow-x: auto">
          <table class="table table-bordered table-striped table-vcenter">
            <thead>
              <tr>
                <th style="width: 20px">STT</th>
                <th class="d-none d-md-table-cell">Mã lô</th>
                <th class="d-none d-md-table-cell">Tên</th>
                <th class="d-none d-md-table-cell">Số lượng</th>
                <th class="d-none d-md-table-cell">Còn lại</th>
                <th class="d-none d-md-table-cell">Giá</th>
                <th class="d-none d-md-table-cell">Ngày sản xuất</th>
                <th class="d-none d-md-table-cell">Ngày hêt hạn</th>
                <th class="d-none d-md-table-cell">Ngày nhập</th>
                <th class="d-none d-md-table-cell">Lưu trữ</th>
                <th class="d-none d-md-table-cell">Hình thức</th>
                <th class="d-none d-md-table-cell">Kiểm định</th>
                <th class="d-none d-md-table-cell">Trạng thái</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(vaccineLot, index) in vaccineLots"
                :key="vaccineLot._id"
              >
                <td class="fw-semibold fs-sm">
                  {{ ++index }}
                </td>

                <td class="d-none d-md-table-cell">
                  {{ vaccineLot.lotCode }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ vaccineLot.vaccine.name }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ vaccineLot.quantity }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ vaccineLot.quantity - vaccineLot.quantityUsed }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ formatCurrencyFromDecimalToVND(vaccineLot.salePrice) }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ formatDate(vaccineLot.manufacturingDate) }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ formatDate(vaccineLot.expiredDate) }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ formatDateTime(vaccineLot.transactionDate) }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{ vaccineLot.immunizationUnit.name }}
                </td>
                <td class="d-none d-md-table-cell">
                  {{
                    vaccineLot.vaccinationType == "DICH_VU"
                      ? "Dịch vụ"
                      : "Mở rộng"
                  }}
                </td>
                <td class="d-none d-md-table-cell">
                  <span
                    v-if="generateStatus(vaccineLot.expiredDate) == 1"
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info"
                  >
                    Còn hạn
                  </span>
                  <span
                    v-else-if="generateStatus(vaccineLot.expiredDate) == -1"
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-danger-light text-danger"
                  >
                    Hết hạn
                  </span>
                  <span
                    v-else
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                  >
                    Đến hạn
                  </span>
                </td>
                <td class="d-none d-md-table-cell">
                  <span
                    v-if="vaccineLot.status == 1"
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-success"
                  >
                    Đang sử dụng
                  </span>
                  <span
                    v-else
                    class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                  >
                    Ngừng sử dụng
                  </span>
                </td>
                <td class="text-center">
                  <div class="btn-group">
                    <RouterLink
                      v-if="checkHasAnyRole(['ADMINISTRATOR', 'MANAGER'])"
                      :to="{
                        name: 'edit-vaccine-lot',
                        params: { id: vaccineLot.id },
                      }"
                      type="button"
                      class="btn btn-sm btn-alt-primary"
                    >
                      <i class="fa fa-fw fa-pencil-alt"></i>
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </NormalTable>
  </div>
</template>

<style lang="scss">
@import "vue-select/dist/vue-select.css";
@import "@/assets/scss/vendor/vue-select";
</style>

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
