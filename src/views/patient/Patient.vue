<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { usePatientStore } from "@/stores/PatientStore";
import { useCustomerStore } from "@/stores/CustomerStore";
import PatientService from "@/services/patient.service";
import VueSelect from "vue-select";
import { useCheckRole } from "@/reuse/useCheckRole";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDate } = useChangeDateFormat();
const checkHasAnyRole = useCheckRole();
const patients = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const providerStore = usePatientStore();
const customerStore = useCustomerStore();
import Swal from "sweetalert2";
const searchOb = reactive({
  id: null,
  fullName: null,
  address: null,
  gender: null,
  dateOfBirth: null,
  customer: null,
});
const retrivePatients = async () => {
  try {
    const params = providerStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await providerStore.getAll(params);
    patients.value = res.data;
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
  retrivePatients();
};

const handlePageChange = (value) => {
  page.value = value;
  retrivePatients();
};

const handleSearch = () => {
  page.value = 1;
  retrivePatients();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.id = null;
  searchOb.fullName = null;
  searchOb.address = null;
  searchOb.gender = null;
  searchOb.dateOfBirth = null;
  searchOb.customer = null;
  retrivePatients();
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
        const res = await PatientService.delete(id);
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
      retrivePatients();
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const optionCustomers = ref(null);
const retriveOption = async () => {
  optionCustomers.value = await customerStore.getFSelect();
};

onMounted(() => {
  retrivePatients();
  retriveOption();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ TRẺ EM">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">Trẻ em</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-md-4 my-1">
              <label for="id" class="my-1">Mã số của trẻ</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo mã số..."
                v-model="searchOb.id"
              />
            </div>
            <div class="col-md-3 my-1">
              <label for="fullName" class="my-1">Họ và tên</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo họ tên..."
                v-model="searchOb.fullName"
              />
            </div>
            <div class="col-md-3 my-1">
              <label for="dateOfBirth" class="my-1">Ngày sinh:</label>
              <input
                type="date"
                class="form-control"
                v-model="searchOb.dateOfBirth"
              />
            </div>

            <div class="col-md-2 my-1">
              <label for="gender" class="my-1">Giới tính</label>
              <select
                name="gender"
                id="gender"
                class="form-select"
                v-model="searchOb.gender"
              >
                <option value="null">Tất cả</option>
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
              </select>
            </div>

            <div class="col-md-6 my-1">
              <label for="address" class="my-1">Nơi ở</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo ghi chú..."
                v-model="searchOb.address"
              />
            </div>

            <div class="col-md-6 my-1" v-if="optionCustomers">
              <label for="customer" class="my-1">Khách hàng</label>

              <VueSelect
                v-model="searchOb.customer"
                :options="optionCustomers"
                label="fullName"
                placeholder="Khách hàng..."
              >
                <template #option="option">
                  <span class="fw-bold">
                    {{ option.fullName }}
                  </span>

                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-phone"></i> {{ option.phone }}</span
                  >
                  <br />
                  <i class="fa-regular fa-address-card"></i>
                  {{ option.identityCard }}
                </template>
              </VueSelect>
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
              <th style="width: 20px">STT</th>
              <th class="d-none d-md-table-cell">Mã bệnh nhân</th>
              <th class="d-none d-md-table-cell">Thông tin cá nhân</th>
              <th class="d-none d-md-table-cell">Người giám hộ</th>
              <th class="d-none d-md-table-cell">Nơi ở</th>

              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(patient, index) in patients" :key="patient._id">
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ patient.id }}
              </td>

              <td class="d-none d-md-table-cell">
                <span class="fs-md"
                  ><i class="fa-solid fa-child-reaching me-1 text-info"></i>
                  {{ patient.fullName }}</span
                >
                <br />
                <span class="fs-md"
                  ><i class="fa-solid fa-cake-candles me-1 text-info"></i
                  >{{ formatDateFromInstantToDate(patient.dateOfBirth) }}</span
                >
                <br />
                <span class="fs-md">
                  <i class="fa-solid fa-venus-mars me-1 text-info"></i>
                  {{ patient.gender ? "Nữ" : "Nam" }}
                </span>
              </td>
              <td class="d-none d-md-table-cell">
                <span class="fs-md"
                  ><i class="fa-solid fa-user me-1 text-info"></i>
                  {{ patient.customer.fullName }}</span
                >
                <br />
                <span class="fs-md"
                  ><i class="fa-solid fa-phone me-1 text-info"></i>
                  {{ patient.customer.phone }}</span
                >
                <br />
                <span class="fs-md"
                  ><i class="fa-solid fa-envelope me-1 text-info"></i>
                  {{ patient.customer.email }}</span
                >
              </td>
              <td class="d-none d-md-table-cell">
                {{ patient.address }}
              </td>

              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    :to="{
                      name: 'edit-patient',
                      params: { id: patient.id },
                    }"
                    type="button"
                    class="btn btn-md btn-alt-primary"
                  >
                    <i class="fa fa-fw fa-pencil-alt"></i>
                  </RouterLink>
                  <RouterLink
                    type="button"
                    class="btn btn-md btn-alt-success"
                    :to="{
                      name: 'detail-patient',
                      params: { id: patient.id },
                    }"
                  >
                    <i class="fa-solid fa-fw fa-pen-ruler"></i>
                  </RouterLink>
                  <RouterLink
                    type="button"
                    class="btn btn-md btn-alt-info"
                    :to="{
                      name: 'add-appointment-card',
                      params: { patientId: patient.id },
                    }"
                  >
                    <i class="fa-solid fa-calendar-week fa-fw"></i>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
