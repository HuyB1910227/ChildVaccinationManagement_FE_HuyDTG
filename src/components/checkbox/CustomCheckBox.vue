<script setup>
import { useField } from "vee-validate";
import { onMounted, watch } from "vue";
const props = defineProps({
  modelValue: null,
  name: String,
  value: String,
  displayValue: String,
  rules: {
    type: String,
    default: undefined,
  },
  checkedValue: Boolean,
});
const emits = defineEmits(["required:update"]);
const { checked, handleChange } = useField(() => props.name, props.rules, {
  type: "checkbox",
  checkedValue: props.value,
});

const handleClick = (value) => {
  handleChange(value);
  emits("required:update");
};

const handleCheckedValue = () => {
  if (props.checkedValue) {
    console.log("handle change");
    handleChange();
  }
};

watch(
  () => props.checkedValue,
  () => {
    handleChange();
  }
);

onMounted(() => {
  handleCheckedValue();
});
</script>

<template>
  <div>
    <button
      type="button"
      class="fs-6 fw-semibold d-inline-block py-1 px-3 rounded-pill m-1"
      :class="[
        checked ? 'bg-success-light text-success' : 'bg-info-light text-info',
        `btn-name-${name}`,
      ]"
      @click="handleClick(value)"
    >
      {{ checked ? "✅" : "✖️" }} {{ displayValue }}
    </button>
  </div>
</template>

<style scoped>
button {
  background: none;
  border: none;
  font-size: 13px;
}
</style>
