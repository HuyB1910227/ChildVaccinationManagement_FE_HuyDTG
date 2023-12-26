<script setup>
import { ref } from "vue";
import { usePatientStore } from "@/stores/PatientStore";
import PatientForm from "@/components/patients/PatientForm.vue";
const patientStore = usePatientStore();
const patientUpdated = ref(null);
const props = defineProps({
  patient: {
    type: Object,
    require: true,
  },
});
const emit = defineEmits(["updated:patient"]);
const updatePatient = async (data) => {
  patientUpdated.value = await patientStore.update(props.patient.id, data);
  //   console.log(patientUpdated.value);
  if (patientUpdated.value) {
    emit("updated:patient", patientUpdated.value);
  } else {
    alert("Cập nhật thất bại");
  }
};
</script>
<template>
  <BaseBlock title="cập nhật thông tin của trẻ">
    <div class="row">
      <div class="col-lg-12 space-y-5">
        <PatientForm
          v-if="patient"
          :patient="patient"
          @submit:patient="updatePatient"
        />
      </div>
    </div>
  </BaseBlock>
</template>
