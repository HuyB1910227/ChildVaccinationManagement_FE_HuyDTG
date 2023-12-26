<script setup>
import { ref, onMounted } from "vue";
import { useVaccineTypeStore } from "@/stores/VaccineTypeStore";
import VaccineTypeService from "@/services/vaccineType.service";
import VaccineTypeForm from "../../components/vaccineTypes/VaccineTypeForm.vue";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";
import router from "@/router";
const vaccineTypeStore = useVaccineTypeStore();
const vaccineType = ref(null);
const vaccineTypeUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const getVaccineType = async (id) => {
  try {
    vaccineType.value = await VaccineTypeService.get(id);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};
const updateVaccineType = async (data) => {
  vaccineTypeUpdated.value = await vaccineTypeStore.update(props.id, data);
  if (vaccineTypeUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  console.log(props.id);
  getVaccineType(props.id);
});

const exampleBlock1 = ref(null);
function loadDataForBlock1() {
  exampleBlock1.value.statusLoading();
  setTimeout(() => {
    exampleBlock1.value.statusNormal();
  }, 2000);
}
</script>
<template>
  <BasePageHeading title="Cập nhật loại vắc xin">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Phân loại</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'vaccine-types' }" class="link-fx"
              >Loại vắc xin</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="cập nhật thông tin loại vắc xin">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <VaccineTypeForm
            v-if="vaccineType !== null"
            :vaccineType="vaccineType"
            @submit:vaccineType="updateVaccineType"
          />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <BaseBlock
          title="Cập nhật"
          subtitle="Thông tin vừa được cập nhật thành công"
          ref="exampleBlock1"
          btn-option-content
          header-class="bg-success"
          themed
        >
          <template #options>
            <button
              type="button"
              class="btn-block-option"
              @click="loadDataForBlock1"
            >
              <i class="si si-refresh"></i>
            </button>
          </template>
          <table class="table">
            <tr>
              <td style="width: 250px">Tên loại vắc xin:</td>
              <td>{{ vaccineTypeUpdated.name }}</td>
            </tr>
          </table>

          <em class="text-secondary fw-lighter">{{
            formatDateFromInstantToDateTime(updatedTime)
          }}</em>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>
