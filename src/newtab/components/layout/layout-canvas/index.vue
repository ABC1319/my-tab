<script setup lang="ts">
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { initGridContainer } from './draggable'
import WidgetsPanel from './WidgetsPanel.vue'
import Ruler from './Ruler.vue'
import WallpaperPanel from './WallpaperPanel.vue'
import { appHomeShowMode, appIsEditCleanHome, appIsEditWallpaper, appWallPaper, widgetsPopupWindowId } from '~/logic/storage'
import { getAllCustomLayoutComponentsRaw } from '~/utils/layout-components'
import type { ILayoutComponentTypeInData, ILayoutComponentTypeInPage } from '~/typings/layout'
import { deleteLayoutComponents, editLayoutComponents, getComponentsById } from '~/logic/layoutComponentsData'
import { defaultWallpapers } from '~/params/wallpaper'
import { getAllCustomWallPaper } from '~/logic/customWallpaperData'
import { renderBlobToImage } from '~/utils/wallpaper'

const customLayoutAllComponents = await getAllCustomLayoutComponentsRaw()

const bentoCells = ref<ILayoutComponentTypeInPage[]>([])
const layoutContainerRef = ref()
const currentClickedElement: Ref<ILayoutComponentTypeInData | null> = ref(null)
const disabledDraggable = ref(!appIsEditCleanHome.value)

/**
 * 全部逻辑：
 * 1. 拖拽过来，其中有两种保存
 *  a. 变化后保存
 *  b. 离开前保存
 *
 * 2. 这里没有思考那么多可能会造成的性能损耗，直接在离开前保存（只考虑业务逻辑，不考虑其他比如刷新或者关闭造成的异常了）
 * 2.1 一个是切换布局的时候，一个是离开编辑模式的时候。
 * 2.2 此外，定时每 30s 主动保存一下。
 */

// ------------------保存 start -------------------------//
watch(appHomeShowMode, async () => {
  await handleOnlySaveLayout()
  getList()
})

watch(appIsEditCleanHome, async () => {
  await handleOnlySaveLayout()

  // 如果是编辑模式，那么需要禁用拖拽
  disabledDraggable.value = !appIsEditCleanHome.value
})

const intervalID = setInterval(() => {
  if (appIsEditCleanHome.value)
    handleOnlySaveLayout()
}, 1000 * 3)
onUnmounted(() => {
  clearInterval(intervalID && intervalID)
})
// ------------------保存 end -------------------------//

// ------------------ruler start -------------------------------//
const xRulerPosition = ref(0)
const yRulerPosition = ref(0)
// ------------------ruler end -------------------------------//

await getList()

async function getList() {
  const allComponentsData = await getComponentsById(appHomeShowMode.value || 0) as ILayoutComponentTypeInData[]

  if (allComponentsData.length === 0) {
    // 说明没有查到，这里是空白
    bentoCells.value = []
  }
  else {
    const processingData = allComponentsData.map((item) => {
      const component = customLayoutAllComponents.find(cp => cp.name === item.componentName)
      if (component) {
        return {
          id: item.id,
          layoutName: item.layoutName,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          isFixed: item.isFixed,
          componentName: item.componentName,
          component: markRaw(component.raw.default),
          scale: item.scale,
          rotate: item.rotate,
          isVerticalCenter: item.isVerticalCenter,
        }
      }
      else {
        return null!
      }
    })

    bentoCells.value = processingData.filter(r => r !== null)
  }
}

// 计算缩放比例
const layoutContainerScale = ref(1)
const { width, height } = useWindowSize()
onMounted(() => {
  layoutContainerScale.value = calculateMainScale()
})
watch([width, height], () => {
  layoutContainerScale.value = calculateMainScale()
})
watch(widgetsPopupWindowId, () => {
  layoutContainerScale.value = calculateMainScale()
})

function calculateMainScale() {
  // 距离间隔
  const g = widgetsPopupWindowId.value === -1 ? 80 : 36
  // 获取抽屉的宽度
  const w = widgetsPopupWindowId.value === -1 ? 200 : 50
  // 获取初始页面的宽度
  const ow = layoutContainerRef.value.offsetWidth
  // 页面的宽度减去抽屉的宽度再减去Gap的值，就是main缩放后的值
  const d = ow - w - g
  // 缩放后的宽度除以初始宽度，得到要缩放的比例
  const percentage = (d / ow).toFixed(6)
  return Number(percentage)
}
/**
 * 1. 进入编辑模式
 * 2. 添加小组件
 */
