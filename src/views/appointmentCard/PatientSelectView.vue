<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { usePatientStore } from "@/stores/PatientStore";

const patients = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const providerStore = usePatientStore();

const searchOb = reactive({
  name: null,
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
  searchOb.name = null;
  searchOb.description = null;
  retrivePatients();
};

onMounted(() => {
  retrivePatients();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ PHIẾU TIÊM">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <RouterLink :to="{ name: 'appointment-cards' }"
              >Thêm trẻ em</RouterLink
            >
          </li>

          <li class="breadcrumb-item" aria-current="page">Trẻ em</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <RouterLink class="btn btn-primary" :to="{ name: 'select-customer' }"
          >Thêm trẻ em</RouterLink
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
              <th class="d-none d-md-table-cell">Mã bệnh nhân</th>
              <th class="d-none d-md-table-cell">Tên</th>
              <th class="d-none d-md-table-cell">Địa chỉ</th>
              <th class="d-none d-md-table-cell">Giới tính</th>
              <th class="d-none d-md-table-cell">Ngày sinh</th>
              <th class="d-none d-md-table-cell">Liên hệ</th>
              <th class="d-none d-md-table-cell">Người giám hộ</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(patient, index) in patients" :key="patient._id">
              <td class="d-none d-md-table-cell">
                {{ patient.id }}
              </td>

              <td class="d-none d-md-table-cell">
                {{ patient.fullName }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ patient.address }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ patient.gender ? "Nữ" : "Nam" }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ patient.dateOfBirth }}
              </td>
              <td class="d-none d-md-table-cell">
                <i class="fa-solid fa-phone"></i>{{ patient.customer.phone }}
                <br />
                <i class="fa-solid fa-envelope"></i>{{ patient.customer.email }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ patient.customer.fullName }}
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    :to="{
                      name: 'add-appointment-card',
                      params: { patientId: patient.id },
                    }"
                    type="button"
                    class="btn btn-sm btn-alt-primary"
                  >
                    <i class="fa fa-fw fa-pencil-alt"></i>
                    <i class="fa-solid fa-clipboard"></i>
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
