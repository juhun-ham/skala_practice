<script setup>
import { useConfigStore } from "@/stores/configStore";

const configStore = useConfigStore();
</script>

<template>
  <div class="unit-toggler">
    <span>
      날씨 단위:
      {{ configStore.unit === "celsius" ? "섭씨" : "화씨" }}
      ({{ configStore.unitSymbol }})
    </span>

    <button @click="configStore.toggleUnit">단위 변경</button>

    <div class="threshold-control">
      <span> 더움 기준: {{ configStore.hotThresholdLabel }} </span>

      <button @click="configStore.decreaseHotThreshold">-1</button>

      <button @click="configStore.increaseHotThreshold">+1</button>
    </div>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 16px;
}

.unit-toggler > div,
.threshold-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-toggler span {
  font-weight: bold;
}

.unit-toggler button {
  padding: 8px 12px;
  color: white;
  background-color: #4b6584;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.unit-toggler button:hover {
  background-color: #34495e;
}
</style>
