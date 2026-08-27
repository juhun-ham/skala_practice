<script setup>
defineProps({
  currentQuery: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update-query"]);

const handleInput = (event) => {
  emit("update-query", event.target.value);
};
</script>

<template>
  <div class="search-bar">
    <h3>🔍 도시 검색 (한글 즉시 동기화)</h3>

    <input
      type="text"
      :value="currentQuery"
      @input="handleInput"
      placeholder="검색할 도시 이름 입력"
    />

    <p>검색 중인 도시: {{ currentQuery }}</p>
  </div>
</template>

<style scoped>
.search-bar input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.search-bar p {
  margin: 8px 0 0;
}
</style>
