<script setup lang="ts">
import {
  ContextMenuContent,
  type ContextMenuContentEmits,
  type ContextMenuContentProps,
  ContextMenuPortal,
  useForwardPropsEmits,
} from 'radix-vue'

const props = defineProps<ContextMenuContentProps & { class?: string }>()
const emits = defineEmits<ContextMenuContentEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuPortal>
    <ContextMenuContent
      class="
        z-50 bg-[#252835] text-white
        min-w-[8rem] overflow-hidden
        rounded-md p-1 shadow-md
        animate-in fade-in-80
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95

        data-[side=left]:scale-in-from-right-top
        data-[side=right]:scale-in-from-left-top
        data-[side=bottom]:scale-in-from-right-bottom
        data-[side=top]:scale-in-from-right-top
      "
      :class="props.class"
      v-bind="forwarded"
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
