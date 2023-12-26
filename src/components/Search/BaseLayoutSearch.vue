<script setup>
import { ref } from "vue";
const optionContentHide = ref(true);
function contentSearchToggle() {
  optionContentHide.value = !optionContentHide.value;
}
</script>

<template>
  <BaseBlock
    title="🔍 Tìm kiếm "
    class="mb-2"
    :class="{ 'block-mode-hidden': optionContentHide }"
  >
    <template #options>
      <div type="button" @click="contentSearchToggle()">
        <i
          :class="{
            'si si-arrow-up': !optionContentHide,
            'si si-arrow-down': optionContentHide,
          }"
        ></i>
      </div>
    </template>

    <slot name="formSearch"></slot>
  </BaseBlock>
</template>
