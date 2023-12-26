<script setup>
import { ref, watch } from "vue";
import UseHistoryService from "@/services/history.service";
import HistoryForm from "@/components/histories/HistoryForm.vue";

const historyUpdated = ref(null);
const props = defineProps({
  history: {
    type: Object,
    require: true,
  },
});
const history = ref(props.history);
watch(
  () => props.history,
  (newVal) => {
    history.value = newVal;
  }
);
const emit = defineEmits(["updatedwithPatch:history"]);
const updateStatus = async (data) => {
  historyUpdated.value = await UseHistoryService.patch(props.history.id, data);
  if (historyUpdated.value) {
    emit("updatedwithPatch:history", historyUpdated.value);
    changeSucessAlert("on");
  } else {
    alert("Cập nhật thất bại");
    changeSucessAlert("off");
  }
};

const isShowSucessAlert = ref(false);
const changeSucessAlert = (string) => {
  if (string == "on") {
    isShowSucessAlert.value = true;
  } else {
    isShowSucessAlert.value = false;
  }
};

defineExpose({
  changeSucessAlert,
});
</script>
<template>
  <div class="row">
    <div class="col-lg-12">
      <HistoryForm
        v-if="history"
        :history="history"
        @submit:history="updateStatus"
      />
      <div
        class="alert alert-success d-flex align-items-center alert-dismissible fade show"
        role="alert"
        v-if="isShowSucessAlert"
      >
        <div class="flex-shrink-0">
          <i class="fa-solid fa-check-double"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0 fw-bold">Đã cập nhật trạng thái sau tiêm</p>
        </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="changeSucessAlert('off')"
        ></button>
      </div>
    </div>
  </div>
</template>
