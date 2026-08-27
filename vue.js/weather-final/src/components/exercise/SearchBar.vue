<script setup>
import { Search } from '@element-plus/icons-vue'

defineProps({
  currentQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (value) => {
  emit('update-query', value)
}
</script>

<template>
  <div class="search-bar">
    <div class="section-heading">
      <el-icon><Search /></el-icon>
      <div>
        <h3>도시 검색</h3>
        <p>도시 이름을 입력하면 결과가 즉시 필터링됩니다.</p>
      </div>
    </div>

    <el-input
      :model-value="currentQuery"
      @input="handleInput"
      placeholder="예: 서울, 수원, 부산"
      size="large"
      clearable
      :prefix-icon="Search"
    ></el-input>

    <el-text v-if="currentQuery" class="query-status" type="info">
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </el-text>
  </div>
</template>

<style scoped>
.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-heading > .el-icon {
  color: #409eff;
  font-size: 24px;
}

.section-heading h3,
.section-heading p {
  margin: 0;
}

.section-heading h3 {
  font-size: 17px;
}

.section-heading p {
  margin-top: 2px;
  color: #909399;
  font-size: 13px;
}

.query-status {
  display: block;
  margin-top: 10px;
}
</style>
