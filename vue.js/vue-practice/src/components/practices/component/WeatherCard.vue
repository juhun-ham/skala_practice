<script setup>
const props = defineProps({
  cityName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["select-city"]);

const handleCardClick = () => {
  emit("select-city", props.cityName);
};
</script>

<template>
  <div class="weather-card" @click="handleCardClick">
    <h4>{{ cityName }} ({{ status }})</h4>

    <p>클릭하면 부모에게 신호를 보냅니다.</p>
  </div>
</template>

<style scoped>
.weather-card {
  margin-bottom: 12px;
  padding: 16px;
  background-color: white;
  border: 1px solid #cccccc;
  border-radius: 8px;
  cursor: pointer;
}

.weather-card:hover {
  background-color: #f0fff8;
  border-color: #42b883;
}

.weather-card h4 {
  margin: 0 0 8px;
}
</style>
