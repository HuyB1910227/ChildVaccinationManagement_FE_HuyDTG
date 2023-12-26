<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  htmlData: {
    required: true,
    type: String,
  },
});

const htmlData = ref(props.htmlData);

watch(
  () => props.htmlData,
  (newVal) => {
    htmlData.value = newVal;
  }
);
</script>

<template>
  <div></div>
</template>