onMounted(async () => {
  initGridContainer(
    bentoCells,
    currentClickedElement,
    disabledDraggable,
    layoutContainerRef.value,
    layoutContainerScale,
    xRulerPosition,
    yRulerPosition,
  )
})

// ------------------拖拽 start -------------------------//
function handleDrop(e: DragEvent) {
  e.preventDefault()
  const componentName = e.dataTransfer!.getData('text/plain')

  // 1. 通过 componentName 去匹配组件
  // 2. 赋值给 bentoCells
  const component = customLayoutAllComponents.find(components => components.name === componentName)
  const mouseXY = calcPosition()

  if (component) {
    const newId = bentoCells.value.reduce((maxId, cell) => Math.max(maxId, cell.id || 0), 0) + 1

    bentoCells.value.push({
      id: newId,
      layoutName: appHomeShowMode.value,
      x: mouseXY.x,
      y: mouseXY.y,
      width: 100,
      height: 100,
      isFixed: false,
      componentName: component.name,
      component: markRaw(component.raw.default),
      scale: 1,
      rotate: 0,
      isVerticalCenter: false,
    })
  }

  function calcPosition() {
    const originX = layoutContainerRef.value.getBoundingClientRect().left
    const originY = layoutContainerRef.value.getBoundingClientRect().top

    const mouseX = (e.clientX - originX) / layoutContainerScale.value
    const mouseY = (e.clientY - originY) / layoutContainerScale.value

    return {
      x: mouseX,
      y: mouseY,
    }
  }
}

function handleDragover(e: DragEvent) {
  e.preventDefault()
}
// ------------------拖拽 end -----------------------------//

// ------------------保存 start ---------------------------//
function handleSaveLayoutAndClose() {
  const promises = bentoCells.value.map((item) => {
    return new Promise((resolve) => {
      editLayoutComponents({
        id: item.id,
        layoutName: item.layoutName,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        isFixed: item.isFixed,
        componentName: item.componentName,
        scale: item.scale,
        rotate: item.rotate,
        isVerticalCenter: item.isVerticalCenter,
      }).then(resolve)
    })
  })

  Promise.all(promises).then(() => {
    handleCancelLayout()
  })
}

function handleOnlySaveLayout() {
  const promises = bentoCells.value.map((item) => {
    return new Promise((resolve) => {
      editLayoutComponents({
        id: item.id,
        layoutName: item.layoutName,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        isFixed: item.isFixed,
        componentName: item.componentName,
        scale: item.scale,
        rotate: item.rotate,
        isVerticalCenter: item.isVerticalCenter,
      }).then(resolve)
    })
  })

  Promise.all(promises).then(() => {})
}

function handleCancelLayout() {
  appIsEditCleanHome.value = false
}
// ------------------保存 end -----------------------------//

// ------------------修改组件 end -----------------------------//

function lockComponent(item: ILayoutComponentTypeInPage) {
  item.isFixed = !item.isFixed

  editLayoutComponents({
    id: item.id,
    layoutName: item.layoutName,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    isFixed: item.isFixed,
    componentName: item.componentName,
    scale: item.scale,
    rotate: item.rotate,
    isVerticalCenter: item.isVerticalCenter,
  })
}
function deleteComponent(item: ILayoutComponentTypeInPage) {
  const index = bentoCells.value.findIndex(cell => cell.id === item.id)
  if (index > -1) {
    bentoCells.value.splice(index, 1)
    deleteLayoutComponents(item.id!)
  }
}

function resizingComponent(_item: ILayoutComponentTypeInPage) {
}
function rotateComponent(_item: ILayoutComponentTypeInPage) {
}

function verticalCenterComponent(item: ILayoutComponentTypeInPage) {
  // 让这个组件的状态变成居中
  // 设置其位置
  item.isVerticalCenter = !item.isVerticalCenter
  editLayoutComponents({
    id: item.id,
    layoutName: item.layoutName,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    isFixed: item.isFixed,
    componentName: item.componentName,
    scale: item.scale,
    rotate: item.rotate,
    isVerticalCenter: item.isVerticalCenter,
  })
}
// ------------------修改组件 end -----------------------------//

