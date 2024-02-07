<script setup lang="ts">
const props = withDefaults(defineProps<{
  class?: string
  resize?: 'none' | 'both' | 'horizontal' | 'vertical' | 'initial' | 'inherit'
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}>(), {
  resize: 'both',
})
</script>

<template>
  <div
    :style="{
      resize,
      overflow: resize !== 'none' ? 'auto' : 'unset',
      width: `${`${props.width}px` || 'fit-content'} !important`,
      height: `${`${props.height}px` || 'fit-content'} !important`,
      minWidth: `${minWidth}px !important`,
      minHeight: `${minHeight}px !important`,

      maxWidth: `${maxWidth}px !important`,
      maxHeight: `${maxHeight}px !important`,
    }"
    class="rounded-lg  text-black p-4 shadow-sm min-w-[50px] min-h-[50px] outline-0 hover:outline-1px outline-[#4a24f5] outline-dashed"
    :class="props.class"
  >
    <slot />
  </div>
</template>
