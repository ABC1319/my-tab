<script setup lang="ts">
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { initGridContainer } from './draggable'
import CustomLayoutComponentsList from './CustomLayoutComponentsList.vue'
import { appHomeShowMode, appIsEditCleanHome } from '~/logic/storage'
import { getAllCustomLayoutComponentsRaw } from '~/utils/layout-components'
import type { ILayoutComponentTypeInData, ILayoutComponentTypeInPage } from '~/typings/layout'
import { deleteLayoutComponents, editLayoutComponents, getComponentsById } from '~/logic/layoutComponentsData'

const customLayoutAllComponents = await getAllCustomLayoutComponentsRaw()

const bentoCells = ref<ILayoutComponentTypeInPage[]>([])
const layoutContainerRef = ref()
const currentClickedElement: Ref<any> = ref()
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
})

const intervalID = setInterval(() => {
  if (appIsEditCleanHome.value)
    handleOnlySaveLayout()
}, 1000 * 30)
onUnmounted(() => {
  clearInterval(intervalID && intervalID)
})
// ------------------保存 end -------------------------//

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
          componentName: item.componentName,
          component: markRaw(component.raw.default),
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

/**
 * 切换当前编辑模式
 * @param boo 是否是编辑模式
 */
function handleSwitchCleanHomeMode(boo: boolean) {
  appIsEditCleanHome.value = boo

  if (appIsEditCleanHome.value) {
    // 说明进入了编辑模式
    disabledDraggable.value = false
  }
  else {
    // 说明退出了编辑模式
    disabledDraggable.value = true
  }
}

function calculateMainScale() {
  // 距离间隔
  const g = 80
  // 获取初始页面的宽度
  const ow = layoutContainerRef.value.offsetWidth
  // 获取抽屉的宽度
  const w = 200
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
      componentName: component.name,
      component: markRaw(component.raw.default),
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
        componentName: item.componentName,
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
        componentName: item.componentName,
      }).then(resolve)
    })
  })

  Promise.all(promises).then(() => {})
}

function handleCancelLayout() {
  handleSwitchCleanHomeMode(false)
}
// ------------------保存 end -----------------------------//

// ------------------修改组件 end -----------------------------//
// function hideComponent(_item: ILayoutComponentTypeInPage) {

// }
function deleteComponent(item: ILayoutComponentTypeInPage) {
  const index = bentoCells.value.findIndex(cell => cell.id === item.id)
  if (index > -1) {
    bentoCells.value.splice(index, 1)
    deleteLayoutComponents(item.id!)
  }
}
// ------------------修改组件 end -----------------------------//
</script>

<template>
  <div
    ref="layoutContainerRef"
    class="
      layout-container
      w-full h-full
      absolute top-0 left-0 overflow-hidden z-50
      transition-all duration-300 ease-in-out
      outline-10px outline-solid outline-[#474d63]
      origin-[10%_50%]
    "
    :class="appIsEditCleanHome ? 'rounded-[10px]' : ''"
    :style="{
      transform: appIsEditCleanHome ? `scale(${layoutContainerScale})` : '',
    }"
    @drop="handleDrop"
    @dragover="handleDragover"
  >
    <div
      v-for="item in bentoCells"
      :key="item.id"
      :style="{
        position: 'absolute',
        transform: `
          translate3d(
            ${item.x}px,
            ${item.y}px,
          0)`,
        willChange: 'transform',
      }"
    >
      <component
        :is="item.component"
        :id="`layout-component-${item.id}`"
        class="w-fit h-fit"
      />

      <div
        v-if="appIsEditCleanHome"
        class="
          absolute top-[-34px] left-0
          cursor-pointer
          flex flex-row justify-center items-center
          rounded-10px
          bg-[#474d63]
          w-fit h-30px overflow-hidden
        "
      >
        <!-- <div
          class=" w-1/2 h-full flex justify-center items-center px-8px hover:bg-#646c89 "
          title="隐藏"
          @click="hideComponent(item)"
        >
          <svg class="w-20px h-20px " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673A8.717 8.717 0 0 1 12 18c-3.6 0-6.6-2-9-6c1.272-2.12 2.712-3.678 4.32-4.674m2.86-1.146A9.055 9.055 0 0 1 12 6c3.6 0 6.6 2 9 6c-.666 1.11-1.379 2.067-2.138 2.87M3 3l18 18" /></g></svg>
        </div> -->

        <div
          class=" w-full h-full flex justify-center items-center px-8px hover:bg-#646c89 "
          title="删除"
          @click="deleteComponent(item)"
        >
          <svg class="w-20px h-20px " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" /></svg>
        </div>
      </div>
    </div>

    <!-- 编辑模式 -->
    <Teleport to="body">
      <button
        title="编辑模式"
        draggable="false"
        class="
          fixed bottom-2 right-50px z-99
          h-32px w-32px p-0 min-w-32px
          rounded-full bg-[#25283590]
          grid place-items-center
          cursor-pointer
          text-[#ffffff90]
        "
        @click="handleSwitchCleanHomeMode(!appIsEditCleanHome)"
      >
        <svg class="w-14px h-14px rounded-full hover:scale-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" fill-rule="evenodd" d="M11.943 1.25H13.5a.75.75 0 0 1 0 1.5H12c-2.378 0-4.086.002-5.386.176c-1.279.172-2.05.5-2.62 1.069c-.569.57-.896 1.34-1.068 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386v-1.5a.75.75 0 0 1 1.5 0v1.557c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m4.827 1.026a3.503 3.503 0 0 1 4.954 4.953l-6.648 6.649c-.371.37-.604.604-.863.806a5.34 5.34 0 0 1-.987.61c-.297.141-.61.245-1.107.411l-2.905.968a1.492 1.492 0 0 1-1.887-1.887l.968-2.905c.166-.498.27-.81.411-1.107c.167-.35.372-.68.61-.987c.202-.26.435-.492.806-.863zm3.893 1.06a2.003 2.003 0 0 0-2.832 0l-.376.377c.022.096.054.21.098.338c.143.413.415.957.927 1.469a3.875 3.875 0 0 0 1.807 1.025l.376-.376a2.003 2.003 0 0 0 0-2.832m-1.558 4.391a5.397 5.397 0 0 1-1.686-1.146a5.395 5.395 0 0 1-1.146-1.686L11.218 9.95c-.417.417-.58.582-.72.76a3.84 3.84 0 0 0-.437.71c-.098.203-.172.423-.359.982l-.431 1.295l1.032 1.033l1.295-.432c.56-.187.779-.261.983-.358c.251-.12.49-.267.71-.439c.177-.139.342-.302.759-.718z" clip-rule="evenodd" />
        </svg>
      </button>
    </Teleport>

    <!-- 缩略图 -->
    <Transition
      name="scale"
      @after-leave="$emit('destroy')"
    >
      <div v-if="false" class="absolute bottom-5px left-0 w-172px h-140px bg-[#252835] rounded-10px p-10px ">
        <div class="w-full h-full bg-[#484e64] grid place-items-center rounded-5px cursor-default">
          缩略图
        </div>
      </div>
    </Transition>
  </div>

  <!-- 右侧布局组件列表 -->
  <Transition
    name="slide-x"
    @after-leave="$emit('destroy')"
  >
    <CustomLayoutComponentsList
      v-if="appIsEditCleanHome"
      @save="handleSaveLayoutAndClose"
      @cancel="handleCancelLayout"
    />
  </Transition>
</template>

<style scoped>
.layout-container {
  background-image: url(/assets/main_resource.png);
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
</style>
