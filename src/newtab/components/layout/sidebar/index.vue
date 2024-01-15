<script setup lang="ts">
import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import SidebarSetting from './SidebarSetting.vue'
import SidebarBase from './SidebarBase.vue'
import { appBaseCustomSettings, appHomeShowMode, appIsEditCleanHome, appIsEditWallpaper, broadcast, isShrinkSidebar } from '~/logic/storage'
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

// -----------------右键菜单 start-------------------------//
const contextMenuOptions = computed(() => {
  return ([
    { label: `隐藏`, key: 'hide' },
    { label: `编辑`, key: 'edit' },
    { label: `删除`, key: 'delete' },
  ])
})

function openContextmenuToEdit(item: WorkAreaParams, _e: MouseEvent) {
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
// -----------------右键菜单 end-------------------------//

// -----------------底部的基础设置 start-------------------------//
onMounted(() => {
  appBaseCustomSettings.value.forEach((item) => {
    switch (item.label) {
      case '更改墙纸':
        item.status = appIsEditWallpaper
        item.onClick = () => {
          appIsEditCleanHome.value = false

          appIsEditWallpaper.value = !appIsEditWallpaper.value
        }
        break
      case '自定义布局':
        item.status = appIsEditCleanHome
        item.onClick = () => {
          appIsEditWallpaper.value = false

          appIsEditCleanHome.value = !appIsEditCleanHome.value
        }
        break

      default:
        break
    }
  })
})
// -----------------底部的基础设置 end-------------------------//
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
      <div class="sidebar-item-box w-full flex-1 flex flex-col pb-10px">
        <!-- top -->
        <div class="w-full h-fit flex flex-col flex-shrink-0 justify-start items-center gap-10px">
          <ContextMenu>
            <ContextMenuTrigger>
              <TooltipProvider>
                <Tooltip
                  v-for="item in workAreas"
                  :key="item.id"
                >
                  <TooltipTrigger as-child>
                    <div
                      v-show="item.isChecked"
                      @contextmenu="e => openContextmenuToEdit(item, e)"
                    >
                      <div
                        :class="appHomeShowMode === item.id ? 'bg-[#5021FF]!' : ''"
                        class="w-32px h-32px hover:bg-[#484E6490] rounded-6px grid place-items-center cursor-pointer group "
                        @click="toggleAppHomeShowMode(item.id || 0)"
                      >
                        <div class="group-hover-scale-120 transition-transform ease-in-out w-5 h-5" v-html="item.icon" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{{ item.layoutName }}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </ContextMenuTrigger>

            <ContextMenuContent>
              <div class="px-2 text-12px h-20px ">
                {{ currentWorkAreaCfg.layoutName }}
              </div>
              <ContextMenuSeparator class="h-[1px] bg-[#bcbbc130] m-[5px]" />
              <ContextMenuItem
                v-for="item in contextMenuOptions"
                :key="item.label"
                class="gap-10px"
                @click="handleSelectContextMenu(item)"
              >
                <span>
                  {{ item.label }}
                </span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
        <div class="w-full flex-1" />
        <!-- bottom -->
        <SidebarBase />
      </div>

      <!-- 最下面的两个 -->
      <div
        class="w-full h-fit flex flex-col justify-start items-center flex-shrink-0 gap-10px pt-10px
          border-t-1px border-#83838450 "
      >
        <SidebarSetting
          :work-areas="workAreas"
          @get-work-areas-list="getWorkAreasList"
        />
      </div>

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
