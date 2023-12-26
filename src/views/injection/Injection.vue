<script setup>
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useInjectionStore } from "@/stores/InjectionStore";
import { AgeType } from "@/data/ageType";
import { useVaccineStore } from "@/stores/VaccineStore";
import VueSelect from "vue-select";
const injections = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const injectionStore = useInjectionStore();
const vaccineStore = useVaccineStore();
const optionVaccine = ref(null);

const searchOb = reactive({
  vaccine: null,
  injectionTime: null,
});
const retriveData = async () => {
  try {
    const params = injectionStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await injectionStore.getAll(params);
    injections.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
  } catch (error) {
    console.log(error);
  }
};

const retriveOptionData = async () => {
  optionVaccine.value = await vaccineStore.getFSelect();
};

const handlePageSizeChange = (value) => {
  pageSize.value = value;
  let total = Math.ceil(totalRecords.value / pageSize.value);
  if (page.value > total) {
    page.value = total;
  }
  retriveData();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveData();
};

const handleSearch = () => {
  page.value = 1;
  retriveData();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.vaccine = null;
  searchOb.injectionTime = null;

  retriveData();
};

onMounted(() => {
  retriveOptionData();
  retriveData();
});

const translatedistanceTimeType = (data) => {
  if (data == "NGAY") {
    return "ngày";
  }
  if (data == "TUAN") {
    return "tuần";
  }
  if (data == "THANG") {
    return "tháng";
  }
  if (data == "NAM") {
    return "năm";
  }
  return;
};

const translateAgeType = (data) => {
  if (data == AgeType.THANG) {
    return "tháng tuổi";
  }

  if (data == AgeType.TUOI) {
    return "tuổi";
  }

  return;
};
</script>

<template>
  <BasePageHeading title="QUẢN LÝ MŨI TIÊM">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Mũi tiêm</a>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <RouterLink class="btn btn-primary" :to="{ name: 'select-vaccine' }"
          >Thêm mũi tiêm</RouterLink
        >
      </div>
    </div>

    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-6 my-1" v-if="optionVaccine">
              <label for="vaccine" class="my-1">Vắc xin</label>
              <VueSelect
                v-model="searchOb.vaccine"
                :options="optionVaccine"
                placeholder="Chọn vắc xin ... "
                label="name"
              ></VueSelect>
            </div>

            <div class="col-6 my-1">
              <label for="name" class="my-1">Mũi tiêm</label>
              <input
                type="number"
                class="form-control"
                placeholder="1"
                step="1"
                min="1"
                v-model="searchOb.injectionTime"
              />
            </div>
          </div>
          <div class="row py-2">
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
              <th class="d-none d-md-table-cell">Tên vắc xin</th>
              <th class="d-none d-md-table-cell">Mũi tiêm</th>
              <th class="d-none d-md-table-cell">Khoảng cách tiêm</th>
              <th class="d-none d-md-table-cell">Khoảng tuổi hợp lệ</th>

              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="injection in injections" :key="injection._id">
              <td class="d-none d-md-table-cell">
                {{ injection.age.vaccine.name }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ injection.injectionTime }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ injection.distanceFromPrevious }}
                {{
                  translatedistanceTimeType(injection.distanceFromPreviousType)
                }}
              </td>
              <td class="d-none d-md-table-cell">
                + Từ:
                <span class="fw-bold">{{ injection.age.minAge }}</span> ({{
                  translateAgeType(injection.age.minAgeType)
                }})
                <br />
                + Đến:
                <span class="fw-bold">{{ injection.age.maxAge }}</span>
                ({{ translateAgeType(injection.age.maxAgeType) }})
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    :to="{
                      name: 'edit-injection',
                      params: { id: injection.id },
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
