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
        rounded-10px shadow-md
        border border-solid border-[#41434f]
        py-6px px-4px

        data-[side=left]:mr-10px
        data-[side=right]:ml-10px
        data-[side=bottom]:mt-10px
        data-[side=top]:mb-10px

      "
      :class="props.class"
      v-bind="forwarded"
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
