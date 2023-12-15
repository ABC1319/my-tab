<script setup lang="ts">
import { useElementSize, useWindowSize } from '@vueuse/core'
import { watch } from 'vue'
import { broadcast } from '~/logic'
import { deletePinedWebsite, editPinedWebsite, getPinedWebsite } from '~/logic/websiteData'
import type { WebsiteParams } from '~/typings/website'
import { createDragInHorizontal } from '~/utils/drag'
import { getColorFromPalettes } from '~/utils/random-color'

const reg = /:\/\/(?:www\.)?(.)/

const DEFAULT_SITES: WebsiteParams = {
  webName: 'default-add',
  url: 'https://mmeme.me/',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13v3q0 .425.288.713T12 17q.425 0 .713-.288T13 16v-3h3q.425 0 .713-.288T17 12q0-.425-.288-.713T16 11h-3V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v3H8q-.425 0-.713.288T7 12q0 .425.288.713T8 13h3Zm1 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>',
  type: 0,
}

const websites = ref<WebsiteParams[]>([
  DEFAULT_SITES,
])

const modalRef = ref<typeof import('~/components/CustomModal.vue').default | null>(null)

// 这里使用两个变量的原因是：要获取 main DOM 的 width 来确定每行几个
// 但是在初始化的时候，main DOM 还没有渲染出来
// 等 onMounted 的时候再确定，会每次都有排列动画，效果不好
// 所以初始的时候，要么确定 main DOM 的宽度(100vw - 48)，要么就直接给个默认值(使用 window.innerWidth )
// 这里使用 window.innerWidth 去确定个数

const outerContainerRef = ref(null)
const { width: windowWidth } = useWindowSize()
const { width } = useElementSize(outerContainerRef)

const options = ref({
  containerClassName: 'drag-container',
  elementsClassName: 'my-website-item',
  defaultPinedClassName: DEFAULT_SITES.webName,
  size: { width: 144, height: 88 },
  gap: 20,
  maximumInLine: Math.min(Math.floor((windowWidth.value - 100 - 58) / (144 + 20)), 6), // 58 是 sidebar 的 width
  duration: 300,
})

const containerWidth = computed(() => {
  const w = (options.value.size.width + options.value.gap) * options.value.maximumInLine - options.value.gap
  return `${w}px`
})
const containerHeight = computed(() => {
  const h = (options.value.size.width + options.value.gap) * Math.ceil(websites.value.length / options.value.maximumInLine) - options.value.gap
  return `${h}px`
})

const currentSiteCfg = ref<WebsiteParams>({
  webName: '',
  url: '',
  icon: '',
  type: 0,
  remark: {
    color: getColorFromPalettes(),
  },
})

const defaultIcon = computed(() => {
  const match = currentSiteCfg.value.url.match(reg)
  if (match && match[1])
    return match[1]
  else
    return ''
})

await getList()
async function getList() {
  websites.value = [...(await getPinedWebsite()), DEFAULT_SITES]
}

let isDraggedSite = false
const { isDragged, resetLayout } = createDragInHorizontal(options.value)
watch(isDragged, () => {
  isDraggedSite = true
})
watch(width, (val) => {
  const max = Math.min(Math.floor((val - 100) / (options.value.size.width + options.value.gap)), 6)
  if (max !== options.value.maximumInLine) {
    options.value.maximumInLine = max
    resetLayout(undefined, undefined, max)
  }
})

onMounted(() => {
  handleSynchronize()
})

function handleSynchronize() {
  broadcast.onmessage(async (event: MessageEvent<any>) => {
    if (JSON.parse(event.data).cmd === 'SynchronizeWebsites') {
      await getList()
      resetLayout()
    }
  })
}

function noticeSynchronize() {
  broadcast.synchronizeWebsites()
}

function openSiteModal(item: WebsiteParams) {
  if (isDraggedSite) {
    isDraggedSite = false
  }
  else {
    if (item.webName === DEFAULT_SITES.webName) {
      currentSiteCfg.value = {
        webName: '',
        url: '',
        icon: '',
        type: 0,
        remark: {
          color: getColorFromPalettes(),
        },
      }
      modalRef.value?.open()
    }
    else {
      window.open(item.url, item.url)
    }
  }
}

function closeSiteModal() {
  modalRef.value?.close()
  currentSiteCfg.value = {
    webName: '',
    url: '',
    icon: '',
    type: 0,
  }
}

function addWebsite() {
  if (currentSiteCfg.value.url === '' || currentSiteCfg.value.webName === '') {
    alert('请先输入网站地址')
  }
  else {
    const { id, webName, url, remark } = currentSiteCfg.value

    editPinedWebsite({
      id,
      url,
      webName,
      icon: '',
      type: 0,
      remark: {
        defaultIcon: defaultIcon.value,
        color: remark?.color || getColorFromPalettes(),
      },
    }).then(async () => {
      await getList()

      closeSiteModal()
      nextTick(() => {
        resetLayout()
        noticeSynchronize()
      })
    })
  }
}

const contextMenuPosition = ref({
  x: 0,
  y: 0,
})
const contextMenuRef = ref<typeof import('~/components/CustomContextMenu.vue').default | null>(null)
const contextMenuOptions = [
  { label: '编辑', key: 'edit' },
  { label: '删除', key: 'delete' },
]

