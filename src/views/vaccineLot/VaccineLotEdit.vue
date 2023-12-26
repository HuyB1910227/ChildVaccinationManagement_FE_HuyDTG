<script setup>
import { ref, onMounted } from "vue";
import { useVaccineLotStore } from "@/stores/vaccineLotStore";
import VaccineLotForm from "@/components/vaccineLots/vaccineLotForm.vue";
import vaccineLotService from "@/services/vaccineLot.service";
import VaccineLotUpdatedDetail from "@/components/vaccineLots/VaccineLotUpdatedDetail.vue";
import router from "@/router";
import { useAuthStore } from "@/stores/AuthStore";
const authStore = useAuthStore();
const isAministrator = authStore.hasRole("ADMINISTRATOR");
const vaccineLotStore = useVaccineLotStore();
const vaccineLot = ref(null);
const vaccineLotUpdated = ref(null);
const updatedNoti = ref(false);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const getvaccineLot = async (id) => {
  try {
    vaccineLot.value = await vaccineLotService.get(id);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};
const updatevaccineLot = async (data) => {
  vaccineLotUpdated.value = await vaccineLotStore.update(props.id, data);
  if (vaccineLotUpdated.value) {
    updatedNoti.value = true;
  } else {
    updatedNoti.value = false;
    alert("Cập nhật thất bại");
  }
};

onMounted(() => {
  getvaccineLot(props.id);
});
</script>
<template>
  <BasePageHeading title="Cập nhật vắc xin">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'vaccine-lots' }" class="link-fx"
              >Lô vắc xin</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <BaseBlock title="cập nhật thông tin vắc xin">
      <div class="row">
        <div class="col-lg-12 space-y-5">
          <VaccineLotForm
            v-if="vaccineLot !== null"
            :vaccineLot="vaccineLot"
            @submit:vaccineLot="updatevaccineLot"
          />
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
