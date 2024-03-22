<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { VisuallyHidden } from 'radix-vue'
import CommandMenu from './CommandMenu.vue'

const keys = useMagicKeys()
const AltK = keys['Alt+K']

const isOpen = ref(false)
watch(AltK, (v) => {
  if (v)
    isOpen.value = !isOpen.value
})

function handleOpenChange(e: boolean) {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <Dialog
    :open="isOpen"
    @update:open="handleOpenChange"
  >
    <DialogContent
      class="w-fit! max-w-unset! p-0!"
    >
      <VisuallyHidden as-child>
        <DialogHeader>
          <DialogTitle>添加或修改</DialogTitle>
          <DialogDescription>
            添加或修改网址
          </DialogDescription>
        </DialogHeader>
      </VisuallyHidden>

      <CommandMenu />
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
