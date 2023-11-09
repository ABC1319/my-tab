<template>
  <div class="card-container">
    <slot />
  </div>
</template>

<style scoped>
.card-container {
  background-color: #0D1117;
  border-color: #30363D;
  border-width: 5px;
  border-style: solid;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 12px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
