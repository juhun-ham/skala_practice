<script setup>
import { useConfigStore } from "@/stores/configStore";

const configStore = useConfigStore();

defineProps({
  hotOnly: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update-hot-only"]);

const handleChange = (event) => {
  emit("update-hot-only", event.target.checked);
};
</script>

<template>
  <label class="temperature-filter">
    <input type="checkbox" :checked="hotOnly" @change="handleChange" />

    <span> {{ configStore.hotThresholdLabel }} 이상인 도시만 보기</span>
  </label>
</template>

<style scoped>
.temperature-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  cursor: pointer;
}

.temperature-filter input {
  width: 18px;
  height: 18px;
}
</style>
