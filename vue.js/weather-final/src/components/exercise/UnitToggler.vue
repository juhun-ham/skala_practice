<script setup>
import { Minus, Plus, Refresh } from "@element-plus/icons-vue";
import { useConfigStore } from "@/stores/configStore";

const configStore = useConfigStore();
</script>

<template>
  <div class="unit-toggler">
    <div class="setting-item">
      <span class="setting-label">날씨 단위</span>
      <el-tag size="large" effect="light">
        {{ configStore.unit === "celsius" ? "섭씨" : "화씨" }}
        ({{ configStore.unitSymbol }})
      </el-tag>
      <el-button type="primary" plain :icon="Refresh" @click="configStore.toggleUnit">
        단위 변경
      </el-button>
    </div>

    <el-divider direction="vertical"></el-divider>

    <div class="setting-item">
      <span class="setting-label">더움 기준</span>
      <strong>{{ configStore.hotThresholdLabel }}</strong>
      <el-button-group>
        <el-button :icon="Minus" aria-label="더움 기준 1도 낮추기" @click="configStore.decreaseHotThreshold"></el-button>
        <el-button :icon="Plus" aria-label="더움 기준 1도 높이기" @click="configStore.increaseHotThreshold"></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-label {
  color: #606266;
  font-size: 13px;
}

.unit-toggler :deep(.el-divider--vertical) {
  height: 28px;
}

@media (max-width: 640px) {
  .unit-toggler,
  .setting-item {
    align-items: stretch;
    flex-direction: column;
  }

  .unit-toggler :deep(.el-divider--vertical) {
    display: none;
  }
}
</style>
