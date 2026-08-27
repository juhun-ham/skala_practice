<script setup>
import { computed } from "vue";
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
  <article class="weather-card" @click="handleCardClick">
    <div>
      <strong> {{ cityItem.name }} ({{ cityItem.status }}) </strong>

      <p>
        현재 기온:
        {{ displayTemp }}{{ configStore.unitSymbol }}
      </p>

      <span :class="cityItem.temp >= configStore.hotThreshold ? 'hot' : 'cool'">
        {{ cityItem.temp >= configStore.hotThreshold ? "🔥 더움" : "❄️ 선선함" }}
      </span>
    </div>

    <button @click.stop="handleDetailClick">상세보기</button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 16px;
  background-color: white;
  border: 1px solid #dfe5eb;
  border-radius: 8px;
  cursor: pointer;
}

.weather-card:hover {
  border-color: #42b883;
}

.weather-card p {
  margin: 6px 0;
}

.weather-card button {
  padding: 7px 12px;
  cursor: pointer;
}

.hot,
.cool {
  display: inline-block;
  padding: 4px 8px;
  color: white;
  border-radius: 5px;
  font-size: 13px;
}

.hot {
  background-color: #ff6b6b;
}

.cool {
  background-color: #4dabf7;
}
</style>
