<script setup lang="ts">
import type { ISearchEngine } from '~/typings/app'
import CustomModal from '~/components/CustomModal.vue'
import { searchEngine } from '~/params/searchEngine'
import { editSearchEngine, getSearchEngine } from '~/logic/searchEngineData'
import { broadcast } from '~/logic'
import { appSearchEngine } from '~/logic/storage'

const defaultSearchArr = ref<ISearchEngine[]>(searchEngine)

const customSearch = ref<ISearchEngine>({
  id: 0,
  webName: '自定义',
  url: '',
  index: 0,
  type: 0,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.36 14c.08-.66.14-1.32.14-2c0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2c0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2c0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2c0 .68.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>',
  remark: {},
})

async function getList() {
  const searchEngines = await getSearchEngine()
  if (searchEngines.length === 0)
    editSearchEngine(toRaw(customSearch.value))
  else
    customSearch.value = searchEngines[0]
}
async function handleEditCustomSearch(val: ISearchEngine) {
  editSearchEngine(toRaw(val)).then(() => {
    noticeSynchronize()
  })
}

const engineModalRef = ref<typeof import('~/components/CustomModal.vue').default | null>(null)
function open() {
  engineModalRef.value?.open()
  // 打开后查询信息
  getList()
}
function close() {
  // 关闭前，保存一下信息
  handleEditCustomSearch(customSearch.value)
  engineModalRef.value?.close()
}

function handleSelectEngine(item: ISearchEngine) {
  appSearchEngine.value = item
}

onMounted(() => {
  handleSynchronize()
})
function handleSynchronize() {
  broadcast.syncSearchEngine.listen(async (event: MessageEvent<any>) => {
    if (JSON.parse(event.data).cmd === 'syncSearchEngine') {
      // 同步
      getList()
    }
  })
}
function noticeSynchronize() {
  broadcast.syncSearchEngine.call()
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <CustomModal ref="engineModalRef">
    <div class=" max-w-66vw min-w-350px p-10px">
      <span class="mb-16px block select-none">点击选择搜索引擎</span>

      <!-- 固定的导航 -->
      <div class="modal-content-container grid grid-cols-2 gap-10px ">
        <div
          v-for="item in defaultSearchArr"
          :key="item.webName"
          class="
            w-full h-54px
            flex flex-row justify-start items-center gap-5px
            rounded-10px px-2
            cursor-pointer
            border border-solid border-[#484E64]
          "
          :class="appSearchEngine.webName === item.webName ? 'bg-[#484E6450]' : ''"
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
              {{ item.webName }}
            </div>
            <div class="text-12px truncate text-[#b7b4b4a6]">
              {{ item.url }}
            </div>
          </div>
          <div
            class="
              w-18px h-18px
              text-[#b7b4b4a6]
              hover:scale-110
              transition-transform ease-in-out
              flex flex-col justify-center items-center flex-shrink-0 flex-grow-0
            "
          >
            <svg v-if="appSearchEngine.webName === item.webName" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z" /></svg>
          </div>
        </div>
      </div>

      <!-- 自定义导航 -->
      <span class="my-16px block select-none">自定义搜索引擎地址</span>
      <div class="modal-content-container gap-10px ">
        <div
          class="
            w-full h-54px
            flex flex-row justify-start items-center gap-5px
            cursor-pointer
            rounded-10px px-2
            border border-solid border-[#484E64]
          "
          :class="appSearchEngine.webName === customSearch.webName ? 'bg-[#484E6450]' : ''"
          @click="handleSelectEngine(customSearch)"
        >
          <div
            class="
              w-28px h-28px text-blue-500 rounded-8px bg-white
              flex flex-col justify-center items-center flex-shrink-0 flex-grow-0
            "
            v-html="customSearch?.icon"
          />
          <div class="flex flex-col ml-6px flex-1 overflow-hidden">
            <input
              v-model="customSearch.url"
              type="text"
              class="
                text-12px
                border border-solid border-[#484E64]
                bg-[#484E6450]
                leading-30px
                rounded-6px
                px-6px
                text-14px
                outline-none
                focus:border-[#4e1fff]
              "
              @focusout="handleEditCustomSearch(customSearch)"
              @click.stop
            >
          </div>

          <div
            class="
              w-18px h-18px
              text-[#b7b4b4a6]
              cursor-pointer
              hover:scale-110
              transition-transform ease-in-out
              flex flex-col justify-center items-center flex-shrink-0 flex-grow-0
            "
          >
            <svg v-if="appSearchEngine.webName === customSearch.webName" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z" /></svg>
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
