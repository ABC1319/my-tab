<script setup lang="ts">
const colors = 'cae7b9-f3de8a-eb9486-7e7f9a-97a7b3-4059ad'.split('-').map(a => `#${a}`)
</script>

<template>
  <div
    :style="{
      background: `${colors[Number(2) - 1]}`,
      placeItems: 'center',
      userSelect: 'none',
    }"
  />
</template>

<style scoped>

</style>
