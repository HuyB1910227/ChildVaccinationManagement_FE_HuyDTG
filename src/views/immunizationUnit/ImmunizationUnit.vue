<script setup>
import ImmunizationUnitService from "@/services/immunizationUnit.service";
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import { useCheckRole } from "@/reuse/useCheckRole";
const checkHasAnyRole = useCheckRole();
const immunizationUnits = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const immunizationUnitStore = useImmunizationUnitStore();
import Swal from "sweetalert2";
const searchOb = reactive({
  name: null,
  address: null,
  hotline: null,
  isActive: null,
  employee: null,
  vaccineLot: null,
  fixedSchedule: null,
  appoinmentCard: null,
  operatingLicence: null,
});
const retriveImmunizationUnits = async () => {
  try {
    const params = immunizationUnitStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await immunizationUnitStore.getAll(params);
    immunizationUnits.value = res.data;
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
  retriveImmunizationUnits();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveImmunizationUnits();
};

const handleSearch = () => {
  page.value = 1;
  retriveImmunizationUnits();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.name = null;
  searchOb.address = null;
  searchOb.hotline = null;
  searchOb.isActive = null;
  searchOb.employee = null;
  searchOb.vaccineLot = null;
  searchOb.fixedSchedule = null;
  searchOb.appoinmentCard = null;
  searchOb.operatingLicence = null;
  retriveImmunizationUnits();
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
        const res = await ImmunizationUnitService.delete(id);
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
      retriveImmunizationUnits();
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

onMounted(() => {
  retriveImmunizationUnits();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ CƠ SỞ TIÊM CHỦNG">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Cơ sở tiêm chủng</a>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2" v-if="checkHasAnyRole(['ADMINISTRATOR'])">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <RouterLink
          class="btn btn-primary"
          :to="{ name: 'add-immunization-unit' }"
          >Thêm cơ sở</RouterLink
        >
      </div>
    </div>

    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-6 my-2">
              <label for="name">Tên</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo tên..."
                v-model="searchOb.name"
              />
            </div>
            <div class="col-6 my-2">
              <label for="address">Địa chỉ/ Khu vực</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo địa chỉ..."
                v-model="searchOb.address"
              />
            </div>
            <div class="col-4 my-2">
              <label for="hotline">Đường dây nóng</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo đương dây nóng..."
                v-model="searchOb.hotline"
              />
            </div>
            <div class="col-4 my-2">
              <label for="isActive">Trạng thái</label>
              <select
                name="isActive"
                id="isActive"
                class="form-select"
                v-model="searchOb.isActive"
              >
                <option value="null" selected>Tất cả</option>
                <option value="0">Ngừng hoạt động</option>
                <option value="1">Hoạt động</option>
              </select>
            </div>
            <div class="col-4 my-2">
              <label for="operatingLicence">Mã giấy phép</label>
              <input
                type="text"
                class="form-control"
                placeholder="Mã giấy phép..."
                v-model="searchOb.operatingLicence"
              />
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
              <th class="d-none d-md-table-cell">Tên</th>
              <th class="d-none d-md-table-cell">Địa chỉ</th>
              <th class="d-none d-md-table-cell">Hotline</th>
              <th class="d-none d-md-table-cell">Giấy phép</th>
              <th class="d-none d-md-table-cell">Trạng thái</th>

              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(immunizationUnit, index) in immunizationUnits"
              :key="immunizationUnit._id"
            >
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ immunizationUnit.name }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ immunizationUnit.address }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ immunizationUnit.hotline }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ immunizationUnit.operatingLicence }}
              </td>
              <td class="d-none d-md-table-cell">
                <span
                  v-if="immunizationUnit.isActive == 1"
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info"
                >
                  Hoạt động
                </span>
                <span
                  v-else
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                >
                  Ngừng hoạt động
                </span>
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    v-if="checkHasAnyRole(['ADMINISTRATOR'])"
                    :to="{
                      name: 'edit-immunization-unit',
                      params: { id: immunizationUnit.id },
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
      </template>
    </NormalTable>
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
