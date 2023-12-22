<script setup lang="ts">
defineProps<{
  type?: string
}>()

const visible = ref(false)

async function close() {
  const animateDom = document.querySelectorAll('.custom-alert')[0] as HTMLElement

  if (animateDom) {
    animateDom.classList.remove('move-in')
    animateDom.classList.add('move-out')

    const ANIMATIONS = animateDom.getAnimations()
    await Promise.all(ANIMATIONS.map(animation => animation.finished))
    visible.value = false
  }
  else {
    visible.value = false
  }
}

function open() {
  close()

  visible.value = true

  setTimeout(() => {
    close()
  }, 2000)
}
defineExpose({
  visible,
  close,
  open,
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      role="alert"
      class="alert custom-alert move-in z-99999 fixed top-20px right-20px w-fit p-10px"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style scoped>
.move-in {
  animation-name: move-x-in;
  animation-duration: 0.1s;
  animation-fill-mode: forwards; /* 动画结束后停留在最终状态 */
}
.move-out {
  animation-name: move-x-out;
  animation-duration: 0.1s;
  animation-fill-mode: forwards; /* 动画结束后停留在最终状态 */
}
</style>
