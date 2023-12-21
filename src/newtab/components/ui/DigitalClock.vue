<script setup lang="ts">
import { useTimestamp } from '@vueuse/core'

const timestamp = useTimestamp()
const clockText = ref('00:00')

watch(timestamp, (val) => {
  const { hours, minutes } = formatDateTime(val)
  clockText.value = `${hours}:${minutes}`
})

function formatDateTime(timestamp: number) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 注意月份是从 0 开始的，需要加 1
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  // `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
  }
}
</script>

<template>
  <div
    class=" mt-120px text-18 opacity-80 select-none"
    style="font-family: Digital;"
  >
    <span class="text-white mix-blend-difference">
      {{ clockText }}
    </span>
  </div>
</template>

<style scoped>

</style>
