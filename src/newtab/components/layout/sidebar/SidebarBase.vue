<script setup lang="ts">
const customSettings = ref<any>([
  {
    label: '更改墙纸',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="8" cy="9" r="2" /><path d="m9 17l6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2M8 21h8m-4-4v4" /></g></svg>',
    isChecked: true,
    remark: {},
  },
  {
    label: '自定义布局',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></g></svg>',
    isChecked: true,
    remark: {},
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
          <div class="hover:bg-[#484E64] w-32px h-32px bg-[transparent] rounded-6px grid place-items-center cursor-pointer group">
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
