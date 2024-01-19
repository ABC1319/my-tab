<script setup lang="ts">
defineProps<{
  currentType: string
  searchText: string
}>()
</script>

<template>
  <div
    class="
      w-full flex-1 p-8
      grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] grid-flow-dense gap-20px
      border-t-2 border-dashed border-[#383e4f]
    "
  >
    <div
      v-for="item in 10"
      :key="item"
      class="
        h-200px
      bg-[#484e64] rounded-20px
        border-6 border-solid border-[#383e4f]
        overflow-hidden
      "
    >
      {{ item }}
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  position: relative;
  border-radius: 23px;
  display: flex;
  font-size: 14px;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
  font-weight: bold;
  flex-shrink: 0;
}
.nav-item {
  cursor: pointer;
  border-radius: 50px;
  -webkit-box-align: center;
  padding: 0px 16px;
  transition: opacity 0.3s ease 0s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1;
  user-select: none;
  color: #ffffff;
  mix-blend-mode: difference;
}
</style>