// ------------------更改墙纸 start -----------------------------//
// onMounted(() => {
//   // 因为这里需从 indexDB 中查询，然后 filter ，会慢一步。
//   // 避免从默认墙纸到实际当前墙纸的闪烁，这里不添加 duration 。等第一次加载好后，再次添加
//   setTimeout(() => {
//     const dom = document.querySelector('.background-wallpaper') as HTMLElement
//     dom.style.transitionProperty = 'all'
//     dom.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'
//     dom.style.transitionDuration = '300ms'
//   })
// })
const currentWallpaper = ref<string>('')

watch(() => appWallPaper.value.wallpaperId, async () => {
  if (!appWallPaper.value) {
    appWallPaper.value = { wallpaperId: 'default-1', blur: 0, mask: 0 }
    return
  }
  const wallpapers = await getAllWallpaper()
  if (typeof appWallPaper.value.wallpaperId === 'string') {
    // 默认
    const wallpaper = wallpapers.default?.find((item: any) => item.id === appWallPaper.value.wallpaperId)
    currentWallpaper.value = wallpaper?.image || defaultWallpapers[0].image
  }
  if (typeof appWallPaper.value.wallpaperId === 'number') {
    // 自定义墙纸
    const wallpaper = wallpapers.custom?.find((item: any) => item.id === appWallPaper.value.wallpaperId)
    currentWallpaper.value = wallpaper.renderImage || defaultWallpapers[0].image
  }
}, {
  immediate: true,
})

async function getAllWallpaper() {
  // 1. 从 indexDB 获取所有自定义壁纸 blob
  // 2. 将 blob 转成图片赋值给变量
  const originData = await getAllCustomWallPaper()

  const wallpapers_processing = await Promise.all(originData.map(async (item) => {
    if (item.image instanceof Blob) {
      const imageUrl = await renderBlobToImage(item.image) as string
      return {
        id: item.id,
        image: item.image,
        renderImage: imageUrl,
      }
    }
    else {
      return null
    }
  }))

  return {
    default: defaultWallpapers,
    custom: wallpapers_processing.filter(item => item?.image) as any,
  }
}

function handleOpenWallpaperPanel() {
  appIsEditWallpaper.value = true
}
function handleCloseWallpaperPanel() {
  appIsEditWallpaper.value = false
}
// ------------------更改墙纸 end -------------------------------//

