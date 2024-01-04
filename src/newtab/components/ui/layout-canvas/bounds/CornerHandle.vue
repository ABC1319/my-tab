<!-- eslint-disable ts/no-duplicate-enum-values -->
<script setup lang="ts">
const { elementBound, size, corner, gap } = defineProps({
  elementBound: {
    default: {
      id: '0',
      elementId: '0',
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    },
  },
  size: { default: 10 },
  gap: { default: 10 },
  isHidden: { default: false },
  corner: { default: 'top_left_corner' },
})
const { x, y, height, width } = elementBound.bounds

enum ControlCursor {
  top_left_corner = 'nwse-resize',
  top_right_corner = 'nesw-resize',
  bottom_left_corner = 'nesw-resize',
  bottom_right_corner = 'nwse-resize',
  top_edge = 'ns-resize',
  bottom_edge = 'ns-resize',
  left_edge = 'ew-resize',
  right_edge = 'ew-resize',
  top_center_rotate = 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><path fill=\'currentColor\' d=\'M19 8l-4 4h3c0 3.31-2.69 6-6 6c-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6c1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4l4-4H6z\'%3E%3C/path%3E%3C/svg%3E") 16 16, pointer',
}
const coords = {
  top_left_corner: [x - (size / 2) - gap, y - (size / 2) - gap],
  top_right_corner: [x + width - (size / 2) + gap, y - (size / 2) - gap],
  bottom_right_corner: [x + width - (size / 2) + gap, y + height - (size / 2) + gap],
  bottom_left_corner: [x - (size / 2) - gap, y + height - (size / 2) + gap],
}
const cursorRef = ref((ControlCursor as any)[corner])
</script>

<template>
  <rect
    :id="`corner-handle-${elementBound.elementId}`"
    :class="`corner-handle-${corner} corner-handle`"
    :style="{ opacity: isHidden ? 0 : 1 }"
    :x="(coords as any)[corner][0]"
    :y="(coords as any)[corner][1]"
    :rx="size / 5"
    :ry="size / 5"
    :width="size"
    :height="size"
    fill="white"
    stroke="indigo"
    stroke-width="1px"
  />
</template>

<style lang="less" scoped>
.corner-handle {
  cursor: v-bind(cursorRef);
}
</style>
