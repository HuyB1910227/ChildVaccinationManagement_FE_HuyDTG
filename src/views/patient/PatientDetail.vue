<script setup>
import { ref, onMounted } from "vue";
import PatientService from "@/services/patient.service";
import router from "@/router";
import CustomerDetailBox from "@/components/customers/CustomerDetailBox.vue";
import PatientDetailBox from "@/components/patients/PatientDetailBox.vue";
import NutritionViewBox from "@/components/nutritions/NutritionViewBox.vue";

const patientUpdated = ref(null);

const handleUpdated = (data) => {
  patientUpdated.value = data;
};
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const patient = ref(null);
const getPatient = async (id) => {
  try {
    patient.value = await PatientService.get(id);
    console.log(patient.value);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

onMounted(() => {
  getPatient(props.id);
});
</script>
<template>
  <BasePageHeading title="CHỈ SỐ CƠ THỂ">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'patients' }" class="link-fx"
              >Thông tin trẻ em</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Chỉ số cơ thể</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <PatientDetailBox v-if="patient" :patient="patient" />
    <NutritionViewBox v-if="patient" :patientId="patient.id" />
  </div>
</template>
