<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    :style="{
      '--un-ring-offset-shadow': 'none',
    }"
    class="
      flex h-10 w-full
      border-2 border-[#404459]

      focus-visible:border-[#58617a]!

      bg-[#383b46] text-white
      px-3 py-1 text-sm
      file:border-0
      file:bg-transparent
      file:text-sm
      file:font-medium
      placeholder:text-gray-300
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-ring
      focus-visible:ring-offset-2
      disabled:cursor-not-allowed
      disabled:opacity-50
      outline-transparent
    "
    :class="props.class ?? ''"
  >
</template>
