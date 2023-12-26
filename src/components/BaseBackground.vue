<script setup>
import { computed } from "vue";

const props = defineProps({
  image: {
    type: String,
    description: "The url of the image to show",
  },
  innerClass: {
    type: String,
    description:
      "The class of the inner div. Usually a background color with opacity class",
  },
  imageTop: {
    type: Boolean,
    default: false,
    description: "Align the image background to the top",
  },
  imageBottom: {
    type: Boolean,
    default: false,
    description: "Align the image background to the bottom",
  },
  imageFixed: {
    type: Boolean,
    default: false,
    description: "Set the background to fixed for a parallax effect",
  },
});

const classContainer = computed(() => {
  return {
    "bg-image-top": props.imageTop,
    "bg-image-bottom": props.imageBottom,
    "bg-image-fixed": props.imageFixed,
  };
});

const classContainerInner = computed(() => {
  return {
    [props.innerClass]: props.innerClass,
  };
});
</script>

<template>
  <div
    :style="image ? `background-image: url('${image}');` : null"
    :class="classContainer"
    class="bg-image"
  >
    <div v-if="innerClass" :class="classContainerInner">
      <slot></slot>
    </div>
    <slot v-else></slot>
  </div>
</template>
