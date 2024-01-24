<script setup lang="ts">

</script>

<template>
  <div
    class="
      h-100% w-200px
      bg-[#252836] rounded-20px
      border-6 border-solid border-[#383e4f]
      overflow-hidden
      flex flex-col
      box-content
    "
  >
    <!-- title -->
    <div class="select-none w-full h-36px border-b border-dashed border-[#41434f] leading-36px px-4">
      我的组件
    </div>
    <div class="flex-1 overflow-auto w-full flex flex-col gap-10px items-center py-20px">
      <div
        v-for="item in 10"
        :key="item"
        class="w-180px h-160px bg-[#494e62] flex-shrink-0 rounded-10px"
        :draggable="true"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 3px;
  background-color: transparent;
  border-radius: 8px;
}
::-webkit-scrollbar-track-piece {
  width: 12px;
  background-color: transparent;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:vertical {
  width: 24px;
  height: 24px;
  background: #484e64;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 12px;
  height: 12px;
  background: #484e64;
  border-radius: 8px;
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-corner {
  display: none;
}
</style>
