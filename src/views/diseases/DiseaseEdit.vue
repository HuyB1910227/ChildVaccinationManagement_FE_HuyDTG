<script setup>
import { ref, onMounted } from "vue";
import { useDiseaseStore } from "@/stores/DiseaseStore";
import DiseaseService from "@/services/disease.service";
import DiseaseForm from "@/components/Disease/DiseaseForm.vue";
import router from "@/router";
import { useChangeDateFormat } from "@/reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const diseaseStore = useDiseaseStore();
const disease = ref(null);
const diseaseUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const getDisease = async (id) => {
  try {
    disease.value = await DiseaseService.get(id);
  } catch (e) {
    console.log("bị lỗi");

    router.push({
      name: "error-404",
    });
  }
};
const updateDisease = async (data) => {
  diseaseUpdated.value = await diseaseStore.update(props.id, data);
  if (diseaseUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  console.log(props.id);
  getDisease(props.id);
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
  <BasePageHeading title="CẬP NHẬT LOẠI DỊCH BỆNH">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <a class="link-fx" href="javascript:void(0)">Phân loại</a>
          </li>
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'diseases' }" class="link-fx"
              >Dịch bệnh</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="cập nhật thông tin loại dịch bệnh">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <DiseaseForm
            v-if="disease !== null"
            :disease="disease"
            @submit:disease="updateDisease"
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
              <td style="width: 250px">Tên dịch bệnh:</td>
              <td>{{ diseaseUpdated.name }}</td>
            </tr>
            <tr>
              <td>Mô tả:</td>
              <td>{{ diseaseUpdated.description }}</td>
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
