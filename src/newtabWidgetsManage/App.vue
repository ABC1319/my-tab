<script setup lang="ts">
import ManageHeader from './components/ManageHeader.vue'
import ManageContent from './components/ManageContent.vue'
import ManageWidgets from './components/ManageWidgets.vue'
</script>

<template>
  <Suspense>
    <!-- 背景 -->
    <div class=" w-screen h-screen overflow-hidden bg-#101214 text-white p-6 box-border">
      <!-- title -->
      <!-- <div class="h-64px w-full bg-[#252836] text-18px leading-64px px-30px">
        管理我的小组件
      </div> -->

      <!-- content -->
      <div class="w-full h-full flex flex-row gap-20px ">
        <div
          class="
            h-100% flex-1 flex flex-col
            bg-[#252836] rounded-20px
            border-6 border-solid border-[#383e4f]
            overflow-hidden
          "
        >
          <ManageHeader current-type="1" search-text="1" />
          <ManageContent current-type="1" search-text="1" />
        </div>

        <ManageWidgets />
      </div>
    </div>
  </Suspense>
</template>
