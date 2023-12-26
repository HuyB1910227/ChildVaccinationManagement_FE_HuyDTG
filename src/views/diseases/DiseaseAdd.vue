<script setup>
import { ref } from "vue";
import { useDiseaseStore } from "@/stores/DiseaseStore";
import DiseaseForm from "@/components/Disease/DiseaseForm.vue";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";
const { formatDateFromInstantToDateTime } = useChangeDateFormat();
const diseaseStore = useDiseaseStore();
const diseaseUpdated = ref(null);
const updatedNoti = ref(false);
const updatedTime = ref(null);

const createDisease = async (data) => {
  diseaseUpdated.value = await diseaseStore.create(data);
  if (diseaseUpdated.value) {
    updatedNoti.value = true;
    updatedTime.value = new Date();
    console.log(diseaseUpdated.value);
  } else {
    alert("Thêm thông tin thất bại");
    updatedNoti.value = false;
  }
};

const exampleBlock1 = ref(null);
function loadDataForBlock1() {
  exampleBlock1.value.statusLoading();
  setTimeout(() => {
    exampleBlock1.value.statusNormal();
  }, 2000);
}
</script>
<template>
  <BasePageHeading title="THÊM LOẠI DỊCH BỆNH">
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
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="thêm thông tin dịch bệnh">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <DiseaseForm :disease="{}" @submit:disease="createDisease" />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <BaseBlock
          title="Thêm"
          subtitle="Thông tin vừa được thêm thành công"
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
