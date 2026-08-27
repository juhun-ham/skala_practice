<template>
  <el-card class="dashboard-card" shadow="never">
    <slot></slot>
  </el-card>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 16px;
  border: 1px solid #dce5f0;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgb(23 59 108 / 5%);
}

.dashboard-card :deep(.el-card__body) {
  padding: 22px;
}
</style>
