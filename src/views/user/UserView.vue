<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import RoleService from "@/services/role.service";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import { useCustomerStore } from "@/stores/CustomerStore";
import VueSelect from "vue-select";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
import { useTranslateRole } from "@/reuse/useTranslateRole";
import UseUserService from "@/services/useService/useUserService";
import { useCheckRole } from "@/reuse/useCheckRole";

const employeeStore = useEmployeeStore();
const customerStore = useCustomerStore();
const checkHasAnyRole = useCheckRole();
const users = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);

const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const { translateToRoleVN } = useTranslateRole();
const searchOb = reactive({
  id: null,
  username: null,
  phone: null,
  isEnable: null,
  createdAt: null,
  roles: null,
  employee: null,
  customer: null,
});
const retriveUsers = async () => {
  try {
    const params = UseUserService.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await UseUserService.getAll(params);
    users.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
    console.log(users.value);
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
  retriveUsers();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveUsers();
};

const handleSearch = () => {
  page.value = 1;
  retriveUsers();
};

const clearSearch = () => {
  page.value = 1;

  searchOb.username = null;
  searchOb.phone = null;
  searchOb.isEnable = null;
  searchOb.createdAt = null;
  searchOb.roles = null;
  searchOb.employee = null;
  searchOb.customer = null;
  retriveUsers();
};

const optionEmployees = ref(null);
const optionCustomers = ref(null);
const optionRoles = ref(null);
const retriveOption = async () => {
  optionEmployees.value = await employeeStore.getFSelect();
  optionCustomers.value = await customerStore.getFSelect();
  optionRoles.value = await RoleService.getAll();
};

onMounted(() => {
  retriveUsers();
  retriveOption();
});
</script>

<template>
  <BasePageHeading
    title="Quản lý tài khoản người dùng"
    subtitle="Quản lý tài khoản của các thành viên trong hệ thống"
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">Tài khoản</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-4">
              <label for="id">Mã tài khoản</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo mã tài khoản..."
                v-model="searchOb.id"
              />
            </div>
            <div class="col-4">
              <label for="id">Tên tài khoản</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo tên tài khoản..."
                v-model="searchOb.username"
              />
            </div>
            <div class="col-4">
              <label for="id">Số điện thoại</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo số điện thoại đăng ký..."
                v-model="searchOb.phone"
              />
            </div>
            <div class="col-4 my-2">
              <label for="isEnable">Trạng thái</label>
              <select
                name="isEnable"
                id="isEnable"
                class="form-select"
                v-model="searchOb.isEnable"
              >
                <option value="null" selected>Tất cả</option>
                <option value="0">Tạm dừng</option>
                <option value="1">Hoạt động</option>
              </select>
            </div>
            <div class="col-4 my-2">
              <label for="id">Ngày tạo</label>
              <input
                type="datetime-local"
                class="form-control"
                placeholder="..."
                v-model="searchOb.createdAt"
              />
            </div>
            <div class="col-md-4 my-1" v-if="optionRoles">
              <label for="role">Vai trò</label>
              <VueSelect
                multiple
                v-model="searchOb.roles"
                :options="optionRoles"
                placeholder="Chọn vai trò.."
                class="my-1"
                label="name"
              >
                <template #option="option">
                  {{ translateToRoleVN(option.name) }}
                </template>
              </VueSelect>
            </div>
            <div class="col-md-6 my-1" v-if="optionEmployees">
              <label for="employee" class="my-1"
                >Nhân viên/ Cán bộ/ Bác sĩ</label
              >
              <VueSelect
                v-model="searchOb.employee"
                :options="optionEmployees"
                label="fullName"
                placeholder="Tìm kiếm theo nhân viên .."
              >
                <template #option="option">
                  <span class="fw-bold">
                    {{ option.fullName }}
                  </span>
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-badge"></i> {{ option.id }}</span
                  >
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-card-clip"></i>
                    {{ option.employeeId }}</span
                  >
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-phone"></i> {{ option.phone }}</span
                  >
                </template>
              </VueSelect>
            </div>
            <div class="col-md-6 my-1" v-if="optionCustomers">
              <label for="customer" class="my-1">Khách hàng</label>
              <VueSelect
                v-model="searchOb.customer"
                :options="optionCustomers"
                label="fullName"
                placeholder="Tìm kiếm theo khách hàng.."
              >
                <template #option="option">
                  <span class="fw-bold">
                    {{ option.fullName }}
                  </span>
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-badge"></i> {{ option.id }}</span
                  >
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-id-card-clip"></i>
                    {{ option.identityCard }}</span
                  >
                  <br />
                  <span class="fs-sm"
                    ><i class="fa-solid fa-phone"></i> {{ option.phone }}</span
                  >
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
              <th class="d-none d-md-table-cell">Mã tài khoản</th>
              <th class="d-none d-md-table-cell">Tên tài khoản</th>
              <th class="d-none d-md-table-cell">Số điện thoại</th>
              <th class="d-none d-md-table-cell">Trạng thái</th>
              <th class="d-none d-md-table-cell">Ngày tạo</th>
              <th class="d-none d-md-table-cell">Vai trò</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user._id">
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ user.id }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ user.username }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ user.phone }}
              </td>
              <td class="d-none d-md-table-cell">
                <span
                  v-if="user.isEnable"
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info"
                >
                  Hoạt động
                </span>
                <span
                  v-else
                  class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                >
                  Tạm dừng
                </span>
              </td>
              <td class="d-none d-md-table-cell">
                {{ formatDateFromInstantToDateTime(user.createdAt) }}
              </td>
              <td class="d-none d-md-table-cell">
                <ul v-if="user.roles.length > 0">
                  <li v-for="role in user.roles" :key="role.id">
                    {{ translateToRoleVN(role.name) }}
                  </li>
                </ul>
              </td>
              <td class="text-center">
                <RouterLink
                  v-if="checkHasAnyRole(['ADMINISTRATOR'])"
                  :to="{
                    name: 'edit-user',
                    params: { id: user.id },
                  }"
                  type="button"
                  class="btn btn-sm btn-alt-primary"
                >
                  <i class="fa fa-fw fa-pencil-alt"></i>
                </RouterLink>
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
