<script setup lang="ts"></script>

<template>
  <main class="main global-container">
    <RouterView />
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-grow: 1;
  padding: 20px;
  flex-direction: column;
}
</style>