function openContextmenu(item: WebsiteParams, e: MouseEvent) {
  e.preventDefault()

  if (item.webName === DEFAULT_SITES.webName)
    return

  contextMenuPosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
  contextMenuRef.value?.open()

  currentSiteCfg.value = item
}
function handleSelectContextMenu(e: typeof contextMenuOptions[number]) {
  switch (e.key) {
    case 'edit':
      edit()
      break
    case 'delete':
      del()
      break

    default:
      break
  }

  function del() {
    if (currentSiteCfg.value && currentSiteCfg.value.id) {
      deletePinedWebsite(currentSiteCfg.value.id)
        .then(async () => {
          await getList()
          nextTick(() => {
            resetLayout()
            noticeSynchronize()
          })

          contextMenuRef.value?.close()
        })
    }
  }

  function edit() {
    modalRef.value?.open()
  }
}
</script>

<template>
  <div ref="outerContainerRef" class="w-full flex justify-center items-center min-w-[320px]">
    <div
      :class="options.containerClassName" class="my-website-box" :style="{
        width: containerWidth,
        height: containerHeight,
      }"
    >
      <div
        v-for="item in websites" :key="item.webName" :class="`${options.elementsClassName} webName-${item.webName}`"
        class="
          w-144px h-88px
          flex flex-col justify-center items-center gap-5px flex-shrink-0 flex-grow-0
          cursor-pointer
          overflow-hidden
          rounded-10px
          text-center
        " @click="openSiteModal(item)" @contextmenu="e => openContextmenu(item, e)"
      >
        <div v-if="item.icon" class="w-10 h-10 grid place-items-center" v-html="item.icon" />
        <div
          v-else class="alpha-icon w-10 h-10 grid place-items-center text-18px"
          :style="{ background: item?.remark?.color || 'green' }"
        >
          {{ item?.remark && item?.remark?.defaultIcon }}
        </div>

        <div class="w-full select-none">
          {{ item.webName === DEFAULT_SITES.webName ? '' : item.webName }}
        </div>
      </div>
    </div>
  </div>

  <CustomModal ref="modalRef">
    <div class="modal-content-container flex flex-row justify-around items-center my-8 w-560px max-w-66vw min-w-350px">
      <div class="mt-34px">
        <div class="w-220px h-130px grid place-items-center bg-white rounded-10px">
          <div
            class="alpha-icon w-10 h-10 grid place-items-center text-18px"
            :style="{ background: currentSiteCfg.remark?.color || 'green' }"
          >
            {{ defaultIcon }}
          </div>
        </div>

        <div
          class="w-58px h-24px mt-14px bg-[#404459] rounded-md text-[#fafafa] ml-auto flex flex-row cursor-pointer overflow-hidden "
        >
          <div class="w-24px h-full grid place-items-center flex-1 hover:bg-[#2528366b]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3 21h3.75L17.81 9.94l-3.75-3.75L3 17.25V21zm2-2.92l9.06-9.06l.92.92L5.92 19H5v-.92zM18.37 3.29a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34z"
              />
            </svg>
          </div>
          <div class="h-full w-1px bg-[#00000036]" />
          <div class="w-24px h-full grid place-items-center flex-1 hover:bg-[#2528366b]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <div class="flex flex-col justify-start items-start">
          <label for="name-input" class="my-2 text-14px">
            名称
          </label>
          <input
            id="name-input" v-model="currentSiteCfg.webName" :maxlength="128" type="text" class="
            w-225px h-8 text-14px
            rounded-6px
          bg-[#404459] text-[#fafafa]
            box-border px-16px py-8px
            outline-none
          "
          >

          <label for="url-input" class="my-2 text-14px">
            地址
          </label>
          <input
            id="url-input" v-model="currentSiteCfg.url" :maxlength="128" type="text" class="
            w-225px h-8 text-14px
            rounded-6px
          bg-[#404459] text-[#fafafa]
            box-border px-16px py-8px
            outline-none
          "
          >
        </div>

        <div class="flex flex-row gap-2 mt-32px">
          <button
            class="
            ok-btn
            w-108px h-32px text-14px
            rounded-6px
            bg-[#404459] text-[#fafafa]
            hover:bg-[#4044596b]
          " @click="addWebsite"
          >
            确定
          </button>
          <button
            class="
            cancel-btn
            w-108px h-32px text-14px
            rounded-6px
            bg-[#40445990] text-[#fafafa]
            hover:bg-[#4044596b]
          " @click="closeSiteModal"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </CustomModal>

  <CustomContextMenu
    ref="contextMenuRef" :x="contextMenuPosition.x" :y="contextMenuPosition.y"
    :options="contextMenuOptions" @select="handleSelectContextMenu"
  />
</template>

<style scoped>
.my-website-box {
  will-change: width, height;
  transition-property: width, height;
  transition-duration: 300ms;
  transition-timing-function: linear;
}

.my-website-item {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  clip-path: path("M 0 44 C 0 0.9849735503722608 0.9849735503722608 0 44 0 L 100 0 C 143.01502644962773 0 144 0.9849735503722608 144 44 L 144 44 C 144 87.01502644962774 143.01502644962773 88 100 88 L 44 88 C 0.9849735503722608 88 0 87.01502644962774 0 44 z");
}

.my-website-item::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 8px;
  background: none;
  box-shadow: inset 0 0 0 200px rgb(255, 255, 255, 0.2);
  filter: blur(16px);
  pointer-events: none;
}

.ok-btn,
.cancel-btn {
  clip-path: path(M 0 16 C 0 0.358172 0.358172 0 16 0 L 92 0 C 107.642 0 108 0.358172 108 16 L 108 16 C 108 31.6418 107.642 32 92 32 L 16 32 C 0.358172 32 0 31.6418 0 16 Z);
}

@media screen and (max-width: 710px) {
  .modal-content-container {
    flex-direction: column;
    min-width: 260px;
    width: 260px;
    margin-top: unset;
  }
}

.alpha-icon {
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-image: url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3e%3c/svg%3e");

  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-image: url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3e%3c/svg%3e");
}
</style>
