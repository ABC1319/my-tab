<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ modelValue?: string }>(), {
  modelValue: '',
})

const fakeUrl = ref('')
const fakeRef = ref<HTMLElement | null>(null)

const realUrl = ref(props.modelValue)
const realRef = ref<HTMLElement | null>(null)
watch(
  () => props.modelValue,
  async (nVal, oVal) => {
    if (!oVal) {
      realUrl.value = nVal
      return
    }

    if (realRef.value)
      realRef.value.style.opacity = '0'
    if (fakeRef.value)
      fakeRef.value.style.opacity = '1'

    nextTick(() => {
      fakeUrl.value = oVal
      realUrl.value = nVal
    })

    startAnimation()
  },
  {
    immediate: true,
  },
)

async function startAnimation() {
  // 虚假元素开始消失
  if (fakeRef.value) {
    const animation = fakeRef.value.animate(
      {
        transform: ['scale(1)', 'scale(1.3)'],
        opacity: [1, 0],
        filter: ['blur(0px)', 'blur(20px)'],
      },
      { duration: 400, fill: 'forwards' },
    )
    animation.onfinish = () => {
      animation.cancel()
      fakeRef.value!.style.animation = 'none'
      fakeRef.value!.style.opacity = '0'
    }
  }

  // 真实元素开始出现
  if (realRef.value) {
    const animation = realRef.value.animate(
      {
        transform: ['scale(1.5)', 'scale(1)'],
        opacity: [0, 1],
        filter: ['blur(10px)', 'blur(0px)'],
      },
      { duration: 600, fill: 'forwards' },
    )
    animation.onfinish = () => {
      animation.cancel()
      realRef.value!.style.animation = 'none'
      realRef.value!.style.opacity = '1'
    }
  }
}
</script>

<template>
  <div class="animated-background-container">
    <img
      v-if="props.modelValue"
      ref="realRef"
      :src="realUrl"
    >
    <img
      v-show="fakeUrl"
      ref="fakeRef"
      class="fake"
      :src="fakeUrl"
    >
  </div>
</template>

<style scoped>
.animated-background-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.animated-background-container > img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.animated-background-container .fake {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
