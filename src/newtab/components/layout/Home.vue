<script setup lang="ts">
import SearchBox from '../ui/search-box/index.vue'
import UsefulSite from './UsefulSite.vue'
</script>

<template>
  <div class="flex-1 h-full flex flex-col justify-start items-center text-white overflow-y-auto overflow-x-hidden">
    <SearchBox />

    <UsefulSite />
  </div>
</template>

<style scoped>

</style>
