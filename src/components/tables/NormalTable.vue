<script setup>
import { ref, computed, watch } from "vue";
import Paginate from "vuejs-paginate-next";
const pageSizes = ref([5, 10, 25, 50, 100]);
const pageSize = ref(10);
const page = ref(1);

const props = defineProps({
  totalRecordsc: {
    required: true,
  },
  pagec: {
    type: Number,
  },
});
const totalRecords = ref(props.totalRecords);
watch(
  () => props.totalRecordsc,
  (newVal) => {
    totalRecords.value = newVal;
  }
);
watch(
  () => props.pagec,
  (newVal) => {
    page.value = newVal;
  }
);
const emit = defineEmits(["update:pageSize", "update:page"]);
const handlePageSizeChange = (event) => {
  emit("update:pageSize", event.target.value);
};

const handlePageChange = () => {
  emit("update:page", page.value);
};
const totalPages = computed(() => {
  if (totalRecords.value && pageSize.value) {
    return Math.ceil(totalRecords.value / pageSize.value);
  }
  return 0;
});
</script>

<template>
  <BaseBlock title="📑 Bảng thông tin " content-full>
    <div class="row">
      <div id="datasetLength" class="col-md-8 py-2">
        <select
          v-model="pageSize"
          class="form-select"
          style="width: 100px"
          @change="handlePageSizeChange($event)"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
      <div class="col-4 py-2">
        <slot name="topRightEdgeOfTheTable"></slot>
      </div>
    </div>

    <slot name="tableContent"></slot>

    <div
      class="d-flex flex-md-row flex-column justify-content-between align-items-center"
    >
      <div class="pt-2 fs-sm">Tổng số: {{ totalRecords }} bản ghi</div>
      <div class="flex-wrap pt-2 fs-sm">
        <paginate
          v-model="page"
          :page-count="totalPages"
          :page-range="3"
          :prev-text="'<'"
          :next-text="'>'"
          :click-handler="handlePageChange"
          :container-class="'pagination'"
        >
        </paginate>
      </div>
    </div>
  </BaseBlock>
</template>
