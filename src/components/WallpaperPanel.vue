<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

const targetRef = ref<HTMLElement | null>(null)
onClickOutside(targetRef, () => {
  emit('close')
})

/**
 * 总有一个设置：图片地址 遮罩浓度 模糊度
 * 当前组件有三个变量： 默认图片 6 张 ，自定义上传图片最大 6 张，遮罩浓度和模糊度
 */
const defaultBackgrounds = Array(6).fill(0).map((_item, index) => `/assets/app-background-images/main_${index + 1}.png`)
// eslint-disable-next-line no-console
console.log(defaultBackgrounds)
</script>

<template>
  <div
    ref="targetRef"
    class="
      absolute top-0px right-8px z-999
      w-370px h-screen
      text-white
      flex-shrink-0
      flex flex-col justify-center items-center
    "
  >
    <div
      class="
        w-full h-625px
        bg-[#252835]
        rounded-10px py-20px px-20px
        flex flex-col gap-20px flex-shrink-0
        overflow-auto select-none
        relative
      "
    >
      <!-- close -->
      <div class="absolute right-10px top-10px w-16px h-16px cursor-pointer" i-carbon-close @click="close" />

      <!-- 默认墙纸 -->
      <div class="w-full">
        <!-- title -->
        <div class="w-full h-4 font-bold mb-10px">
          默认墙纸
        </div>
        <div class="grid grid-rows-2 grid-cols-3 gap-20px">
          <div
            v-for="item in defaultBackgrounds"
            :key="item"
            class="
              w-100px h-80px
              bg-[#ffffff1a]
              rounded-10px
              flex items-center justify-center
              group
            "
          >
            <img class="w-full h-full object-contain" :src="item" alt="">
            <!-- 选中按钮 -->
            <div class="group-hover-opacity-100 grid place-items-center w-24px h-24px bg-[#ffffff1a] rounded-full opacity-0 transition-opacity duration-100 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5" /></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 自定义墙纸 -->
      <div class="w-full">
        <!-- title -->
        <div class="w-full h-4 font-bold mb-10px">
          自定义墙纸
        </div>
        <div class="grid grid-rows-2 grid-cols-3 gap-20px">
          <div
            v-for="item in 1"
            :key="item"
            class="
              w-100px h-80px
              bg-[#ffffff1a]
              rounded-10px object-contain
              flex items-center justify-center
              relative
              group
            "
          >
            <!-- 选中按钮 -->
            <div class="group-hover-opacity-100 grid place-items-center w-24px h-24px bg-[#ffffff1a] rounded-full opacity-0 transition-opacity duration-100 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5" /></svg>
            </div>

            <!-- 删除按钮 -->
            <div class="hover:bg-[#ffffff90] group-hover-opacity-100 absolute top-3px right-3px grid place-items-center w-20px h-20px bg-[#ffffff1a] rounded-full opacity-0 transition-opacity duration-100 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></svg>
            </div>
          </div>

          <div
            class="
              w-100px h-80px
              bg-[#ffffff1a]
              rounded-10px object-contain
              flex items-center justify-center
              text-[#ffffff90]
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M8 12h8m-4-4v8" /></g></svg>
          </div>
        </div>
      </div>

      <!-- 墙纸的遮罩浓度 -->
      <div class="w-full">
        <div class="w-full h-4 font-bold mb-10px">
          遮罩浓度
        </div>
        <CustomRange
          class="w-full h-30px"
          :min="0.3"
          :max="4"
          :step="0.1"
        />
      </div>

      <!-- 墙纸的模糊度 -->
      <div class="w-full">
        <div class="w-full h-4 font-bold mb-10px">
          模糊度
        </div>
        <CustomRange
          class="w-full h-30px"
          :min="0.3"
          :max="4"
          :step="0.1"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
