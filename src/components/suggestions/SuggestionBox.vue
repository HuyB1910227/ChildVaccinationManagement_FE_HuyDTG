<script setup>
import UseDiagnosisService from "@/services/useService/useDiagnosisService";
import { onMounted, ref, watch } from "vue";
import SuggestionDetailBox from "./SuggestionDetailBox.vue";
const props = defineProps({
  appointmentCard: {
    required: true,
    type: Object,
  },
  assignments: {
    required: true,
  },
});

const suggestionList = ref(null);
const appointmentCard = ref(props.appointmentCard);
watch(
  () => props.assignments,
  () => {
    retriveSuggestionList(appointmentCard.value.id);
  }
);

const retriveSuggestionList = async (appointmentCardId) => {
  if (appointmentCard.value) {
    suggestionList.value = await UseDiagnosisService.getSuggestionForSelect(
      appointmentCardId
    );
  }
};
const activeIndex = ref(null);
const diseaseId = ref(0);
const handleChangeActiveIndex = (index, id) => {
  activeIndex.value = index;
  diseaseId.value = id;
};
onMounted(() => {
  retriveSuggestionList(appointmentCard.value.id);
});
</script>

<template>
  <BaseBlock title="Gợi ý tiêm chủng" btn-option-content>
    <div class="row mb-2">
      <div class="col-lg-4" style="max-height: 600px; overflow-y: auto">
        <ul class="nav nav-pills flex-column push">
          <li
            class="nav-item my-1"
            v-for="(suggestion, index) in suggestionList"
            :key="suggestion.diseaseFSelectDTO.id"
            @click="
              handleChangeActiveIndex(index, suggestion.diseaseFSelectDTO.id)
            "
            :class="
              suggestion.possibilityOfInjectionStatus === 'SELECTED'
                ? 'li-selected text-white'
                : ''
            "
          >
            <a
              class="nav-link d-flex justify-content-between align-items-center"
              href="javascript:void(0)"
              :class="activeIndex == index ? 'active' : ''"
            >
              <span class="fs-md">
                <template
                  v-if="suggestion.possibilityOfInjectionStatus === 'SELECTED'"
                >
                  <i class="fa-solid fa-clipboard-check"></i>
                </template>
                <template v-else> &nbsp; &nbsp; </template>
                &nbsp;
                <i class="fa-solid fa-disease me-1 opacity-50"></i>
                {{ suggestion.diseaseFSelectDTO.name }}
              </span>
              <span class="badge rounded-pill bg-success">{{
                suggestion.assigmentIds.length
              }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="col-lg-8">
        <div class="text-center"><h5>Thông tin chi tiết</h5></div>
        <div style="max-height: 600px; overflow-y: auto" class="p-1">
          <SuggestionDetailBox
            :diseaseId="diseaseId"
            :appointment-card-id="appointmentCard.id"
          />
        </div>
      </div>
    </div>
  </BaseBlock>
</template>

<style scoped>
.active {
  background-color: rgb(131, 131, 245);
  color: red;
}
.li-selected {
  background-color: rgb(190, 235, 190);
  border-radius: 5px;
}
</style>
