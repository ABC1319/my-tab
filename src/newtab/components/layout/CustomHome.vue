<script setup lang="ts">
/**
 * 只是个盛放布局的容器
 */
import LayoutCanvas from '../ui/layout-canvas/index.vue'
</script>

<template>
  <div class=" relative flex-1 h-full flex flex-col justify-start items-center text-white overflow-hidden z-1">
    <LayoutCanvas />

    <ContextMenu>
      <ContextMenuTrigger class="absolute top-0 left-0 z-999999">
        Right click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    <ContextMenu>
      <ContextMenuTrigger class="absolute top-0 right-0 z-999999">
        Right click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    <ContextMenu>
      <ContextMenuTrigger class="absolute bottom-0 right-50 z-999999">
        Right click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    <ContextMenu>
      <ContextMenuTrigger class="absolute bottom-0 left-50 z-999999">
        Right click
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>
</template>

<style scoped>

</style>
