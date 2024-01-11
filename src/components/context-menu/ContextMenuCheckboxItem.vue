<script setup lang="ts">
import {
  ContextMenuCheckboxItem,
  type ContextMenuCheckboxItemEmits,
  type ContextMenuCheckboxItemProps,
  ContextMenuItemIndicator,
  useEmitAsProps,
} from 'radix-vue'

const props = defineProps<ContextMenuCheckboxItemProps & { class?: string }>()
const emits = defineEmits<ContextMenuCheckboxItemEmits>()
</script>

<template>
  <ContextMenuCheckboxItem
    v-bind="{ ...props, ...useEmitAsProps(emits) }"
    class="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    :class="props.class"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuItemIndicator
        class="absolute left-1.5 inline-flex w-4 h-4 items-center justify-center"
      >
        <svg class="h-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5" /></svg>
      </ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuCheckboxItem>
</template>
