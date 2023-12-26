<script setup>
import { ref } from "vue";
import { usePatientStore } from "@/stores/PatientStore";
import PatientForm from "@/components/patients/PatientForm.vue";
const patientStore = usePatientStore();
const patientUpdated = ref(null);
const emit = defineEmits("created:patient");
const create = async (data) => {
  patientUpdated.value = await patientStore.create(data);
  console.log(patientUpdated.value);
  if (patientUpdated.value) {
    emit("created:patient", patientUpdated.value);
  } else {
    alert("Thêm thông tin thất bại");
  }
};
const props = defineProps({
  customer: {
    type: Object,
    require: true,
  },
});

const customer = ref(props.customer);
</script>
<template>
  <BaseBlock title="thêm thông tin trẻ em">
    <div class="row">
      <div class="col-lg-12 space-y-5">
        <PatientForm
          :patient="{}"
          :customer="customer"
          @submit:patient="create"
        />
      </div>
    </div>
  </BaseBlock>
</template>
