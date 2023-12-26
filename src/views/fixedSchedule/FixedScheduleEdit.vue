<script setup>
import { ref, onMounted } from "vue";
import FixedScheduleService from "@/services/fixedSchedule.service";
import router from "@/router";
import CustomerDetailBox from "@/components/customers/CustomerDetailBox.vue";
import FixedScheduleEditBox from "@/components/fixedSchedules/FixedScheduleEditBox.vue";
import FixedScheduleUpdatedDetailBox from "@/components/fixedSchedules/FixedScheduleUpdatedDetailBox.vue";
const fixedScheduleUpdated = ref(null);

const handleUpdated = (data) => {
  fixedScheduleUpdated.value = data;
};
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const fixedSchedule = ref(null);
const getFixedSchedule = async (id) => {
  try {
    fixedSchedule.value = await FixedScheduleService.get(id);
    console.log(fixedSchedule.value);
  } catch (e) {
    console.log("bị lỗi");
    router.push({
      name: "error-404",
    });
  }
};

onMounted(() => {
  getFixedSchedule(props.id);
});
</script>
<template>
  <BasePageHeading title="Cập nhật trẻ em">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item" aria-current="page">
            <RouterLink :to="{ name: 'fixed-schedules' }" class="link-fx"
              >Lịch làm việc</RouterLink
            >
          </li>
          <li class="breadcrumb-item" aria-current="page">Cập nhật</li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div class="content">
    <FixedScheduleEditBox
      :fixedSchedule="fixedSchedule"
      @updated:fixedSchedule="handleUpdated"
    />
    <FixedScheduleUpdatedDetailBox
      v-if="fixedScheduleUpdated"
      :fixedSchedule="fixedScheduleUpdated"
    />
  </div>
</template>
