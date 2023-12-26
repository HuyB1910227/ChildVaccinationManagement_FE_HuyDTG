<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import { useImmunizationUnitStore } from "@/stores/ImmunizationUnitStore";
import VueSelect from "vue-select";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useCheckRole } from "@/reuse/useCheckRole";
import { useTranslateRole } from "../../reuse/useTranslateRole";
const { formatDateFromInstantToDate } = useChangeDateFormat();
const checkHasAnyRole = useCheckRole();
const employees = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const providerStore = useEmployeeStore();
const immunizationUnitStore = useImmunizationUnitStore();
const { translateToRoleVN } = useTranslateRole();
const searchOb = reactive({
  id: null,
  employeeId: null,
  phone: null,
  fullName: null,
  identityCard: null,
  address: null,
  gender: null,
  dateOfBirth: null,
  immunizationUnit: null,
  email: null,
});
const retriveEmployees = async () => {
  try {
    const params = providerStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await providerStore.getAll(params);
    employees.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
    console.log(employees.value);
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
  retriveEmployees();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveEmployees();
};

const handleSearch = () => {
  page.value = 1;
  retriveEmployees();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.id = null;
  searchOb.employeeId = null;
  searchOb.phone = null;
  searchOb.fullName = null;
  searchOb.identityCard = null;
  searchOb.address = null;
  searchOb.gender = null;
  searchOb.dateOfBirth = null;
  searchOb.career = null;
  searchOb.email = null;
  searchOb.immunizationUnit = null;
  retriveEmployees();
};

const optionImmunizationunits = ref(null);
const retriveOption = async () => {
  optionImmunizationunits.value = await immunizationUnitStore.getFSelect();
};

onMounted(() => {
  retriveEmployees();
  retriveOption();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ CÁN BỘ Y TẾ / NHÂN VIÊN">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)"
              >Thông tin người dùng</a
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cán bộ y tế</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <RouterLink class="btn btn-primary" :to="{ name: 'add-employee' }"
          >Thêm nhân viên</RouterLink
        >
      </div>
    </div>

    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-md-4 my-1">
              <label for="id" class="my-1">Mã số cán bộ</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo mã cán bộ..."
                v-model="searchOb.id"
              />
            </div>
            <div class="col-md-4 my-1">
              <label for="employeeId" class="my-1"
                >Mã nhân viên (tại cơ sở)</label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo mã nhân viên..."
                v-model="searchOb.employeeId"
              />
            </div>
            <div class="col-md-4 my-1">
              <label for="identityCard" class="my-1">CMND/CCCD</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo số CMND/CCCD..."
                v-model="searchOb.identityCard"
              />
            </div>
            <div class="col-md-4 my-1">
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
            <div class="col-md-3 my-1">
              <label for="phone" class="my-1">Số điện thoại</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo số điện thoại..."
                v-model="searchOb.phone"
              />
            </div>
            <div class="col-md-6 my-1">
              <label for="address" class="my-1">Địa chỉ</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo địa chỉ..."
                v-model="searchOb.address"
              />
            </div>

            <div class="col-md-3 my-1">
              <label for="email" class="my-1">Email</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo email..."
                v-model="searchOb.email"
              />
            </div>
            <div
              class="col-md-3 my-1"
              v-if="
                optionImmunizationunits && checkHasAnyRole(['ADMINISTRATOR'])
              "
            >
              <label for="" class="my-1">Cơ sở công tác</label>
              <VueSelect
                v-model="searchOb.immunizationUnit"
                :options="optionImmunizationunits"
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
              <th style="width: 20px">STT</th>
              <th class="d-none d-md-table-cell">Mã nhân viên</th>
              <th class="d-none d-md-table-cell">CMND/CCCD</th>
              <th class="d-none d-md-table-cell">Tên</th>
              <th class="d-none d-md-table-cell">Liên hệ</th>
              <th class="d-none d-md-table-cell">Địa chỉ</th>
              <th class="d-none d-md-table-cell">Giới tính</th>
              <th class="d-none d-md-table-cell">Ngày sinh</th>
              <th class="d-none d-md-table-cell">Cơ sở</th>
              <th class="d-none d-md-table-cell">Vai trò</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(employee, index) in employees" :key="employee._id">
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ employee.employeeId }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ employee.identityCard }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ employee.fullName }}
              </td>
              <td class="d-none d-md-table-cell">
                <span class="fs-md"
                  ><i class="fa-solid fa-phone me-1 text-info"></i>
                  {{ employee.phone }}</span
                >
                <br />
                <span class="fs-md"
                  ><i class="fa-solid fa-envelope me-1 text-info"></i>
                  {{ employee.email }}</span
                >
              </td>
              <td class="d-none d-md-table-cell">
                {{ employee.address }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ employee.gender ? "Nữ" : "Nam" }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ formatDateFromInstantToDate(employee.dateOfBirth) }}
              </td>
              <td class="">
                {{ employee.immunizationUnit.name }}
              </td>
              <td class="d-none d-md-table-cell">
                {{
                  employee.user.roles
                    .map((role) => translateToRoleVN(role.name))
                    .join("; ")
                }}
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    v-if="
                      checkHasAnyRole(['ADMINISTRATOR']) ||
                      (checkHasAnyRole(['MANAGER']) &&
                        employee.user.roles &&
                        !employee.user.roles
                          .map((d) => d.name)
                          .includes('MANAGER'))
                    "
                    :to="{
                      name: 'edit-employee',
                      params: { id: employee.id },
                    }"
                    type="button"
                    class="btn btn-sm btn-alt-primary"
                  >
                    <i class="fa fa-fw fa-pencil-alt"></i>
                  </RouterLink>
                  <RouterLink
                    v-if="
                      checkHasAnyRole(['ADMINISTRATOR']) ||
                      (checkHasAnyRole(['MANAGER']) &&
                        employee.user.roles &&
                        !employee.user.roles
                          .map((d) => d.name)
                          .includes('MANAGER'))
                    "
                    :to="{
                      name: 'edit-employee-user',
                      params: { id: employee.id },
                    }"
                    type="button"
                    class="btn btn-sm btn-alt-warning"
                  >
                    <i class="fa fa-fw fa-solid fa-user-pen"></i>
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
