<script setup lang="ts">
import { onClickOutside, useWindowSize } from '@vueuse/core'

interface PropsType {
  x: number
  y: number
  options: {
    label: string
    key: string
    icon?: string
  }[]
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
        opacity-0 origin-right-bottom
        rounded-10px
        bg-[#252835] text-white
        border border-solid border-[#41434f]
        select-none py-1
        flex flex-col justify-around
      "
      :class="visible ? 'pointer-events-auto' : 'pointer-events-none'"
      :style="{
        right: `${x}px`,
        bottom: `${y}px`,
      }"
      @contextmenu="(e) => e.preventDefault()"
    >
      <li
        v-for="item in options"
        :key="item.label"
      >
        <div v-if="item.key === 'Divider'" class="w-full h-1px bg-[#bcbbc130] my-1" />
        <div
          v-else
          class="
          hover:text-white hover:bg-[#5021ff]
            cursor-pointer
            px-2 rounded-md my-2px
            flex flex-row justify-start items-center
            h-32px gap-10px mx-4px
          "
          @click="handleSelect(item)"
        >
          <div
            v-if="item?.icon"
            class="w-15px h-15px"
            v-html="item?.icon"
          />
          <div class="text-12px">
            {{ item.label }}
          </div>
        </div>
      </li>
    </ul>
  </Teleport>
</template>

<style scoped>
</style>
