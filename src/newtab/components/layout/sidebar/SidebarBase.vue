<script setup lang="ts">
import { appIsEditCleanHome, appIsEditWallpaper } from '~/logic'

interface ISidebarBase {
  label: string
  icon: string
  status: Ref<boolean>
  isChecked: boolean
  remark?: any
  onClick: Function
}

/**
 * 这里几种状态都是互斥的
 * 举例：修改墙纸的时候，再点击自定义布局的话，需要将修改墙纸的状态取消
 */
const customSettings = ref<ISidebarBase[]>([
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
])
</script>

<template>
  <div class="w-full h-fit flex flex-col justify-center items-center gap-10px">
    <TooltipProvider>
      <Tooltip
        v-for="(item) in customSettings"
        :key="item.label"
      >
        <TooltipTrigger as-child>
          <div
            class="hover:bg-[#484E6490] w-32px h-32px bg-[transparent] rounded-6px grid place-items-center cursor-pointer group"
            :class="item.status ? 'bg-[#484E64]!' : ''"
            @click="() => item.onClick()"
          >
            <div class="group-hover-scale-120 transition-transform ease-in-out" v-html="item.icon" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{{ item.label }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<style scoped>

</style>
