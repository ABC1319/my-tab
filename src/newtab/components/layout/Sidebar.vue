<script setup lang="ts">
import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import SidebarSetting from '../ui/SidebarSetting.vue'
import { appHomeShowMode, broadcast, isShrinkSidebar } from '~/logic/storage'
import type { WorkAreaParams } from '~/typings/website'
import { deleteWorkArea, editWorkArea, getWorkArea } from '~/logic/workAreaData'
import { workAreaIcon } from '~/params/workAreaIcon'

// 1. 查询有多少个布局 存在了 indexDB
// 2. 查询当前是第几个布局 存在了 localStorage

// ------------------------------------------------------------------------------------//
const currentWorkAreaCfg = ref<WorkAreaParams>({
  layoutName: '',
  icon: '',
  index: -1,
  isChecked: true,
  remark: {},
})
const workAreas = ref<WorkAreaParams[]>([])

await getWorkAreasList()
async function getWorkAreasList() {
  const areas = await getWorkArea()

  if (areas.length === 0) {
    const defaultLayout = {
      id: 0,
      layoutName: '默认布局',
      index: 0,
      icon: workAreaIcon.find(res => res.name === 'tabler-category-filled')?.icon || '',
      isChecked: true,
      remark: {},
    }
    editWorkArea(defaultLayout).then(() => {
      currentWorkAreaCfg.value = defaultLayout
    })

    workAreas.value = [defaultLayout]
  }
  else if (areas.length === 1 && areas[0].isChecked === false) {
    areas[0].isChecked = true
    workAreas.value = [...areas]
  }
  else {
    areas.sort((a: any, b: any) => {
      return Number(a.index) - Number(b.index)
    })

    workAreas.value = [...areas]

    // 判断当前应用的布局是否隐藏或者删除
    const checkedAreas = workAreas.value.filter(res => res.isChecked)
    if (!JSON.stringify(checkedAreas).includes(`${appHomeShowMode.value}`))
      appHomeShowMode.value = checkedAreas[0] ? checkedAreas[0].id! : workAreas.value[0].id!
  }
}
// ------------------------------------------------------------------------------------//

const shrinkBtnRef = ref<HTMLElement | null>(null)
const isHideBtn = ref(true) // 这个变量纯纯的是为了让按钮隐藏的时候延迟几秒

