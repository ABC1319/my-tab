<script setup lang="ts">
import type { ISidebarBase } from '~/typings/app'

/**
 * 这里几种状态都是互斥的
 * 举例：修改墙纸的时候，再点击自定义布局的话，需要将修改墙纸的状态取消
 */
defineProps<{
  baseCustomSettings: ISidebarBase[]
}>()
</script>

<template>
  <div class="w-full h-fit flex flex-col justify-center items-center gap-10px">
    <TooltipProvider>
      <Tooltip
        v-for="(item) in baseCustomSettings"
        :key="item.label"
      >
        <TooltipTrigger as-child>
          <div
            v-show="item.isChecked"
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
