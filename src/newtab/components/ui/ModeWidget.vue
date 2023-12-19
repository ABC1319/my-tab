<script setup lang="ts">
const showMode = ref<'normal' | 'clean'>('normal')

function toggleShowMode() {
  showMode.value = showMode.value === 'normal' ? 'clean' : 'normal'
}
</script>

<template>
  <div class="absolute top-15px right-15px ">
    <div class="w-32px h-32px hover:bg-[#484E64] rounded-6px grid place-items-center cursor-pointer hover:[&>div]:scale-120 " @click="toggleShowMode">
      <div
        v-show="showMode === 'normal'"
        class="transition-transform ease-in-out w-5 h-5"
        i-carbon-clean
      />
      <div
        v-show="showMode === 'clean'"
        class="transition-transform ease-in-out w-5 h-5"
        i-carbon-grid
      />
    </div>
  </div>
</template>

<style scoped>

</style>
