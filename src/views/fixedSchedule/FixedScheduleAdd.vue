<script setup>
import { ref } from "vue";
import FixedScheduleAddBox from "@/components/fixedSchedules/FixedScheduleAddBox.vue";
import FixedScheduleUpdatedDetailBox from "@/components/fixedSchedules/FixedScheduleUpdatedDetailBox.vue";
const fixedScheduleUpdated = ref(null);

const handleCreated = (data) => {
  fixedScheduleUpdated.value = data;
};
</script>
<template>
  <BasePageHeading title="Thêm lịch làm việc">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'fixed-schedules' }" class="link-fx"
              >Lịch làm việc</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Thêm</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <FixedScheduleAddBox @created:fixedSchedule="handleCreated" />
    <FixedScheduleUpdatedDetailBox
      v-if="fixedScheduleUpdated"
      :fixedSchedule="fixedScheduleUpdated"
    />
  </div>
</template>
