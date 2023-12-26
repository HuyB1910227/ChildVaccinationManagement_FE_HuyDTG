<script setup>
import DiseaseService from "../../services/disease.service";
import BaseLayoutSearch from "../../components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, computed, reactive } from "vue";
import Paginate from "vuejs-paginate-next";
import { useDiseaseStore } from "@/stores/DiseaseStore";
import { useCheckRole } from "@/reuse/useCheckRole";
const checkHasAnyRole = useCheckRole();
const diseases = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSizes = ref([5, 10, 25, 50, 100]);
const pageSize = ref(10);
const page = ref(1);
const diseaseStore = useDiseaseStore();
import Swal from "sweetalert2";

const searchOb = reactive({
  name: null,
  description: null,
});
const retriveDiseases = async () => {
  try {
    const params = diseaseStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await diseaseStore.getAll(params);
    diseases.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
  } catch (error) {
    console.log(error);
  }
};

const handlePageSizeChange = (event) => {
  pageSize.value = event.target.value;
  let total = Math.ceil(totalRecords.value / pageSize.value);
  if (page.value > total) {
    page.value = total;
  }
  retriveDiseases();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveDiseases();
};

const handleSearch = () => {
  page.value = 1;
  retriveDiseases();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.name = null;
  searchOb.description = null;
  retriveDiseases();
};

const totalPages = computed(() => {
  if (totalRecords.value && pageSize.value) {
    return Math.ceil(totalRecords.value / pageSize.value);
  }
  return 0;
});

const deleteDisease = async (id) => {
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
        const res = await DiseaseService.delete(id);
        if (res.status == 204) {
          deleted = true;
        }
        return deleted;
      } catch (error) {
        Swal.fire(
          "Không thể xóa",
          "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
          "error"
        );
      }
    },
  });

  if (result.isConfirmed) {
    if (deleted) {
      Swal.fire("Đã xóa!", "Dữ liệu đã được xóa thành công.", "success");
      retriveDiseases();
    } else {
      Swal.fire(
        "Không thể xóa",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

onMounted(() => {
  retriveDiseases();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ LOẠI DỊCH BỆNH">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Phân loại</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">Loại dịch bệnh</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <div class="row mb-2" v-if="checkHasAnyRole(['ADMINISTRATOR'])">
      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <RouterLink class="btn btn-primary" :to="{ name: 'add-disease' }"
          >Thêm loại dịch bệnh</RouterLink
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
            <div class="col-6">
              <label for="name">Mô tả</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo mô tả..."
                v-model="searchOb.description"
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
    <BaseBlock title="Bảng thông tin loại dịch bệnh" content-full>
      <div class="row">
        <div id="datasetLength" class="col-md-8 py-2">
          <select
            v-model="pageSize"
            class="form-select"
            style="width: 100px"
            @change="handlePageSizeChange($event)"
          >
            <option v-for="size in pageSizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
      </div>

      <table class="table table-bordered table-striped table-vcenter">
        <thead>
          <tr>
            <th style="width: 20px">STT</th>
            <th class="d-none d-md-table-cell">Tên</th>
            <th class="d-none d-sm-table-cell">Mô tả</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(disease, index) in diseases" :key="disease._id">
            <td class="fw-semibold fs-sm">
              {{ ++index }}
            </td>
            <td class="d-none d-md-table-cell">
              {{ disease.name }}
            </td>
            <td class="d-none d-sm-table-cell">
              {{ disease.description }}
            </td>
            <td class="text-center">
              <div class="btn-group">
                <RouterLink
                  v-if="checkHasAnyRole(['ADMINISTRATOR'])"
                  :to="{ name: 'edit-disease', params: { id: disease.id } }"
                  type="button"
                  class="btn btn-sm btn-alt-primary"
                >
                  <i class="fa fa-fw fa-pencil-alt"></i>
                </RouterLink>
                <button
                  v-if="checkHasAnyRole(['ADMINISTRATOR'])"
                  type="button"
                  class="btn btn-sm btn-alt-danger"
                  @click="deleteDisease(disease.id)"
                >
                  <i class="fa fa-fw fa-times"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <div class="pt-2 fs-sm">Tổng số: {{ totalRecords }} bản ghi</div>
        <div class="flex-wrap pt-2 fs-sm">
          <paginate
            v-model="page"
            :page-count="totalPages"
            :page-range="3"
            :prev-text="'<'"
            :next-text="'>'"
            :click-handler="handlePageChange"
            :container-class="'pagination'"
          >
          </paginate>
        </div>
      </div>
    </BaseBlock>
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