// ------------------右键菜单跳转 start -------------------------------//
async function handleGoToBrowserPage(page: 'history' | 'settings' | 'downloads' | 'extensions') {
  const pageUrl = `chrome://${page}/`

  browser.tabs.query({ url: pageUrl }).then((res) => {
    if (res.length > 0)
      browser.tabs.update(res[0].id, { active: true })
    else
      browser.tabs.create({ url: pageUrl })
  })
}
// ------------------右键菜单跳转 end -------------------------------//
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger :disabled="appIsEditCleanHome || appIsEditWallpaper">
      <div
        ref="layoutContainerRef"
        class="
          layout-container
          w-full h-full
          absolute top-0 left-0 overflow-hidden z-50
          transition-transform duration-300 ease-in-out
          outline-10px outline-solid outline-[#474d63]
          origin-[10%_50%]
        "
        :style="{
          transform: appIsEditCleanHome ? `scale(${layoutContainerScale})` : '',
          borderRadius: appIsEditCleanHome ? '10px' : '',
          transformOrigin: widgetsPopupWindowId === -1 ? '10% 50%' : ' 20% 50%',
        }"
        @drop="handleDrop"
        @dragover="handleDragover"
      >
        <img
          class="background-wallpaper object-cover pointer-events-none select-none w-full h-full absolute top-0 left-0 bottom-0 -z-1"
          :src="currentWallpaper || defaultWallpapers[0].image"
        >
        <div
          class="background-overlay pointer-events-none select-none w-full h-full absolute top-0 left-0 bottom-0 -z-1"
          :style="{
            backdropFilter: `blur(${appWallPaper.blur}px)`,
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, ${appWallPaper.mask}) 100%), radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%)`,
          }"
        />

        <div
          v-for="item in bentoCells"
          :key="item.id"
          :style="{
            position: 'absolute',
            transform: item.isVerticalCenter
              ? ` translate3d( -50%, ${item.y}px, 0) `
              : ` translate3d( ${item.x}px, ${item.y}px, 0) `,
            left: item.isVerticalCenter
              ? ` 50% `
              : ` 0 `,
            willChange: 'transform',
          }"
          @contextmenu.stop
        >
          <div
            :id="`layout-component-${item.id}`"
            class="w-fit h-fit"
            :style="{
              transform: ` scale(${item.scale}) rotate(${item.rotate}deg) `,
              willChange: 'transform',
              transformOrigin: 'bottom center',
            }"
          >
            <component
              :is="item.component"
              :id="`single-component-${item.id}`"
              :class="appIsEditCleanHome ? 'pointer-events-none' : 'pointer-events-auto'"
            />
          </div>

          <!-- 边界，这个要和上面的 <component /> 保持一致 -->
          <div
            v-if="appIsEditCleanHome && !item.isFixed "
            :id="`single-component-bound-${item.id}`"
            class="absolute top-0 left-0 w-full h-full pointer-events-none "
            :style="{
              transform: `
            scale(${item.scale})
            rotate(${item.rotate}deg)
          `,
              willChange: 'transform',
              transformOrigin: 'bottom center',
            }"
          >
            <span class="pointer-events-none select-none absolute inset-0 border-2 border-[#474d63] border-dashed opacity-100 ">
              <span class="absolute -left-0.5 -top-0.5 h-1.5 w-1.5 border border-[#5021ff] bg-[#5021ff] " />
              <span class="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 border border-[#5021ff] bg-[#5021ff] " />
              <span class="absolute -bottom-0.5 -left-0.5 h-1.5 w-1.5 border border-[#5021ff] bg-[#5021ff] " />
              <span class="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 select-none border border-[#5021ff] bg-[#5021ff] " />
            </span>
          </div>

          <!-- 操作按钮控制条 -->
          <div
            v-if="appIsEditCleanHome"
            class="
              absolute left-1/2 top-full -translate-x-1/2 translate-y-1/2
              cursor-pointer
              flex flex-row justify-center items-center
              rounded-10px
              bg-[#474d63]
              w-fit h-30px
            "
          >
            <div
              class="rounded-l-10px w-1/2 h-full flex justify-center items-center px-8px hover:bg-#646c89 "
              :title="item.isFixed ? '解锁' : '锁定'"
              @click="lockComponent(item)"
            >
              <svg v-if="item.isFixed" class="w-20px h-20px " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4" /></g></svg>
              <svg v-else class="w-20px h-20px " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 1 0-2 0m-3-5V6a4 4 0 0 1 8 0" /></g></svg>
            </div>

            <button
              :class="item.isFixed ? 'text-gray cursor-not-allowed' : ''"
              :disabled="item.isFixed"
              class=" w-full h-full flex justify-center items-center px-8px hover:bg-#646c89 "
              title="删除"
              @click="deleteComponent(item)"
            >
              <svg class="w-20px h-20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" /></svg>
            </button>

            <button
              :class="item.isFixed ? 'text-gray cursor-not-allowed' : ''"
              :disabled="item.isFixed"
              :style="{ color: item.isVerticalCenter ? '#6eff35' : '' }"
              class=" w-full h-full flex justify-center items-center px-8px hover:bg-#646c89 "
              title="垂直居中"
              @click="verticalCenterComponent(item)"
            >
              <svg class="w-20px h-20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v20M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4m8 6h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1m8 0h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" /></svg>
            </button>

            <APopover>
              <APopoverTrigger as-child>
                <button
                  :class="item.isFixed ? 'text-gray cursor-not-allowed' : ''"
                  :disabled="item.isFixed"
                  class=" select-none rounded-r-10px w-full h-full flex justify-center items-center px-8px hover:bg-#646c89 "
                  title="缩放"
                  @click="resizingComponent(item)"
                >
                  <svg class="w-20px h-20px " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m4 0h6m-3-3v6m11 8l-6-6" /></svg>
                </button>
              </APopoverTrigger>
              <APopoverContent
                :side-offset="8"
                align="center"
                class="w-180px! h-24px z-1 border-0 !p-0 flex flex"
              >
                <CustomRange
                  v-model:value="item.scale"
                  class="w-full h-full "
                  :min="0.3"
                  :max="4"
                  :step="0.1"
                />
              </APopoverContent>
            </APopover>

            <button
              v-show="false"
              :class="item.isFixed ? 'text-gray cursor-not-allowed' : ''"
              :disabled="item.isFixed"
              class="w-full h-full flex justify-center items-center px-8px hover:bg-#646c89 "
              title="旋转"
              @click="rotateComponent(item)"
            >
              <svg class="w-20px h-20px " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19.95 11a8 8 0 1 0-.5 4m.5 5v-5h-5" /><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" /></g></svg>

              <CustomRange
                v-model:value="item.rotate"
                class="absolute top-86px left-0 w-full h-full"
                :min="0"
                :max="360"
                :step="1"
              />
            </button>
          </div>
        </div>

        <!-- 缩略图 -->
        <Transition
          name="scale"
          @after-leave="$emit('destroy')"
          @contextmenu.stop
        >
          <div v-if="false" class="absolute bottom-5px left-0 w-172px h-140px bg-[#252835] rounded-10px p-10px ">
            <div class="w-full h-full bg-[#484e64] grid place-items-center rounded-5px cursor-default">
              缩略图
            </div>
          </div>
        </Transition>

        <!-- 坐标系刻度尺 -->
        <Transition
          name="blur"
          @after-leave="$emit('destroy')"
          @contextmenu.stop
        >
          <Ruler
            v-if="appIsEditCleanHome"
            v-model:xRulerPosition="xRulerPosition"
            v-model:yRulerPosition="yRulerPosition"
            :layout-container-scale="layoutContainerScale"
          />
        </Transition>
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem class="gap-10px" @click="handleOpenWallpaperPanel">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="8" cy="9" r="2" /><path d="m9 17l6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2M8 21h8m-4-4v4" /></g></svg>
        <span>
          更改墙纸
        </span>
      </ContextMenuItem>

      <ContextMenuItem class="gap-10px" @click="appIsEditCleanHome = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></g></svg>
        <span>
          自定义布局
        </span>
      </ContextMenuItem>

      <ContextMenuSeparator class="h-[1px] bg-[#bcbbc130] m-[5px]" />

      <ContextMenuItem class="gap-10px" @click="handleGoToBrowserPage('history')">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5m4-1v5l4 2" /></g></svg>
        <span>
          历史记录
        </span>
      </ContextMenuItem>
      <ContextMenuItem class="gap-10px" @click="handleGoToBrowserPage('extensions')">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m7.5 4.27l9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7l8.7 5l8.7-5M12 22V12" /></g></svg>
        <span>
          扩展
        </span>
      </ContextMenuItem>
      <ContextMenuItem class="gap-10px" @click="handleGoToBrowserPage('downloads')">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5l5-5m-5 5V3" /></svg>
        <span>
          下载
        </span>
      </ContextMenuItem>
      <ContextMenuItem class="gap-10px" @click="handleGoToBrowserPage('settings')">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 7h-9m3 10H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></g></svg>
        <span>
          设置
        </span>
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>

  <!-- 右侧布局组件列表 -->
  <Transition
    name="slide-x"
    @after-leave="$emit('destroy')"
  >
    <WidgetsPanel
      v-if="appIsEditCleanHome"
      @save="handleSaveLayoutAndClose"
      @cancel="handleCancelLayout"
    />
  </Transition>

  <!-- 右侧壁纸组件 -->
  <Transition
    name="slide-x"
    @after-leave="$emit('destroy')"
  >
    <WallpaperPanel
      v-show="appIsEditWallpaper"
      @close="handleCloseWallpaperPanel"
    />
  </Transition>
</template>

<style scoped>
.layout-container {
  /* background-image: url(/assets/app-background-images/main_1.png); */
  background-size: cover;
  background-position: center;
}

.scale-enter-active {
  animation: scale-in 0.5s;
  transform-origin: bottom left;
}
.scale-leave-active {
  animation: scale-in 0.5s reverse;
  transform-origin: bottom left;
}
@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.slide-x-enter-active {
  animation: slide-x-in 0.3s;
}
.slide-x-leave-active {
  animation: slide-x-in 0.2s reverse;
}
@keyframes slide-x-in {
  0% {
    transform: translateX(100%);
  }
  /* 50% {
    transform: translateX(-5%);
  } */
  100% {
    transform: translateX(0);
  }
}

.blur-enter-active {
  animation: blur-in 0.3s;
}
.blur-leave-active {
  animation: blur-in 0.2s reverse;
}
@keyframes blur-in {
  0% {
    opacity: 0;
    filter: blur(4rem);
  }
  100% {
    opacity: 1;
    filter: blur(0rem);
  }
}
</style>
