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
    class="pointer-events-auto text-white w-fit h-fit flex flex-col justify-center items-center flex-shrink-0 flex-grow-0 cursor-pointer overflow-hidden rounded-10px text-center "
  >
    <div
      class="alpha-icon bg-[#252835]"
      v-html="props.icon"
    />
    <div class="w-full select-none">
      {{ props.webName }}
    </div>
  </div>
</template>