function toggleShrink() {
  if (!shrinkBtnRef.value)
    return

  const rotate = ['rotate(0)', 'rotate(180deg)']
  const animation = shrinkBtnRef.value.animate(
    { transform: isShrinkSidebar.value ? [...rotate].reverse() : rotate },
    { duration: 300, fill: 'forwards' },
  )
  animation.onfinish = () => {
    isShrinkSidebar.value = !isShrinkSidebar.value

    if (isShrinkSidebar.value) {
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

// -----------------显示模式-------------------------//
const toggleAppHomeShowMode = useThrottleFn ((item: number) => {
  appHomeShowMode.value = item
}, 400)

// -----------------右键菜单-------------------------//
const operateMenuRef = ref<typeof import('~/components/CustomContextMenu.vue').default | null>(null)
const contextMenuOptions = computed(() => {
  return ([
    { label: `${currentWorkAreaCfg.value.layoutName}`, key: 'hide', disabled: true },
    { label: 'Divider', key: 'Divider' },
    { label: `隐藏`, key: 'hide' },
    { label: `编辑`, key: 'edit' },
    { label: `删除`, key: 'delete' },
  ])
})
const contextMenuPosition = ref({ x: 0, y: 0 })
function openContextmenuToEdit(item: WorkAreaParams, e: MouseEvent) {
  e.preventDefault()

  contextMenuPosition.value = {
    x: e.clientX + 20,
    y: e.clientY + 5,
  }
  operateMenuRef.value?.open()

  currentWorkAreaCfg.value = { ...item }
}

function handleSelectContextMenu(item: typeof contextMenuOptions.value[number]) {
  switch (item.key) {
    case 'edit':
      edit()
      break
    case 'delete':
      del()
      break
    case 'hide':
      hide()
      break

    default:
      break
  }

  function hide() {
    const { id, layoutName, index, icon } = currentWorkAreaCfg.value

    const isCheckedAreas = workAreas.value.filter(item => item.isChecked === true)
    if (isCheckedAreas.length > 1) {
      editWorkArea({
        id,
        layoutName,
        index,
        icon,
        isChecked: false,
        remark: {},
      }).then(async () => {
        getWorkAreasList()
      })
    }
    else {
      // eslint-disable-next-line no-alert
      alert('请至少显示一个工作区')
      getWorkAreasList()
    }
  }

  function del() {
    if (workAreas.value.length === 1) {
      // eslint-disable-next-line no-alert
      alert('最后一个工作区不能删除')
    }
    else {
      deleteWorkArea(currentWorkAreaCfg.value.id!)
        .then(async () => {
          getWorkAreasList()
        })
    }
  }

  function edit() {
  }
}
</script>

<template>
  <div
    :style="{
      width: isShrinkSidebar ? '0px' : '48px',
      marginLeft: isShrinkSidebar ? '0px' : '5px',
      marginRight: isShrinkSidebar ? '0px' : '5px',
      transform: isShrinkSidebar ? 'translateX(-24px)' : 'unset',
      transitionProperty: 'transform,width',
    }"
    class="sidebar-container h-[calc(100vh_-_10px)] my-auto text-white duration-300 ease-in-out relative flex-shrink-0"
  >
    <div class="w-full h-full bg-[#252835] rounded-10px py-10px flex flex-col flex-shrink-0">
      <div class="sidebar-item-box w-full flex-1">
        <!-- top -->
        <div class="w-full h-fit flex flex-col flex-shrink-0 justify-start items-center ">
          <div
            v-for="item in workAreas"
            :key="item.id"
          >
            <div
              v-if="item.isChecked"
              :title="item.layoutName"
              @contextmenu="e => openContextmenuToEdit(item, e)"
            >
              <div
                :class="appHomeShowMode === item.id ? 'bg-[#5021FF]!' : ''"
                class="w-32px h-32px hover:bg-[#484E64] rounded-6px grid place-items-center cursor-pointer [&>*:hover]:scale-120 mb-10px"
                @click="toggleAppHomeShowMode(item.id || 0)"
              >
                <div class="transition-transform ease-in-out w-5 h-5" v-html="item.icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- middle -->
        <div class="w-full h-fit flex flex-col justify-center items-center gap-10px">
        <!-- <div
          class="w-32px h-32px bg-[#484E64] rounded-6px grid place-items-center cursor-pointer [&>*:hover]:scale-120"
        >
          <svg class="transition-transform ease-in-out" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path fill="currentColor" d="M35.288 7.445a4.82 4.82 0 0 1 6.894 6.735l-8.01 8.392a3.75 3.75 0 0 1-1.87 1.065l-5.77 1.331a1.25 1.25 0 0 1-1.517-1.408l.875-5.69a3.75 3.75 0 0 1 1.055-2.082l8.343-8.343Zm5.337 2.121a2.32 2.32 0 0 0-3.57-.353l-8.342 8.342a1.25 1.25 0 0 0-.352.694l-.595 3.869l3.974-.917a1.25 1.25 0 0 0 .623-.355l8.01-8.392a2.32 2.32 0 0 0 .252-2.888Zm-11.928.934H10.25a3.75 3.75 0 0 0-3.75 3.75v4.932c1.01-.747 2.106-1.514 3.208-2.164c1.342-.792 2.796-1.475 4.186-1.687c1.445-.22 2.946.062 4.055 1.356c.523.61.827 1.285.922 2.005c.093.704-.024 1.376-.225 1.982c-.36 1.086-1.073 2.168-1.672 3.078l-.12.181c-.682 1.039-1.196 1.866-1.392 2.603c-.09.34-.095.603-.043.821c.049.21.17.464.465.76c.403.402.758.545 1.06.584c.32.042.699-.018 1.15-.212c.943-.405 1.908-1.259 2.772-2.123a1.25 1.25 0 1 1 1.768 1.768c-.869.87-2.128 2.04-3.553 2.652c-.732.314-1.572.51-2.462.394c-.909-.119-1.756-.549-2.503-1.296c-.581-.582-.963-1.236-1.131-1.957c-.167-.712-.106-1.403.061-2.033c.32-1.2 1.087-2.373 1.719-3.334l.035-.053c.676-1.028 1.22-1.857 1.473-2.62c.12-.363.149-.643.12-.868c-.028-.21-.114-.44-.342-.705c-.391-.457-.921-.643-1.78-.512c-.915.14-2.04.63-3.292 1.368c-1.233.728-2.492 1.639-3.667 2.527c-.273.206-.545.414-.812.619V33.75a3.75 3.75 0 0 0 3.75 3.75h27.5a3.75 3.75 0 0 0 3.75-3.75V18.515l2.5-2.62V33.75A6.25 6.25 0 0 1 37.75 40h-27.5A6.25 6.25 0 0 1 4 33.75v-19.5A6.25 6.25 0 0 1 10.25 8h20.947l-2.5 2.5Z" />
          </svg>
        </div> -->
        </div>
      </div>

      <!-- bottom -->
      <div
        class="w-full h-fit flex flex-col justify-start items-center flex-shrink-0 gap-10px pt-10px
          border-t-1px border-#83838450 "
      >
        <!-- <div class="tooltip tooltip-right before:text-12px before:ml-10px before:bg-[#252835]" data-tip="侧边栏设置"> -->
        <SidebarSetting
          :work-areas="workAreas"
          @get-work-areas-list="getWorkAreasList"
        />
        <!-- </div> -->
      </div>

      <!-- base -->
      <div
        ref="shrinkBtnRef"
        class="
          w-fit h-fit mx-auto
          flex flex-col justify-start items-center
          origin-[100%_50%]
          ease-linear transition-opacity duration-300
          pt-10px
        "
        :style="{
          transform: isShrinkSidebar ? 'rotate(180deg)' : 'rotate(0deg)',
        }"
        :class="
          isShrinkSidebar
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

    <CustomContextMenu
      ref="operateMenuRef"
      :x="contextMenuPosition.x"
      :y="contextMenuPosition.y"
      :options="contextMenuOptions"
      @select="handleSelectContextMenu"
    />
  </div>
</template>

<style scoped>
.sidebar-item-box {
  overflow-y: auto;
  -ms-overflow-y-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
