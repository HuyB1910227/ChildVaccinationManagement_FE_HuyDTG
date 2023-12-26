<script setup>
import { ref } from "vue";
import { useFixedScheduleStore } from "@/stores/FixedScheduleStore";
import FixedScheduleForm from "@/components/fixedSchedules/FixedScheduleForm.vue";
const fixedScheduleStore = useFixedScheduleStore();
const fixedScheduleUpdated = ref(null);
const props = defineProps({
  fixedSchedule: {
    type: Object,
    require: true,
  },
});
const emit = defineEmits(["updated:fixedSchedule"]);
const updateFixedSchedule = async (data) => {
  fixedScheduleUpdated.value = await fixedScheduleStore.update(
    props.fixedSchedule.id,
    data
  );
  if (fixedScheduleUpdated.value) {
    emit("updated:fixedSchedule", fixedScheduleUpdated.value);
  } else {
    alert("Cập nhật thất bại");
  }
};
</script>
<template>
  <BaseBlock title="thêm thông tin khách hàng và tài khoản">
    <div class="row">
      <div class="col-lg-12 space-y-5">
        <FixedScheduleForm
          v-if="fixedSchedule"
          :fixedSchedule="fixedSchedule"
          @submit:fixedSchedule="updateFixedSchedule"
        />
      </div>
    </div>
  </BaseBlock>
</template>
