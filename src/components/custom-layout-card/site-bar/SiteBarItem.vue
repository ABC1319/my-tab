<script setup lang="ts">
interface SiteBarItemProps {
  class?: string
  icon?: string | File
  webName?: string
}

const props = defineProps<SiteBarItemProps >()
</script>

<template>
  <div
    class="site-bar-sort-item w-144px h-88px flex flex-col justify-center items-center gap-5px flex-shrink-0 flex-grow-0 cursor-pointer overflow-hidden rounded-10px text-center "
  >
    <div class="w-10 h-10 grid place-items-center" v-html="props.icon" />
    <div class="w-full select-none">
      {{ props.webName }}
    </div>
  </div>
</template>

<style scoped>
.site-bar-sort-item {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  clip-path: path(
    'M 0 44 C 0 0.9849735503722608 0.9849735503722608 0 44 0 L 100 0 C 143.01502644962773 0 144 0.9849735503722608 144 44 L 144 44 C 144 87.01502644962774 143.01502644962773 88 100 88 L 44 88 C 0.9849735503722608 88 0 87.01502644962774 0 44 z'
  );
}
</style>
