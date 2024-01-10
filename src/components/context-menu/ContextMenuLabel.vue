<script setup lang="ts">
import { ContextMenuLabel, type ContextMenuLabelProps } from 'radix-vue'

const props = defineProps<ContextMenuLabelProps & { class?: string, inset?: boolean }>()
</script>

<template>
  <ContextMenuLabel
    v-bind="props"
    class="px-2 py-1.5 text-sm font-semibold text-foreground"
    :class="props.class && (inset && 'pl-8')"
  >
    <slot />
  </ContextMenuLabel>
</template>
