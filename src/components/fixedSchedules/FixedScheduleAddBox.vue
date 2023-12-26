<script setup>
import { ref } from "vue";
import { useFixedScheduleStore } from "@/stores/FixedScheduleStore";
import FixedScheduleForm from "@/components/fixedSchedules/FixedScheduleForm.vue";
const fixedScheduleStore = useFixedScheduleStore();
const fixedScheduleUpdated = ref(null);
const emit = defineEmits("created:fixedSchedule");
const create = async (data) => {
  console.log(data);
  fixedScheduleUpdated.value = await fixedScheduleStore.create(data);

  console.log(fixedScheduleUpdated.value);
  if (fixedScheduleUpdated.value) {
    emit("created:fixedSchedule", fixedScheduleUpdated.value);
  } else {
    alert("Thêm thông tin thất bại");
  }
};
</script>
<template>
  <BaseBlock title="Thêm lịch làm việc">
    <div class="row">
      <div class="col-lg-12 space-y-5">
        <FixedScheduleForm :fixedSchedule="{}" @submit:fixedSchedule="create" />
      </div>
    </div>
  </BaseBlock>
</template>
