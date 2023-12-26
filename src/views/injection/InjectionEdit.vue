<script setup>
import { ref, onMounted, reactive } from "vue";
import { useInjectionStore } from "@/stores/InjectionStore";
import { useAgeStore } from "@/stores/AgeStore";
import VaccineService from "@/services/vaccine.service";
import router from "@/router";
import { AgeType } from "@/data/ageType";
import AgeForm from "@/components/ages/AgeForm.vue";
import InjectionForm from "@/components/injections/InjectionForm.vue";
import AgeService from "@/services/age.service";
import InjectionService from "@/services/injection.service";
import Swal from "sweetalert2";
import { useCheckRole } from "@/reuse/useCheckRole";
import InjectionUpdatedDetail from "@/components/injections/InjectionUpdatedDetail.vue";
import { RequestAgeType } from "@/data/requestAgeType";
const checkHasAnyRole = useCheckRole();
const injectionStore = useInjectionStore();
const ageStore = useAgeStore();
const vaccine = ref(null);
const injections = ref(null);
const uniqueAge = ref(null);
const ageUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);
const ageProps = ref(null);
const obj = reactive({
  vaccine: null,
});
const objInjection = reactive({
  ages: null,
});
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const getVaccine = async (id) => {
  try {
    vaccine.value = await VaccineService.get(id);
    obj.vaccine = vaccine.value;
    const params = ageStore.getRequestParams(1, 500, obj);
    const ageRes = await ageStore.getAll(params);

    if (ageRes.data.length > 0) {
      uniqueAge.value = new Set(
        ageRes.data.map((item) => JSON.stringify(item))
      );
      uniqueAge.value = Array.from(uniqueAge.value).map((item) =>
        JSON.parse(item)
      );

      objInjection.ages = uniqueAge;
      const paramsInjection = injectionStore.getRequestParams(
        1,
        500,
        objInjection
      );
      const resInjection = await injectionStore.getAll(paramsInjection);
      injections.value = resInjection.data;
    }
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

const refreshAge = async () => {
  try {
    const params = ageStore.getRequestParams(1, 500, obj);
    const ageRes = await ageStore.getAll(params);
    if (ageRes.data.length > 0) {
      uniqueAge.value = new Set(
        ageRes.data.map((item) => JSON.stringify(item))
      );
      uniqueAge.value = Array.from(uniqueAge.value).map((item) =>
        JSON.parse(item)
      );
      objInjection.ages = uniqueAge;
      const paramsInjection = injectionStore.getRequestParams(
        1,
        500,
        objInjection
      );
      const resInjection = await injectionStore.getAll(paramsInjection);
      injections.value = resInjection.data;
    } else {
      uniqueAge.value = null;
    }
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  getVaccine(props.id);
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

const getInjectionsByAge = (ageId) => {
  let result = [];
  if (injections.value) {
    result = injections.value.filter((inj) => inj.age.id === ageId);
  }
  result.sort((a, b) => a.injectionTime - b.injectionTime);
  return result;
};
const handlePropsAge = (age) => {
  if (age == null) {
    ageProps.value = {};
  } else {
    ageProps.value = age;
  }
};
import AgeUpdatedDetail from "../../components/ages/AgeUpdatedDetail.vue";
const ageUpdatedDetailAlert = ref(null);
const handleCreateAge = async (data) => {
  ageUpdated.value = await ageStore.create(data);
  if (ageUpdated.value) {
    ageUpdatedDetailAlert.value.retriveUpdatedAgeInformation(ageUpdated.value);
    refreshAge();
  } else {
    alert("Thêm thông tin thất bại");
  }
};

const handleUpdateAge = async (data) => {
  ageUpdated.value = await ageStore.update(data.id, data);
  if (ageUpdated.value) {
    refreshAge();
    ageUpdatedDetailAlert.value.retriveUpdatedAgeInformation(ageUpdated.value);
  } else {
    alert("Thêm thông tin thất bại");
  }
};

const handleDeleteAge = async (id) => {
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
    confirmButtonText: "Đồng ý xóa!",
    cancelButtonText: "Hủy",
    html: false,
    preConfirm: async () => {
      try {
        const res = await AgeService.delete(id);
        if (res.status == 204) {
          deleted = true;
          refreshAge();
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
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const handleDeleteInjection = async (id) => {
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
        const res = await InjectionService.delete(id);
        if (res.status == 204) {
          deleted = true;
          refreshAge();
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
    } else {
      Swal.fire(
        "Xóa dữ liệu thất bại",
        "Không thể xóa được dữ liệu này, yêu cầu kiểm tra lại!.",
        "error"
      );
    }
  }
};

const injectionProps = ref(null);
const injectionAgeProps = ref(null);
const injectionUpdated = ref(null);
const InjectionUpdatedDetailAlert = ref(null);
const handleCreateInjectionForm = async (inj, age) => {
  console.log(inj);
  console.log(age);
  injectionProps.value = inj;
  injectionAgeProps.value = age;
};

const handleCreateInjection = async (data) => {
  injectionUpdated.value = await injectionStore.create(data);
  if (injectionUpdated.value) {
    handleCreateInjectionForm(
      { injectionTime: injectionUpdated.value.injectionTime + 1 },
      injectionUpdated.value.age
    );
    InjectionUpdatedDetailAlert.value.retriveUpdatedInjectionInformation(
      injectionUpdated.value
    );
    refreshAge();
  } else {
    alert("Thêm thông tin thất bại");
  }
};

const handleUpdateInjection = async (data) => {
  injectionUpdated.value = await injectionStore.update(data.id, data);
  if (injectionUpdated.value) {
    InjectionUpdatedDetailAlert.value.retriveUpdatedInjectionInformation(
      injectionUpdated.value
    );
    refreshAge();
  } else {
    alert("Thêm thông tin thất bại");
  }
};

const handleCloseAgeFormModal = () => {
  refreshAge();
  ageUpdatedDetailAlert.value.retriveUpdatedAgeInformation(null);
};

const handleCloseInjectionFormModal = () => {
  refreshAge();
  InjectionUpdatedDetailAlert.value.retriveUpdatedInjectionInformation(null);
};
</script>
<template>
  <BasePageHeading title="QUẢN LÝ THÔNG TIN MŨI TIÊM">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'vaccines' }" class="link-fx"
              >Vắc xin</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">
            Thông tin mũi tiêm
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content" v-if="vaccine">
    <BaseBlock title="Thông tin vắc xin">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <table class="table">
            <tr>
              <td class="w-25">Mã vắc xin:</td>
              <td>{{ vaccine.id }}</td>
            </tr>
            <tr>
              <td class="w-25">Tên vắc xin:</td>
              <td>{{ vaccine.name }}</td>
            </tr>
            <tr>
              <td class="w-25">Loại vắc xin:</td>
              <td>{{ vaccine.vaccineType.name }}</td>
            </tr>
            <tr>
              <td class="w-25">Phòng bệnh:</td>
              <td>
                {{ vaccine.diseases.map((disease) => disease.name).join(", ") }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </BaseBlock>

    <BaseBlock title="Thông tin mũi tiêm">
      <template #options>
        <button
          type="button"
          class="btn btn-alt-success"
          data-bs-toggle="modal"
          data-bs-target="#modal-block-edit-vaccine"
          @click="handlePropsAge({})"
          v-if="checkHasAnyRole(['ADMINISTRATOR'])"
        >
          + Thêm giai đoạn
        </button>
      </template>
      <div class="row p-1">
        <div class="col-lg-12 space-y-5" v-if="uniqueAge">
          <div
            v-for="age in uniqueAge"
            :key="age.id"
            class="border p-3 rounded m-3"
            :class="[
              age.requestType == RequestAgeType.TIEU_CHUAN
                ? 'bg-modern-lighter'
                : age.requestType == RequestAgeType.KHUYEN_CAO
                ? 'bg-success-light'
                : 'bg-smooth-lighter',
            ]"
          >
            <div class="row my-2">
              <p class="col-md-7">
                Giai đoạn: Từ
                <span class="fw-bold"
                  >{{ age.minAge }} ({{
                    translateAgeType(age.minAgeType)
                  }})</span
                >
                đến
                <span class="fw-bold"
                  >{{ age.maxAge }} ({{
                    translateAgeType(age.maxAgeType)
                  }})</span
                >
                <br />
                Yêu cầu:
                <span class="fw-bold">
                  {{
                    age.requestType == RequestAgeType.TIEU_CHUAN
                      ? "Tuân theo chỉ định"
                      : age.requestType == RequestAgeType.KHUYEN_CAO
                      ? "Có thể thay đổi lựa chọn mũi tiêm"
                      : "Theo chỉ định của bác sĩ chuẩn đoán"
                  }}
                </span>
              </p>
              <div class="col-md-5 d-flex justify-content-end">
                <div
                  class="col-sm-6 col-xl-4"
                  v-if="checkHasAnyRole(['ADMINISTRATOR'])"
                >
                  <div class="dropdown">
                    <button
                      type="button"
                      class="btn btn-primary dropdown-toggle me-2"
                      id="dropdown-default-primary"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Thao tác
                    </button>
                    <div
                      class="dropdown-menu fs-sm"
                      aria-labelledby="dropdown-default-primary"
                    >
                      <button
                        class="btn btn-alt-warning me-1 dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#modal-block-edit-vaccine"
                        @click="handlePropsAge(age)"
                      >
                        <i class="fa fa-fw fa-pencil-alt"></i> Sửa giai đoạn
                      </button>
                      <button
                        class="btn btn-alt-danger me-1 dropdown-item"
                        @click="handleDeleteAge(age.id)"
                      >
                        <i class="fa-solid fa-trash"></i> Xóa giai đoạn
                      </button>
                      <button
                        class="btn btn-alt-success dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#modal-block-edit-injection"
                        @click="
                          handleCreateInjectionForm(
                            {
                              injectionTime:
                                getInjectionsByAge(age.id).length + 1,
                            },
                            age
                          )
                        "
                      >
                        <i class="fa-solid fa-plus"></i>
                        Thêm mũi tiêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <table
              class="table table-bordered table-striped table-vcenter"
              v-if="getInjectionsByAge(age.id).length > 0"
            >
              <thead>
                <tr>
                  <th class="d-none d-md-table-cell">Lần tiêm</th>
                  <th class="d-none d-md-table-cell">Hiệu lực</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(injection, index) in getInjectionsByAge(age.id)"
                  :key="injection.id"
                >
                  <td>{{ injection.injectionTime }}</td>
                  <td v-if="index >= 0">
                    {{ injection.distanceFromPrevious }}
                    {{
                      translatedistanceTimeType(
                        injection.distanceFromPreviousType
                      )
                    }}
                  </td>
                  <td v-else>Lần tiêm đầu tiên</td>
                  <td>
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-sm btn-alt-primary"
                        v-if="index >= 0 && checkHasAnyRole(['ADMINISTRATOR'])"
                        data-bs-toggle="modal"
                        data-bs-target="#modal-block-edit-injection"
                        @click="handleCreateInjectionForm(injection, age)"
                      >
                        <i class="fa fa-fw fa-pencil-alt"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-alt-danger"
                        @click="handleDeleteInjection(injection.id)"
                        v-if="
                          index == getInjectionsByAge(age.id).length - 1 &&
                          checkHasAnyRole(['ADMINISTRATOR'])
                        "
                      >
                        <i class="fa fa-fw fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table v-else class="w-100">
              <p class="fw-bold fst-italic text-center">
                Chưa có thông tin mũi tiêm
              </p>
            </table>
            <div class="p-3 rounded bi-white m-2 bg-white">
              Ghi chú: {{ age.note ?? "Không có ghi chú" }}
            </div>
          </div>
        </div>
        <div v-else class="col-lg-12 space-y-5">
          <p class="fw-bold fst-italic text-center">
            Chưa có thông tin mũi tiêm
          </p>
        </div>
      </div>
      <div></div>
    </BaseBlock>
  </div>

  <div
    class="modal"
    id="modal-block-edit-vaccine"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock
          title="Cập nhật thông tin giai đoạn tiêm"
          transparent
          class="mb-0"
        >
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="handleCloseAgeFormModal"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>

          <template #content>
            <div class="block-content fs-sm">
              <AgeForm
                v-if="vaccine && ageProps"
                :age="ageProps"
                :vaccine="vaccine"
                @submit:age="handleCreateAge"
                @submitUpdate:age="handleUpdateAge"
                :uniqueAge="uniqueAge ? uniqueAge : []"
              ></AgeForm>
              <AgeUpdatedDetail ref="ageUpdatedDetailAlert" />
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>

  <div
    class="modal"
    id="modal-block-edit-injection"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-block-extra-large"
    aria-hidden="true"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <BaseBlock
          title="Cập nhật thông tin giai đoạn tiêm"
          transparent
          class="mb-0"
        >
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="handleCloseInjectionFormModal"
            >
              <i class="fa fa-fw fa-times"></i>
            </button>
          </template>
          <template #content>
            <div class="block-content fs-sm">
              <InjectionForm
                v-if="injectionProps && injectionAgeProps"
                :injection="injectionProps"
                :age="injectionAgeProps"
                @submitUpdate:injection="handleUpdateInjection"
                @submit:injection="handleCreateInjection"
              ></InjectionForm>
              <InjectionUpdatedDetail ref="InjectionUpdatedDetailAlert" />
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
