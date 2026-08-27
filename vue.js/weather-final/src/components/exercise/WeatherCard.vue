<script setup>
import { computed } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useConfigStore } from "@/stores/configStore";

const configStore = useConfigStore();

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select-card", "click-detail"]);

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp;

  if (configStore.unit === "fahrenheit") {
    return Math.round((rawTemp * 9) / 5 + 32);
  }

  return rawTemp;
});

const handleCardClick = () => {
  emit("select-card", props.cityItem);
};

const handleDetailClick = () => {
  emit("click-detail", props.cityItem);
};
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="handleCardClick">
    <div class="card-content">
      <div>
        <div class="city-title">
          <strong>{{ cityItem.name }}</strong>
          <el-tag effect="plain" round>{{ cityItem.status }}</el-tag>
        </div>

        <p class="temperature">
          {{ displayTemp }}<small>{{ configStore.unitSymbol }}</small>
        </p>

        <el-tag
          :type="cityItem.temp >= configStore.hotThreshold ? 'danger' : 'primary'"
          effect="dark"
          round
        >
          {{ cityItem.temp >= configStore.hotThreshold ? "🔥 더움" : "❄️ 선선함" }}
        </el-tag>
      </div>

      <el-button type="primary" plain :icon="ArrowRight" @click.stop="handleDetailClick">
        상세보기
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.weather-card {
  margin-top: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
}

.card-content,
.city-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.city-title {
  justify-content: flex-start;
}

.temperature {
  margin: 10px 0;
  color: #303133;
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}

.temperature small {
  margin-left: 2px;
  color: #909399;
  font-size: 15px;
}

@media (max-width: 520px) {
  .card-content {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
