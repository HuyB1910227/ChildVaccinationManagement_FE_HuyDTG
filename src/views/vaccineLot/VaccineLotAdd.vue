<script setup>
import { ref } from "vue";
import { useVaccineLotStore } from "@/stores/VaccineLotStore";
import VaccineLotForm from "../../components/vaccineLots/VaccineLotForm.vue";
import VaccineLotUpdatedDetail from "@/components/vaccineLots/VaccineLotUpdatedDetail.vue";
const vaccineLotStore = useVaccineLotStore();
const vaccineLotUpdated = ref(null);
const updatedNoti = ref(false);

const create = async (data) => {
  vaccineLotUpdated.value = await vaccineLotStore.create(data);
  console.log(data);
  if (vaccineLotUpdated.value) {
    updatedNoti.value = true;
  } else {
    alert("Thêm thông tin thất bại");
    updatedNoti.value = false;
  }
};
</script>
<template>
  <BasePageHeading title="THÊM LÔ VẮC XIN">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'vaccine-lots' }" class="link-fx"
              >Lô vắc xin</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="thêm thông tin lô vắc xin">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <VaccineLotForm :vaccineLot="{}" @submit:vaccineLot="create" />
        </div>
      </div>
    </BaseBlock>

    <div class="row" v-if="updatedNoti">
      <div class="col-md-12">
        <VaccineLotUpdatedDetail :vaccineLot="vaccineLotUpdated" />
      </div>
    </div>
  </div>
</template>
