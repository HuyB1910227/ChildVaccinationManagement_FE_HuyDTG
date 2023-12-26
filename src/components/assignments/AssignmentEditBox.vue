<script setup>
import AssignmentForm from "./AssignmentForm.vue";
import { useAssignmentStore } from "@/stores/assignment";
import { ref, onMounted } from "vue";
import router from "@/router";
import AssignmentService from "@/services/assignment.service";
const assignmentStore = useAssignmentStore();
const assignmentUpdated = ref(null);
const emit = defineEmits(["updated:assignment", "close:edit:vaccineLot"]);
const update = async (data) => {
  assignmentUpdated.value = await assignmentStore.update(
    props.assignmentId,
    data
  );
  console.log(assignmentUpdated.value);
  if (assignmentUpdated.value) {
    emit("updated:assignment", assignmentUpdated.value);
  } else {
    alert("Thêm thông tin thất bại");
  }
};
const assignment = ref(null);
const getAssignment = async (id) => {
  try {
    assignment.value = await AssignmentService.get(id);
    console.log(assignment.value);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

const props = defineProps({
  assignmentId: {
    type: Object,
    require: true,
  },
});

onMounted(() => {
  getAssignment(props.assignmentId);
});
</script>
<template>
  <BaseBlock title="Cập nhật Chỉ định" btn-option-content>
    <AssignmentForm
      v-if="assignment"
      :assignment="assignment"
      @submit:assignment="update"
    />
    <button class="btn btn-primary" @click="emit('close:edit:vaccineLot')">
      Thêm chỉ định mới
    </button>
  </BaseBlock>
</template>
