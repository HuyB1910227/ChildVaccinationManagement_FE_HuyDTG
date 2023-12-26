<script setup>
import VaccineService from "@/services/vaccine.service";
import BaseLayoutSearch from "@/components/Search/BaseLayoutSearch.vue";
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useVaccineStore } from "@/stores/VaccineStore";
import { useVaccineTypeStore } from "@/stores/VaccineTypeStore";
import { useDiseaseStore } from "@/stores/DiseaseStore";
import VueSelect from "vue-select";
import { useCheckRole } from "@/reuse/useCheckRole";
const checkHasAnyRole = useCheckRole();
const vaccines = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const vaccineStore = useVaccineStore();
const vaccineTypeStore = useVaccineTypeStore();
const diseaseStore = useDiseaseStore();
const optionDisease = ref(null);
const optionVaccineType = ref(null);
import Swal from "sweetalert2";
const searchOb = reactive({
  name: null,
  dosage: null,
  commonReaction: null,
  vaccineType: null,
  diseases: null,
});
const retriveVaccine = async () => {
  try {
    const params = vaccineStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await vaccineStore.getAll(params);
    vaccines.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
  } catch (error) {
    console.log(error);
  }
};

const retriveOption = async () => {
  optionDisease.value = await diseaseStore.getDiseaseFSelect();
  optionVaccineType.value = await vaccineTypeStore.getVaccineTypeFSelect();
};

const handlePageSizeChange = (value) => {
  pageSize.value = value;
  let total = Math.ceil(totalRecords.value / pageSize.value);
  if (page.value > total) {
    page.value = total;
  }
  retriveVaccine();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveVaccine();
};

const handleSearch = () => {
  page.value = 1;
  retriveVaccine();
};

const clearSearch = () => {
  page.value = 1;
  searchOb.name = null;
  searchOb.dosage = null;
  searchOb.commonReaction = null;
  searchOb.vaccineType = null;
  searchOb.diseases = null;
  retriveVaccine();
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
        const res = await VaccineService.delete(id);
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
      retriveVaccine();
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};
const htmlData = ref(null);
const propsHTMLData = (data) => {
  htmlData.value = data;
};

onMounted(() => {
  retriveVaccine();
  retriveOption();
});
</script>

<template>
  <BasePageHeading title="QUẢN LÝ VẮC XIN">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Vắc xin</a>
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
        <RouterLink class="btn btn-primary" :to="{ name: 'add-vaccine' }"
          >Thêm vắc xin</RouterLink
        >
      </div>
    </div>

    <BaseLayoutSearch>
      <template #formSearch>
        <form @submit.prevent>
          <div class="row pb-2">
            <div class="col-6 my-1">
              <label for="name" class="my-1">Tên</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo tên..."
                v-model="searchOb.name"
              />
            </div>
            <div class="col-6 my-1">
              <label for="name" class="my-1">Liều lượng</label>
              <input
                type="number"
                class="form-control"
                placeholder="0.1 ...."
                step="0.1"
                pattern="[0-9]+(\.[0-9]+)?"
                v-model="searchOb.dosage"
              />
            </div>
            <div class="col-6 my-1">
              <label for="name" class="my-1">Phản ứng thường gặp</label>
              <input
                type="text"
                class="form-control"
                placeholder="Phản ứng..."
                v-model="searchOb.commonReaction"
              />
            </div>
            <div class="col-6 my-1" v-if="optionVaccineType">
              <label for="" class="my-1">Loại vắc xin</label>
              <VueSelect
                v-model="searchOb.vaccineType"
                :options="optionVaccineType"
                placeholder="Chọn loại vắc xin"
                label="name"
              ></VueSelect>
            </div>
            <div class="col-6 my-1" v-if="optionDisease">
              <label for="" class="my-1">Loại dịch bệnh</label>
              <VueSelect
                multiple
                v-model="searchOb.diseases"
                :options="optionDisease"
                placeholder="Chọn loại dịch bệnh"
                label="name"
              ></VueSelect>
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
              <th style="width: 20px">STT</th>
              <th class="d-none d-md-table-cell">Tên</th>
              <th class="d-none d-md-table-cell">Liều lượng</th>
              <th class="d-none d-md-table-cell">Phản ứng thường gặp</th>
              <th class="d-none d-md-table-cell">Phòng bệnh</th>
              <th class="d-none d-md-table-cell">Loại</th>
              <th class="d-none d-md-table-cell">Mô tả</th>
              <th class="d-none d-md-table-cell">Chống chỉ định</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vaccine, index) in vaccines" :key="vaccine._id">
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ vaccine.name }}
              </td>
              <td class="d-none d-md-table-cell">{{ vaccine.dosage }} ml</td>
              <td class="d-none d-md-table-cell">
                {{ vaccine.commonReaction }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ vaccine.diseases.map((disease) => disease.name).join(", ") }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ vaccine.vaccineType.name }}
              </td>
              <td class="d-none d-md-table-cell text-center">
                <button
                  class="btn btn-sm btn-alt-info"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-block-html-details"
                  @click="propsHTMLData(vaccine.description)"
                >
                  <i class="fa-solid fa-circle-info"></i>
                </button>
              </td>
              <td
                class="d-none d-md-table-cell text-center"
                data-bs-toggle="modal"
                data-bs-target="#modal-block-html-details"
                @click="propsHTMLData(vaccine.contraindication)"
              >
                <button class="btn btn-sm btn-alt-info">
                  <i class="fa-solid fa-circle-info"></i>
                </button>
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <RouterLink
                    v-if="checkHasAnyRole(['ADMINISTRATOR'])"
                    :to="{
                      name: 'edit-vaccine',
                      params: { id: vaccine.id },
                    }"
                    type="button"
                    class="btn btn-sm btn-alt-primary"
                  >
                    <i class="fa fa-fw fa-pencil-alt"></i>
                  </RouterLink>

                  <RouterLink
                    class="btn btn-sm btn-alt-primary"
                    :to="{ name: 'edit-injection', params: { id: vaccine.id } }"
                  >
                    <i class="fa-solid fa-file-pen"></i
                  ></RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </NormalTable>
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
              @click="handleCloseAppointmentCardModal"
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
