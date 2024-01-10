<script setup lang="ts">
import {
  ContextMenuSubTrigger,
  type ContextMenuSubTriggerProps,
} from 'radix-vue'

const props = defineProps<ContextMenuSubTriggerProps & { class?: string, inset?: boolean }>()
</script>

<template>
  <ContextMenuSubTrigger
    v-bind="props"
    class="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    :class="props.class && (inset && 'pl-8')"
  >
    <slot />

    <svg class="ml-auto h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 18l6-6l-6-6" /></svg>
  </ContextMenuSubTrigger>
</template>
