<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import CommandMenu from './CommandMenu.vue'

const keys = useMagicKeys()
const AltK = keys['Alt+K']

const engineModalRef = ref<typeof import('./CommandModal.vue').default | null>(null)

const isOpen = ref(false)
watch(AltK, (v) => {
  if (v)
    isOpen.value = !isOpen.value
})

function handleOpenChange(e: boolean) {
  isOpen.value = !isOpen.value
}

watch(isOpen, (v) => {
  if (v)
    engineModalRef.value?.open()
  else
    engineModalRef.value?.close()
})

defineExpose({
  handleOpenChange,
  isOpen,
})
</script>

<template>
  <CommandModal ref="engineModalRef">
    <CommandMenu />
  </CommandModal>
</template>

<style scoped>

</style>
