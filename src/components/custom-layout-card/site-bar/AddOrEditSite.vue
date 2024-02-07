<script setup lang="ts">
import { VisuallyHidden } from 'radix-vue'
import { broadcast } from '~/logic'
import { editPinedWebsite } from '~/logic/websiteData'
import type { WebsiteParams } from '~/typings/website'
import { getColorFromPalettes } from '~/utils/random-color'

// const props = defineProps<{
//   currentSite?: WebsiteParams
// }>()

const emit = defineEmits(['handleOK'])

const DEFAULT_SITES: WebsiteParams = {
  id: 0,
  webName: 'default-add',
  url: 'https://mmeme.me/',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13v3q0 .425.288.713T12 17q.425 0 .713-.288T13 16v-3h3q.425 0 .713-.288T17 12q0-.425-.288-.713T16 11h-3V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v3H8q-.425 0-.713.288T7 12q0 .425.288.713T8 13h3Zm1 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>',
  type: 0,
  index: 0,
}
const currentSiteCfg = ref<WebsiteParams>({
  webName: '',
  url: '',
  icon: '',
  type: 0,
  index: -1,
  remark: {
    color: getColorFromPalettes(),
  },
})

const isOpen = ref(false)

const isShowUrlDropdown = computed(() => {
  const isNeedComplete
    = !(
      currentSiteCfg.value.url.includes('http://')
      || currentSiteCfg.value.url.includes('https://')
    ) && currentSiteCfg.value.url.includes('.')

  return isNeedComplete
})

const defaultIcon = computed(() => {
  const match = currentSiteCfg.value.url.match(/:\/\/(?:www\.)?(.)/)
  if (match && match[1])
    return match[1]
  else
    return ''
})

function handleClickUrlDropdown(item: string) {
  const isNeedComplete = !(currentSiteCfg.value.url.includes('http://')
    || currentSiteCfg.value.url.includes('https://'))

  if (isNeedComplete)
    currentSiteCfg.value.url = `${item}${currentSiteCfg.value.url}`
}

const urlIconFileInputRef = ref<HTMLInputElement | null>(null)

function toggleUpload() {
  urlIconFileInputRef.value?.click()
}

function handleUploadUrlIcon(e: any) {
  const file = e.target.files[0]
  currentSiteCfg.value.icon = file

  // 将 blob 转为图片渲染到页面
  renderBlobUrlIcon(file).then((res) => {
    // eslint-disable-next-line dot-notation
    currentSiteCfg.value!['remark']!['renderIcon'] = res
  })
}

function clearUrlIcon() {
  currentSiteCfg.value.icon = ''
}

function renderBlobUrlIcon(file: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      const iconUrl = URL.createObjectURL(file)
      resolve(
        `
          <img
            class="w-full h-full object-cover pointer-events-none select-none"
            src="${iconUrl}"
            alt="自定义图标"
          >
        `,
      )
    }
  })
}

async function addShakeAnimation() {
  const animateOutDom1 = document.querySelectorAll('.address-tooltip')[0] as HTMLElement
  animateOutDom1.classList.add('shake-animation')
  animateOutDom1.innerHTML = '请输入地址'

  const ANIMATIONS = animateOutDom1.getAnimations()
  await Promise.all(ANIMATIONS.map(animation => animation.finished))
  animateOutDom1.classList.remove('shake-animation')
  animateOutDom1.innerHTML = '(必填)'
}

function addWebsite() {
  // 1. 名称
  if (currentSiteCfg.value.url === '') {
    // alert('请输入地址')
    addShakeAnimation()
    return
  }
  if (currentSiteCfg.value.webName === '') {
    const webName = currentSiteCfg.value.url.match(/:\/\/(\S+)\./)?.[1]

    if (webName)
      currentSiteCfg.value.webName = webName
    else
      currentSiteCfg.value.webName = currentSiteCfg.value.url
  }
  // 2. 存储
  const { id, webName, url, remark, index, icon } = currentSiteCfg.value

  editPinedWebsite({
    id,
    url,
    webName,
    index,
    icon,
    type: 0,
    remark: {
      defaultIcon: defaultIcon.value,
      color: remark?.color || getColorFromPalettes(),
    },
  }).then(async () => {
    emit('handleOK')
    isOpen.value = false

    nextTick(() => {
      noticeSynchronize()
    })
  })
}

function noticeSynchronize() {
  broadcast.syncWebsites.call()
}
</script>

