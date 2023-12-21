<script setup lang="ts">
import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { broadcast, isShrinkSidebar } from '~/logic/storage'
import type { IAppStatus } from '~/typings/app'

defineProps<{
  // appHomeShowMode: NonNullable<IAppStatus['appShowMode']>
  appHomeShowMode: IAppStatus['appShowMode']
}>()
const emits = defineEmits(['update:appHomeShowMode'])

const isShrink = ref(isShrinkSidebar.value === 'true')
watch(isShrink, (v) => {
  isShrinkSidebar.value = `${v}`
})

const shrinkBtnRef = ref<HTMLElement | null>(null)
const isHideBtn = ref(true) // 这个变量纯纯的是为了让按钮隐藏的时候延迟几秒

function toggleShrink() {
  if (!shrinkBtnRef.value)
    return

  const rotate = ['rotate(0)', 'rotate(180deg)']
  const animation = shrinkBtnRef.value.animate(
    { transform: isShrink.value ? [...rotate].reverse() : rotate },
    { duration: 300, fill: 'forwards' },
  )
  animation.onfinish = () => {
    isShrink.value = !isShrink.value

    if (isShrink.value) {
      setTimeout(() => {
        isHideBtn.value = true
      }, 1000 * 1)
    }
    else {
      isHideBtn.value = false
    }
  }
}

onMounted(() => {
  handleSynchronize()
})
function handleSynchronize() {
  broadcast.syncSidebar.listen(async (event: MessageEvent<any>) => {
    if (JSON.parse(event.data).cmd === 'syncSidebar') {
      // 同步
      toggleShrink()
    }
  })
}
function noticeSynchronize() {
  broadcast.syncSidebar.call()
}

// -----------------显示模式: 'normal' || 'clean' -------------------------//

const toggleAppHomeShowMode = useThrottleFn ((item: 'normal' | 'clean') => {
  emits('update:appHomeShowMode', item)
}, 400)
</script>

