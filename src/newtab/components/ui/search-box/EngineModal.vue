<script setup lang="ts">
import type { ISearchEngine } from '~/typings/app'
import CustomModal from '~/components/CustomModal.vue'
import { searchEngine } from '~/params/searchEngine'

defineProps<{
  currentSearchEngine: ISearchEngine
}>()

const emits = defineEmits(['update:currentSearchEngine'])

const searchConfig = ref(searchEngine)

const engineModalRef = ref<typeof import('~/components/CustomModal.vue').default | null>(null)
function open() {
  engineModalRef.value?.open()
}
function close() {
  engineModalRef.value?.close()
}

function handleSelectEngine(item: ISearchEngine) {
  emits('update:currentSearchEngine', item)
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <CustomModal ref="engineModalRef">
    <div class=" max-w-66vw min-w-350px p-10px">
      <span class="mb-16px block">选择搜索引擎</span>

      <!-- 固定的导航 -->
      <div class="modal-content-container grid grid-cols-2 gap-10px ">
        <div
          v-for="item in searchConfig.slice(0, 9)"
          :key="item.label"
          class="
            w-full h-54px
            flex flex-row justify-start items-center gap-5px
            cursor-pointer
            bg-[#484E64] rounded-10px px-2
            "
          @click="handleSelectEngine(item)"
        >
          <div
            class="
              w-28px h-28px text-blue-500 rounded-8px bg-white
              flex flex-col justify-center items-center flex-shrink-0 flex-grow-0
            "
            v-html="item.icon"
          />
          <div class="flex flex-col ml-6px flex-1 overflow-hidden">
            <div class="text-12px">
              {{ item.label }}
            </div>
            <div class="text-12px truncate text-[#b7b4b4a6]">
              {{ item.url }}
            </div>
          </div>
        </div>
      </div>

      <!-- 自定义导航 -->
      <span class="my-16px block">自定义搜索引擎</span>
      <div class="modal-content-container grid grid-cols-2 gap-10px ">
        <div
          v-for="item in searchConfig.slice(0, 9)"
          :key="item.label"
          class="
            w-full h-54px
            flex flex-row justify-start items-center gap-5px
            cursor-pointer
            bg-[#484E64] rounded-10px px-2
            "
          @click="handleSelectEngine(item)"
        >
          <div
            class="
              w-28px h-28px text-blue-500 rounded-8px bg-white
              flex flex-col justify-center items-center flex-shrink-0 flex-grow-0
            "
            v-html="item.icon"
          />
          <div class="flex flex-col ml-6px flex-1 overflow-hidden">
            <div class="text-12px">
              {{ item.label }}
            </div>
            <div class="text-12px truncate text-[#b7b4b4a6]">
              {{ item.url }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </CustomModal>
</template>

<style scoped>
@media screen and (max-width: 710px) {
  .modal-content-container {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
