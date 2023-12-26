<script setup>
import AssignmentForm from "./AssignmentForm.vue";
import AssignmentUpdatedDetailBox from "./AssignmentUpdatedDetailBox.vue";
import { useAssignmentStore } from "@/stores/assignment";
import { ref } from "vue";

const assignmentStore = useAssignmentStore();
const assignmentUpdated = ref(null);
const assignmentFormRef = ref(null);
const emit = defineEmits("updated:assignment");
const create = async (data) => {
  assignmentUpdated.value = await assignmentStore.create(data);
  console.log(assignmentUpdated.value);
  if (assignmentUpdated.value) {
    emit("updated:assignment", assignmentUpdated.value);
    assignmentFormRef.value.resetAll();
  } else {
    alert("Thêm thông tin thất bại");
  }
};
const props = defineProps({
  appointmentCard: {
    type: Object,
    require: true,
  },
});

const appointmentCard = ref(props.appointmentCard);
</script>
<template>
  <BaseBlock title="Thêm Chỉ định" btn-option-content>
    <AssignmentForm
      :assignment="{}"
      :appointmentCard="appointmentCard"
      @submit:assignment="create"
      ref="assignmentFormRef"
    />
    <AssignmentUpdatedDetailBox
      v-if="assignmentUpdated"
      :assignmentUpdated="assignmentUpdated"
    />
  </BaseBlock>
</template>
