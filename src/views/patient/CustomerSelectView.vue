<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useCustomerStore } from "@/stores/CustomerStore";
const customers = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const providerStore = useCustomerStore();

const searchOb = reactive({
  name: null,
});
const retriveCustomers = async () => {
  try {
    const params = providerStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await providerStore.getAll(params);
    customers.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
    console.log(customers.value);
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
  retriveCustomers();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveCustomers();
};

const handleSearch = () => {
  page.value = 1;
  retriveCustomers();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.name = null;
  searchOb.description = null;
  retriveCustomers();
};

onMounted(() => {
  retriveCustomers();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ KHÁCH HÀNG">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)"
              >Thông tin người dùng</a
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Khách hàng</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <RouterLink class="btn btn-primary" :to="{ name: 'add-customer' }"
          >Thêm khách hàng</RouterLink
        >
      </div>
    </div>

    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-6">
              <label for="name">Tên</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo tên..."
                v-model="searchOb.name"
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
              <th class="d-none d-md-table-cell">CMND/CCCD</th>
              <th class="d-none d-md-table-cell">Tên</th>
              <th class="d-none d-md-table-cell">Liên hệ</th>
              <th class="d-none d-md-table-cell">Địa chỉ</th>
              <th class="d-none d-md-table-cell">Giới tính</th>
              <th class="d-none d-md-table-cell">Ngày sinh</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(customer, index) in customers" :key="customer._id">
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>

              <td class="d-none d-md-table-cell">
                {{ customer.identityCard }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ customer.fullName }}
              </td>
              <td class="d-none d-md-table-cell">
                <i class="fa-solid fa-phone"></i> {{ customer.phone }}
                <br />
                <i class="fa-solid fa-envelope"></i> {{ customer.email }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ customer.address }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ customer.gender ? "Nữ" : "Nam" }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ customer.dateOfBirth }}
              </td>

              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    :to="{
                      name: 'add-patient',
                      params: { customerId: customer.id },
                    }"
                    type="button"
                    class="btn btn-sm btn-alt-primary"
                  >
                    <i class="fa-solid fa-plus"></i>&nbsp;
                    <i class="fa-solid fa-baby"></i>
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
