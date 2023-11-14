<script setup lang="ts">
import { onClickOutside, useWindowSize } from '@vueuse/core'
interface PropsType {
  x: Number
  y: Number
  options: { label: string; key: string }[]
}

defineProps<PropsType>()

const emit = defineEmits(['select'])

const visible = ref(false)

const targetRef = ref<HTMLElement | null>(null)

const scale = ['scale(.5)', 'scale(1)']
const opacity = [0, 1]

async function open() {
  if (!targetRef.value)
    return

  const animation = targetRef.value.animate(
    { transform: scale, opacity },
    { duration: 100, fill: 'forwards' },
  )
  animation.onfinish = () => {
    visible.value = true
  }
}
async function close() {
  if (!targetRef.value)
    return

  const animation = targetRef.value.animate(
    { transform: [...scale].reverse(), opacity: [...opacity].reverse() },
    { duration: 100, fill: 'forwards' },
  )
  animation.onfinish = () => {
    visible.value = false
  }
}

function handleSelect(e: PropsType['options'][number]) {
  close()
  emit('select', e)
}

const { width } = useWindowSize()
watch(width, () => {
  if (visible.value)
    close()
})
onClickOutside(targetRef, () => {
  if (visible.value)
    close()
})

defineExpose({
  visible,
  close,
  open,
})
</script>

<template>
  <Teleport to="body" @click.stop>
    <ul
      ref="targetRef"
      class="
        w-32 fixed z-999
        opacity-0 origin-left-top
        rounded-10px
        border border-solid border-[#bcbbc18c]
        bg-[#252835] text-white
        select-none
        flex flex-col px-4px py-6px justify-around
      "
      :class="visible ? 'pointer-events-auto' : 'pointer-events-none'"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
      }"
      @contextmenu="(e) => e.preventDefault()"
    >
      <li
        v-for="item in options"
        :key="item.label"
        class="
        hover:text-white hover:bg-[#5021ff]
          cursor-pointer
          px-2 py-1 rounded-md
        "
        @click="handleSelect(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </Teleport>
</template>

<style scoped>
</style>
