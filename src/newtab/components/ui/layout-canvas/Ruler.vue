<script setup lang="ts">
import { useMouseInElement, useWindowSize } from '@vueuse/core'

/**
 * 1. 获取窗口的尺寸
 * 2. 每十个像素显示一条线
 */

const { width, height } = useWindowSize()

const xRuler = ref(null)
const yRuler = ref(null)
const { isOutside: xIsOutside } = useMouseInElement(xRuler)

const { isOutside: yIsOutside } = useMouseInElement(yRuler)
</script>

<template>
  <div>
    <div
      ref="xRuler"
      class="fixed top-0 left-0 w-screen z-0 flex flex-row "
    >
      <div
        v-for="i in (Math.ceil(width / 10))"
        :key="i"
        class="w-10px relative"
      >
        <div
          class="w-1px bg-[#ffffff5e] transition-all duration-200 ease-in-out"
          :class="
            i % 10 !== 0
              ? 'h-4px'
              : !xIsOutside
                ? 'h-20px'
                : 'h-12px'
          "
        />
        <div
          class="absolute top-5px left-5px text-[#ffffff5e] select-none transition-all duration-200 ease-in-out"
          :class="
            xIsOutside
              ? 'opacity-0'
              : i % 10 === 0
                ? 'opacity-100'
                : 'opacity-0'
          "
        >
          {{ i }}
        </div>
      </div>
    </div>
    <div
      ref="yRuler"
      class="fixed top-0 left-0 h-screen z-0 flex flex-col "
    >
      <div
        v-for="i in (Math.ceil(height / 10))"
        :key="i"
        class="h-10px relative"
      >
        <div
          class="h-1px bg-[#ffffff5e] transition-all duration-200 ease-in-out"
          :class="
            i % 10 !== 0
              ? 'w-4px'
              : !yIsOutside
                ? 'w-20px'
                : 'w-12px'
          "
        />
        <div
          class="absolute top-0px left-5px text-[#ffffff5e] select-none transition-all duration-200 ease-in-out"
          :class="
            yIsOutside
              ? 'opacity-0'
              : i % 10 === 0
                ? 'opacity-100'
                : 'opacity-0'
          "
        >
          {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>
