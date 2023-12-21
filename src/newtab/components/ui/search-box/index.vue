<script setup lang="ts">
import { ref } from 'vue'
import EngineModal from './EngineModal.vue'
import { searchEngine } from '~/params/searchEngine'

const searchConfig = ref(searchEngine)

const currentSearchEngine = ref(searchConfig.value[0])

const searchText = ref('')

/**
 * 1. 触发搜索
 * @param e
 */
function handleSearch(e: KeyboardEvent) {
  if (!e.isComposing) {
    setTimeout(() => {
      window.open(`${currentSearchEngine.value.url}${searchText.value}`)
    })
  }
}

/**
 * 2. 清除输入框文字
 */
function clearSearchText() {
  searchText.value = ''
}

/**
 * 3. 切换搜索引擎
 */
const engineModalRef = ref<typeof import('./EngineModal.vue').default | null>(null)
function isOpenSearchEngineList() {
  engineModalRef.value?.open()
}
</script>

<template>
  <div class="flex-shrink-0 mt-88px mb-48px w-full h-[56px] flex flex-col justify-center items-center pointer-events-none relative">
    <section
      class="w-[676px] max-w-[66vw] pointer-events-auto h-full"
      style="
        transition-property: top;
        transition-duration: 200ms;
        border-radius: 12px;
      "
    >
      <div
        class="search-box overflow-hidden w-full h-full flex items-center rounded-[30px] transition-colors duration-100 focus-within:bg-opacity-80 dark:focus-within:bg-opacity-70 "
      >
        <!-- icon -->
        <div
          class="search-icon cursor-pointer flex h-full w-[48px] items-center justify-center"
          @click="isOpenSearchEngineList"
        >
          <div class="pointer-events-none flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[8px] bg-opacity-80 hover:bg-color-white hover:bg-opacity-80">
            <section class=" flex items-center justify-center overflow-hidden bg-cover h-[24px] w-[24px] rounded-[6px] bg-transparent">
              <div class="text-blue-500 " v-html="currentSearchEngine.icon" />
            </section>
          </div>
        </div>

        <!-- 输入框 -->
        <input
          v-model="searchText"
          class="
            h-full text-16px
            text-gray-900 placeholder:text-gray-400 bg-[transparent]
            py-[12px] pl-1 pr-[42px]
            outline-none grow
            placeholder-select-none
          "
          placeholder="输入搜索内容" autocomplete="off" @keydown.enter="handleSearch"
        >

        <!-- 清除 icon -->
        <div class="absolute top-0 right-0 flex h-full w-[48px] items-center justify-center text-[#252835]">
          <button v-show="searchText" tabindex="-1" type="button" class="h-[32px] w-[32px]" @click="clearSearchText">
            <div i-ooui:clear />
          </button>
        </div>
      </div>
    </section>

    <!-- 搜索引擎 ，最多 9 个 -->
    <EngineModal
      ref="engineModalRef"
      v-model:current-search-engine="currentSearchEngine"
    />
  </div>
</template>

<style scoped>
.search-box {
  background-color: #f5f7f8;
  backdrop-filter: blur(40px);
  border: 1px solid #ffffff1a;
  box-shadow: 0 4px 16px 0 #0000001a;
}

.search-engine {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(40px);
}

.search-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(80px);
}

.tag-box {
  border: 2px solid white;
  background: #d6dbf9;
  box-shadow:
    20px 20px 60px #d5d4d4,
    -20px -20px 60px #ffffff;
}

.btn-box {
  box-shadow:
    20px 20px 60px #d5d4d4,
    -20px -20px 60px #ffffff;
}

.change-engine {
  animation: riseAnimation 0.3s both;
}
@keyframes riseAnimation {
  0% {
    opacity: 0;
    transform: translateY(50%);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
</style>