<template>
  <div
    :style="{
      width: isShrink ? '0px' : '48px',
      marginLeft: isShrink ? '0px' : '5px',
      marginRight: isShrink ? '0px' : '5px',
      transform: isShrink ? 'translateX(-24px)' : 'unset',
      transitionProperty: 'transform,width',
    }"
    class="h-[calc(100vh_-_10px)] my-auto text-white duration-300 ease-in-out relative flex-shrink-0"
  >
    <div class="w-full h-full bg-[#252835] rounded-10px py-10px flex flex-col gap-10px flex-shrink-0">
      <div class="w-full flex-1 flex flex-col justify-start items-center gap-10px">
        <div class="tooltip tooltip-right before:text-12px before:ml-10px before:bg-[#252835]" data-tip="正常模式">
          <div
            :class="appHomeShowMode === 'normal' ? 'bg-[#5021FF]' : ''"
            class="w-32px h-32px bg-[#484E64] rounded-6px grid place-items-center cursor-pointer [&>*:hover]:scale-120"
            @click="toggleAppHomeShowMode('normal')"
          >
            <div class="transition-transform ease-in-out w-5 h-5" i-carbon-grid />
          </div>
        </div>

        <div class="tooltip tooltip-right before:text-12px before:ml-10px before:bg-[#252835]" data-tip="极简模式">
          <div
            :class="appHomeShowMode === 'clean' ? 'bg-[#5021FF]' : ''"
            class="w-32px h-32px bg-[#484E64] rounded-6px grid place-items-center cursor-pointer [&>*:hover]:scale-120"
            @click="toggleAppHomeShowMode('clean')"
          >
            <div class="transition-transform ease-in-out w-5 h-5" i-carbon-clean />
          </div>
        </div>
      </div>

      <div class="w-full h-fit flex flex-col justify-start items-center gap-10px">
        <div class="w-32px h-32px hover:bg-[#484E64] rounded-6px grid place-items-center cursor-pointer [&>svg:hover]:scale-120">
          <svg class="transition-transform ease-in-out" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <g fill="none">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M18 12h-.801c-.83 0-1.245 0-1.589.195c-.344.194-.557.55-.984 1.261l-.03.052c-.398.663-.597.994-.886.989c-.29-.006-.476-.345-.849-1.022l-1.687-3.067c-.347-.632-.52-.948-.798-.963c-.277-.015-.484.28-.897.87l-.283.405c-.44.627-.659.94-.984 1.11c-.326.17-.709.17-1.474.17H6" /><path fill="currentColor" d="m8.962 18.91l.464-.588l-.464.589ZM12 5.5l-.54.52a.75.75 0 0 0 1.08 0L12 5.5Zm3.038 13.41l.465.59l-.465-.59ZM12 20.487v-.75v.75Zm-9.343-7.09a.75.75 0 0 0 1.273-.792l-1.273.792Zm3.873 2.376a.75.75 0 0 0-1.06 1.062l1.06-1.062ZM2.75 9.137c0-2.803 1.257-4.542 2.83-5.14c1.575-.6 3.771-.167 5.88 2.024l1.08-1.04C10.15 2.496 7.345 1.72 5.046 2.595C2.743 3.471 1.25 5.888 1.25 9.137h1.5ZM15.503 19.5c1.492-1.177 3.28-2.754 4.703-4.516c1.407-1.743 2.544-3.775 2.544-5.847h-1.5c0 1.551-.872 3.246-2.211 4.905c-1.323 1.639-3.015 3.137-4.465 4.28l.929 1.178ZM22.75 9.137c0-3.25-1.493-5.666-3.796-6.542c-2.299-.874-5.103-.1-7.494 2.385l1.08 1.04c2.109-2.19 4.305-2.622 5.88-2.023c1.573.598 2.83 2.337 2.83 5.14h1.5ZM8.497 19.5c1.275 1.004 2.153 1.736 3.503 1.736v-1.5c-.73 0-1.184-.319-2.574-1.414L8.497 19.5Zm6.077-1.178c-1.39 1.095-1.843 1.414-2.574 1.414v1.5c1.35 0 2.228-.732 3.503-1.736l-.929-1.178ZM3.93 12.604c-.746-1.199-1.18-2.373-1.18-3.467h-1.5c0 1.48.58 2.932 1.407 4.26l1.273-.793Zm5.496 5.718a33.551 33.551 0 0 1-2.896-2.55l-1.06 1.062A35.022 35.022 0 0 0 8.497 19.5l.93-1.178Z" />
            </g>
          </svg>
        </div>

        <div class="w-32px h-32px hover:bg-[#484E64] rounded-6px grid place-items-center cursor-pointer [&>svg:hover]:scale-120">
          <svg class=" transition-transform ease-in-out" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.5 8H11v6l4.75 2.85l.75-1.23l-4-2.37zm4.837-6.19l4.607 3.845l-1.28 1.535l-4.61-3.843zm-10.674 0l1.282 1.536L3.337 7.19l-1.28-1.536zM12 4a9 9 0 1 0 .001 18.001A9 9 0 0 0 12 4zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7z" />
          </svg>
        </div>
      </div>

      <div
        ref="shrinkBtnRef"
        class="
          w-fit h-fit mx-auto
          flex flex-col justify-start items-center gap-10px
          origin-[100%_50%]
          ease-linear transition-opacity duration-300
        "
        :style="{
          transform: isShrink ? 'rotate(180deg)' : 'rotate(0deg)',
        }"
        :class="
          isShrink
            ? isHideBtn
              ? 'opacity-0 hover:opacity-100'
              : 'opacity-100'
            : 'opacity-100'
        "
      >
        <div
          class="w-32px h-32px bg-[#5021FF] rounded-6px grid place-items-center cursor-pointer [&>svg:hover]:scale-120"
          @click="
            toggleShrink();
            noticeSynchronize()
          "
        >
          <svg class="transition-transform ease-in-out" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <path fill="currentColor" d="m11 18l-6-6l6-6l1.4 1.4L7.825 12l4.575 4.6L11 18Zm6.6 0l-6-6l6-6L19 7.4L14.425 12L19 16.6L17.6 18Z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
