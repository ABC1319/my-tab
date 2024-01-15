<script setup lang="ts">
const contextMenuPosition = ref({ x: 8, y: 50 })
const contextMenuRef = ref<typeof import('~/components/CustomPopper.vue').default | null>(null)
const contextMenuOptions = [

  {
    icon: '',
    label: '键盘快捷方式',
    key: 'Shortcuts',
  },
  {
    icon: '',
    label: 'Divider',
    key: 'Divider',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>',
    label: 'GitHub',
    key: 'GitHub',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23"/></svg>',
    label: 'Twitter',
    key: 'Twitter',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M7.5 22q-1.45 0-2.475-1.025T4 18.5v-13q0-1.45 1.025-2.475T7.5 2H20v15q-.625 0-1.062.438T18.5 18.5q0 .625.438 1.063T20 20v2zM6 15.325q.35-.175.725-.25T7.5 15H8V4h-.5q-.625 0-1.062.438T6 5.5zM10 15h8V4h-8zm-4 .325V4zM7.5 20h9.325q-.15-.35-.237-.712T16.5 18.5q0-.4.075-.775t.25-.725H7.5q-.65 0-1.075.438T6 18.5q0 .65.425 1.075T7.5 20"/></svg>',
    label: '小红书',
    key: 'XiaoHongShu',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48"><path fill="currentColor" d="M31.605 6.838a1.25 1.25 0 0 0-2.105.912v5.472c-.358.008-.775.03-1.24.072c-1.535.142-3.616.526-5.776 1.505c-4.402 1.995-8.926 6.374-9.976 15.56a1.25 1.25 0 0 0 2.073 1.075c4.335-3.854 8.397-5.513 11.336-6.219a17.713 17.713 0 0 1 3.486-.497l.097-.003v5.535a1.25 1.25 0 0 0 2.105.912l12-11.25a1.25 1.25 0 0 0 0-1.824zm-.999 8.904l.02.002h.002h-.001A1.25 1.25 0 0 0 32 14.5v-3.865L40.922 19L32 27.365V23.5c0-.63-.454-1.16-1.095-1.24h-.003l-.004-.001l-.01-.001l-.028-.003a8.425 8.425 0 0 0-.41-.03a13.505 13.505 0 0 0-1.134-.006c-.966.034-2.33.17-3.983.566c-2.68.643-6.099 1.971-9.778 4.653c1.486-6.08 4.863-8.958 7.96-10.362c1.841-.834 3.635-1.168 4.975-1.292c.668-.062 1.216-.07 1.591-.064a9.837 9.837 0 0 1 .525.022M12.25 8A6.25 6.25 0 0 0 6 14.25v21.5A6.25 6.25 0 0 0 12.25 42h21.5A6.25 6.25 0 0 0 40 35.75V33.5a1.25 1.25 0 0 0-2.5 0v2.25a3.75 3.75 0 0 1-3.75 3.75h-21.5a3.75 3.75 0 0 1-3.75-3.75v-21.5a3.75 3.75 0 0 1 3.75-3.75h8.25a1.25 1.25 0 1 0 0-2.5z"/></svg>',
    label: '关于',
    key: 'About',
  },
]
function openContextmenu(e: MouseEvent) {
  e.preventDefault()

  contextMenuRef.value?.visible
    ? contextMenuRef.value?.close()
    : contextMenuRef.value?.open()
}

function handleSelectContextMenu(e: typeof contextMenuOptions[number]) {
  switch (e.key) {
    case 'addWidgets':
      addWidgets()
      break

    default:
      break
  }
}

function addWidgets() {
  // eslint-disable-next-line no-console
  console.log(contextMenuPosition.value)
}
</script>

<template>
  <div>
    <button
      title="帮助和资源"
      draggable="false"
      class="
        fixed bottom-2 right-2 z-99
        h-32px w-32px p-0 min-w-32px
        rounded-full bg-[#25283590]
        grid place-items-center
        cursor-pointer
        text-[#ffffff90]
        opacity-0
        transition-all duration-300
        hover:opacity-100
      "
      :class="contextMenuRef?.visible ? 'opacity-100!' : ''"
      @click="openContextmenu"
    >
      <svg class="w-26px h-26px rounded-full hover:bg-[#25283590]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M260.3 366c-9.4 0-17-7.5-17-16.9 0-9.3 7.6-16.8 17-16.8s17 7.5 17 16.8c0 9.4-7.6 16.9-17 16.9zm33.8-115.3c-22.8 22.5-22.2 27.4-23.3 53.3h-19c1.1-28.5 7.5-43.7 30.1-64.5 11-10.3 19.4-22.7 19.4-38.1 0-23.6-19.4-39.9-42.6-39.9-32.4 0-48.5 16.4-47.9 46.4H192c.3-42 24.4-62.1 67.6-62.1 33 0 60.4 20.4 60.4 54.6 0 21.9-10.7 36.2-25.9 50.3z" fill="currentColor" />
      </svg>
    </button>

    <CustomPopper
      ref="contextMenuRef"
      :x="contextMenuPosition.x"
      :y="contextMenuPosition.y"
      :options="contextMenuOptions"
      @select="handleSelectContextMenu"
    />
  </div>
</template>

<style scoped>

</style>
