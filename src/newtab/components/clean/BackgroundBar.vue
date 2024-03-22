<script setup lang="ts">
import { appWallPaper } from '~/logic'
import { defaultWallpapers } from '~/params/wallpaper'

function handleSetWallpaper(item: typeof defaultWallpapers[number]) {
  appWallPaper.value.wallpaperId = item.id
}
</script>

<template>
  <div class="grid grid-cols-2 h-200px w-120px gap-10px overflow-auto">
    <img
      v-for="item in defaultWallpapers"
      :key="item.id"
      :src="item.image"
      alt=""
      class="h-80px w-full object-cover rounded-md select-none cursor-pointer"
      @click="handleSetWallpaper(item)"
    >
  </div>
</template>

<style scoped>

</style>
