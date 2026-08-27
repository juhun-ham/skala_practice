<template>
  <el-card class="dashboard-card" shadow="never">
    <slot></slot>
  </el-card>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 14px;
}

.dashboard-card :deep(.el-card__body) {
  padding: 22px;
}
</style>