<template>
  <Dialog :open="isOpen">
    <DialogTrigger as-child>
      <SiteBarItem :icon="DEFAULT_SITES.icon" :web-name="DEFAULT_SITES.webName" @click="isOpen = true" />
    </DialogTrigger>
    <DialogContent class="w-fit! max-w-unset!">
      <VisuallyHidden as-child>
        <DialogHeader>
          <DialogTitle>添加或修改</DialogTitle>
          <DialogDescription>
            添加或修改网址
          </DialogDescription>
        </DialogHeader>
      </VisuallyHidden>

      <!-- 关闭按钮 -->
      <div
        class="absolute top-3 right-3 p-0.5 transition-colors rounded-md cursor-pointer"
        @click="isOpen = false"
      >
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12" /></svg>
        <span class="sr-only">Close</span>
      </div>

      <!-- 表单 -->
      <div class="modal-content-container flex flex-row justify-around items-center my-8 w-560px max-w-66vw min-w-350px">
        <div class="flex flex-col gap-10px mt-22px">
          <div
            class="new-website-item w-215px h-130px grid place-items-center bg-white rounded-10px"
          >
            <div
              v-if="currentSiteCfg.icon && currentSiteCfg?.remark?.renderIcon"
              class="w-10 h-10 grid place-items-center"
              v-html="currentSiteCfg.remark.renderIcon"
            />
            <div
              v-else
              class="alpha-icon w-10 h-10 grid place-items-center text-18px"
              :style="{ background: currentSiteCfg.remark?.color || 'transparent' }"
            >
              {{ defaultIcon }}
            </div>
          </div>

          <div
            class="w-58px h-24px mt-14px bg-[#404459] rounded-md text-[#fafafa] ml-auto flex flex-row cursor-pointer overflow-hidden "
          >
            <div class="w-24px h-full grid place-items-center flex-1 hover:bg-[#2528366b]" @click="toggleUpload">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3 21h3.75L17.81 9.94l-3.75-3.75L3 17.25V21zm2-2.92l9.06-9.06l.92.92L5.92 19H5v-.92zM18.37 3.29a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34z"
                />
              </svg>
            </div>
            <div class="h-full w-1px bg-[#00000036]" />
            <div class="w-24px h-full grid place-items-center flex-1 hover:bg-[#2528366b]" @click="clearUrlIcon">
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
            <label for="url-input" class="my-2 text-14px relative select-none">
              <!-- <span class="text-red-600 absolute top-5px left-[-10px] leading-1rem">
              *
            </span> -->
              地址
              <div class="address-tooltip text-red-600 text-12px inline-block">
                (必填)
              </div>
            </label>

            <div class="dropdown">
              <input
                id="url-input" v-model="currentSiteCfg.url" :maxlength="128" type="text" class="
                w-225px h-8 text-14px
                rounded-6px
              bg-[#404459] text-[#fafafa]
                box-border px-16px py-8px
                outline-none
              "
              >
              <ul
                v-if="isShowUrlDropdown" tabindex="0" class="
                dropdown-content menu
                mt-5px rounded-5px bg-[#030615]
                w-[-webkit-fill-available]
                z-[1] shadow
              "
              >
                <li
                  v-for="item in ['https://', 'http://']" :key="item" class="rounded-5px hover:bg-[#3b5078]"
                  @click="handleClickUrlDropdown(item)"
                >
                  <a class="px-7px py-3px rounded-4px">
                    {{ `${item}${currentSiteCfg.url}` }}
                  </a>
                </li>
              </ul>
            </div>

            <label for="name-input" class="my-2 text-14px select-none">
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
          </div>

          <div class="flex flex-row gap-2 mt-32px">
            <button
              class="
                ok-btn
                w-108px h-32px text-14px
                rounded-6px
                bg-[#404459] text-[#fafafa]
                hover:bg-[#4044596b]
              "
              @click="addWebsite"
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
              "
              @click="isOpen = false"
            >
              取消
            </button>
          </div>
        </div>
      </div>
      <input v-show="false" ref="urlIconFileInputRef" type="file" accept="image/*" @change="handleUploadUrlIcon">
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.shake-animation {
  animation: move 2s 0s forwards;
  -webkit-animation: move 2s 0s forwards;
  transform-origin: bottom;
  -webkit-transform-origin: bottom;
}

.ok-btn,
.cancel-btn {
  clip-path: path(
    M 0 16 C 0 0.358172 0.358172 0 16 0 L 92 0 C 107.642 0 108 0.358172 108 16 L
      108 16 C 108 31.6418 107.642 32 92 32 L 16 32 C 0.358172 32 0 31.6418 0 16
      Z
  );
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
