<script setup lang="ts">
import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import SidebarSetting from './SidebarSetting.vue'
import SidebarBase from './SidebarBase.vue'
import { appHomeShowMode, appIsEditCleanHome, appIsEditWallpaper, broadcast, isShrinkSidebar } from '~/logic/storage'
import type { WorkAreaParams } from '~/typings/website'
import { deleteWorkArea, editWorkArea, getWorkArea } from '~/logic/workAreaData'
import { workAreaIcon } from '~/params/workAreaIcon'
import type { ISidebarBase } from '~/typings/app'

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
// -----------------右键菜单 end-------------------------//

// -----------------底部的基础设置 start-------------------------//
const baseCustomSettings = ref([
  {
    label: '更改墙纸',
    status: appIsEditWallpaper,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="8" cy="9" r="2" /><path d="m9 17l6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2M8 21h8m-4-4v4" /></g></svg>',
    isChecked: true,
    remark: {},
    onClick() {
      appIsEditCleanHome.value = false

      appIsEditWallpaper.value = !appIsEditWallpaper.value
    },
  },
  {
    label: '自定义布局',
    status: appIsEditCleanHome,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M11.943 1.25H13.5a.75.75 0 0 1 0 1.5H12c-2.378 0-4.086.002-5.386.176c-1.279.172-2.05.5-2.62 1.069c-.569.57-.896 1.34-1.068 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386v-1.5a.75.75 0 0 1 1.5 0v1.557c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m4.827 1.026a3.503 3.503 0 0 1 4.954 4.953l-6.648 6.649c-.371.37-.604.604-.863.806a5.34 5.34 0 0 1-.987.61c-.297.141-.61.245-1.107.411l-2.905.968a1.492 1.492 0 0 1-1.887-1.887l.968-2.905c.166-.498.27-.81.411-1.107c.167-.35.372-.68.61-.987c.202-.26.435-.492.806-.863zm3.893 1.06a2.003 2.003 0 0 0-2.832 0l-.376.377c.022.096.054.21.098.338c.143.413.415.957.927 1.469a3.875 3.875 0 0 0 1.807 1.025l.376-.376a2.003 2.003 0 0 0 0-2.832m-1.558 4.391a5.397 5.397 0 0 1-1.686-1.146a5.395 5.395 0 0 1-1.146-1.686L11.218 9.95c-.417.417-.58.582-.72.76a3.84 3.84 0 0 0-.437.71c-.098.203-.172.423-.359.982l-.431 1.295l1.032 1.033l1.295-.432c.56-.187.779-.261.983-.358c.251-.12.49-.267.71-.439c.177-.139.342-.302.759-.718z" clip-rule="evenodd" />
          </svg>`,
    isChecked: true,
    remark: {},
    onClick() {
      appIsEditWallpaper.value = false

      appIsEditCleanHome.value = !appIsEditCleanHome.value
    },
  },
]) as unknown as Ref<ISidebarBase[]>
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
        </div>
        <div class="w-full flex-1" />
        <!-- bottom -->
        <SidebarBase
          :base-custom-settings="baseCustomSettings"
        />
      </div>

      <!-- 最下面的两个 -->
      <div
        class="w-full h-fit flex flex-col justify-start items-center flex-shrink-0 gap-10px pt-10px
          border-t-1px border-#83838450 "
      >
        <SidebarSetting
          :work-areas="workAreas"
          :base-custom-settings="baseCustomSettings"
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
