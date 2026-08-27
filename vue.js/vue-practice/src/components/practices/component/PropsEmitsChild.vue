<script setup>
defineProps({
  parentData: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update-request"]);

const sendNotification = () => {
  const payload = "Child에서 가공한 새로운 데이터";

  emit("update-request", payload);
};
</script>

<template>
  <div class="child-container">
    <h3>하위 컴포넌트 (Child)</h3>

    <p>
      수신된 Props 데이터:
      <strong>{{ parentData }}</strong>
    </p>

    <button @click="sendNotification">상위 컴포넌트로 갱신 요청 (Emit)</button>
  </div>
</template>

<style scoped>
.child-container {
  margin-top: 16px;
  padding: 20px;
  background-color: #e3fafc;
  border: 1px solid #99e9f2;
  border-radius: 8px;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}
</style>
