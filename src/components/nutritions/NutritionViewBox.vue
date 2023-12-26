<script setup>
import { ref, onMounted, reactive } from "vue";
import NormalTable from "@/components/tables/NormalTable.vue";
import { useNutritionStore } from "@/stores/NutritionStore";
import NutritionService from "@/services/nutrition.service";
import NutritionForm from "./NutritionForm.vue";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const nutritions = ref(null);
const headerResponse = ref(null);
const totalRecords = ref(null);
const pageSize = ref(10);
const page = ref(1);
const nutritionStore = useNutritionStore();
const { formatDateFromInstantToDate } = useChangeDateFormat();
const nutritionData = ref(null);
import Swal from "sweetalert2";
const props = defineProps({
  patientId: {
    required: true,
    type: String,
  },
});
const searchOb = reactive({
  patientId: props.patientId,
});
const retriveNutritions = async () => {
  try {
    const params = nutritionStore.getRequestParams(
      page.value,
      pageSize.value,
      searchOb
    );
    const res = await nutritionStore.getAll(params);
    nutritions.value = res.data;
    headerResponse.value = res.headers;
    totalRecords.value = headerResponse.value["x-total-count"];
    console.log(nutritions.value);
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
  retriveNutritions();
};

const handlePageChange = (value) => {
  page.value = value;
  retriveNutritions();
};
const nutritionFormRef = ref(null);
const isShowSucessAlert = ref(false);
const createNutrition = async (data) => {
  const res = await nutritionStore.create(data);
  if (res) {
    isShowSucessAlert.value = true;
    nutritionFormRef.value.clearForm();
  }
};

const updateNutrition = async (data) => {
  const res = await nutritionStore.update(data.id, data);
  if (res) {
    isShowSucessAlert.value = true;
  }
};

const handleDropNutrition = (data) => {
  if (data == {}) {
    nutritionData.value = {};
    console.log(nutritionData.value);
  } else {
    nutritionData.value = data;
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
        const res = await NutritionService.delete(id);
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
      retriveNutritions();
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const handleCloseNutritionFormModal = () => {
  nutritionFormRef.value.clearForm();
  isShowSucessAlert.value = false;
  retriveNutritions();
};

onMounted(() => {
  retriveNutritions();
});
</script>

<template>
  <div v-if="nutritions == []">Chưa có thông tin về chiều cao, cân nặng</div>
  <div v-else>
    <NormalTable
      @update:pageSize="handlePageSizeChange"
      @update:page="handlePageChange"
      :totalRecordsc="totalRecords"
      :pagec="page"
    >
      <template #topRightEdgeOfTheTable>
        <div class="d-flex justify-content-end">
          <button
            class="m-0 btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modal-block-add-nutrition"
            @click="handleDropNutrition({})"
          >
            Thêm chỉ số
          </button>
        </div>
      </template>
      <template #tableContent>
        <table class="table table-bordered table-striped table-vcenter">
          <thead>
            <tr>
              <th style="width: 20px">STT</th>
              <th class="d-none d-md-table-cell">Cân nặng (Kilogram)</th>
              <th class="d-none d-md-table-cell">Chiều cao (met)</th>
              <th class="d-none d-md-table-cell">Ngày đo</th>
              <th class="d-none d-md-table-cell">Ghi chú</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(nutrition, index) in nutritions" :key="nutrition.id">
              <td class="fw-semibold fs-sm">
                {{ ++index }}
              </td>
              <td class="d-none d-md-table-cell">{{ nutrition.weight }} kg</td>
              <td class="d-none d-md-table-cell">{{ nutrition.height }} m</td>
              <td class="d-none d-md-table-cell">
                {{ formatDateFromInstantToDate(nutrition.measurementDate) }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ nutrition.status }}
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <button
                    type="button"
                    class="btn btn-sm btn-alt-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-block-add-nutrition"
                    @click="handleDropNutrition(nutrition)"
                  >
                    <i class="fa fa-fw fa-pencil-alt"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-alt-danger"
                    @click="deleteData(nutrition.id)"
                  >
                    <i class="fa fa-fw fa-times"></i>
                  </button>
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
    id="modal-block-add-nutrition"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock title="Cập nhật chỉ số cơ thể" transparent class="mb-0">
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="handleCloseNutritionFormModal"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-sm">
              <NutritionForm
                ref="nutritionFormRef"
                v-if="patientId && nutritionData"
                :nutrition="nutritionData"
                :patientId="patientId"
                @submit:nutrition="createNutrition"
                @submitUpdate:nutrition="updateNutrition"
              />
            </div>
            <div class="row">
              <div class="col-12">
                <div
                  class="alert alert-success d-flex align-items-center alert-dismissible fade show mx-3 mb-3"
                  role="alert"
                  v-if="isShowSucessAlert"
                >
                  <div class="flex-shrink-0">
                    <i class="fa-solid fa-check-double"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <p class="mb-0 fw-bold">Đã cập nhật chỉ số cơ thể</p>
                  </div>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    @click="isShowSucessAlert = false"
                  ></button>
                </div>
              </div>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
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
