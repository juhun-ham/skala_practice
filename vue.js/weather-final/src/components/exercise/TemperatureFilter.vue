<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

defineProps({
  hotOnly: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update-hot-only'])

const handleChange = (value) => {
  emit('update-hot-only', value)
}
</script>

<template>
  <div class="temperature-filter">
    <div>
      <strong>더운 도시 필터</strong>
      <p>{{ configStore.hotThresholdLabel }} 이상인 도시만 표시합니다.</p>
    </div>

    <el-switch
      :model-value="hotOnly"
      @change="handleChange"
      inline-prompt
      active-text="ON"
      inactive-text="OFF"
    ></el-switch>
  </div>
</template>

<style scoped>
.temperature-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 14px 16px;
  background: #f4f7fb;
  border: 1px solid #dce5f0;
  border-radius: 10px;
}

.temperature-filter p {
  margin: 2px 0 0;
  color: #909399;
  font-size: 13px;
}
</style>
