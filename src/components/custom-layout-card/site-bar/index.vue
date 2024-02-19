<script setup lang="ts">
import AddOrEditSiteModal from './AddOrEditSiteModal.vue'
import { broadcast } from '~/logic'
import { deletePinedWebsite, editPinedWebsite, getPinedWebsite } from '~/logic/websiteData'
import type { WebsiteParams } from '~/typings/website'

const websites = ref<WebsiteParams[]>([
])

onMounted(() => {
  handleSynchronize()
})

// 拖拽绑定的数据
const flatContents = ref(websites.value.map(item => `website-id-${item.id}`))
// 监听拖拽的顺序改变
watch(flatContents, (newVal) => {
  const sorts = newVal.map((item) => {
    return item.match(/website-id-(\d+)/)?.[1]
  }).filter(item => item)

  websites.value.forEach((item) => {
    const index = sorts.indexOf(`${item.id}`)
    item.index = index + 1
  })
  websites.value.forEach((item) => {
    editPinedWebsite({
      id: item.id,
      url: item.url,
      webName: item.webName,
      index: item.index,
      icon: item.icon,
      type: item.type,
      remark: {
        defaultIcon: '',
        color: item?.remark?.color,
      },
    })
  })
  // 2.说明拖拽结束，通知一下同步
  noticeSynchronize()
})

// 数据库中的顺序
await getList()
async function getList() {
  const webs = await getPinedWebsite()

  webs.sort((a: any, b: any) => {
    return Number(a.index) - Number(b.index)
  })

  websites.value = [...webs]

  // 渲染 Icon
  websites.value.forEach((item: WebsiteParams) => {
    if (item.icon && item.icon instanceof Blob) {
      renderBlobUrlIcon(item.icon).then((res) => {
        // eslint-disable-next-line dot-notation
        item!['remark']!['renderIcon'] = res
      })
    }
  })

  // 跟拖拽绑定
  flatContents.value = websites.value.map(item => `website-id-${item.id}`)
}

function renderBlobUrlIcon(file: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      const iconUrl = URL.createObjectURL(file)
      resolve(
        `
          <img
            class="w-full h-full object-cover pointer-events-none select-none"
            src="${iconUrl}"
            alt="自定义图标"
          >
        `,
      )
    }
  })
}

function handleSynchronize() {
  broadcast.syncWebsites.listen(async (event: MessageEvent<any>) => {
    if (JSON.parse(event.data).cmd === 'SyncWebsites')
      await getList()
  })
}
function noticeSynchronize() {
  broadcast.syncWebsites.call()
}

/** ************************* 右键菜单 */
const addOrEditSiteModalRef = ref<typeof import('./AddOrEditSiteModal.vue').default | null>(null)
function handleSelectContextMenu(operation: 'delete' | 'edit', item: WebsiteParams) {
  if (operation === 'delete') {
    if (item.id) {
      deletePinedWebsite(item.id)
        .then(async () => {
          await getList()
          nextTick(() => {
            noticeSynchronize()
          })
        })
    }
  }
  else if (operation === 'edit') {
    if (addOrEditSiteModalRef.value) {
      addOrEditSiteModalRef.value.currentSiteCfg = item
      addOrEditSiteModalRef.value.isOpen = true
    }
  }
}
/** ************************* 右键菜单 */
</script>

<template>
  <ResizeCard :max-width="650" class="bg-transparent h-fit!">
    <ResizeCardContent>
      <FlatSortable>
        <FlatSortableContent v-model="flatContents" direction="row" :gap="10" class="flex-wrap">
          <FlatSortableItem
            v-for="(item, index) in websites"
            :key="index"
          >
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  class="site-bar-sort-item w-144px h-88px flex flex-col justify-center items-center gap-5px flex-shrink-0 flex-grow-0 cursor-pointer overflow-hidden rounded-10px text-center "
                >
                  <div
                    v-if="item.icon && item?.remark?.renderIcon"
                    class="w-10 h-10 grid place-items-center"
                    v-html="item.remark.renderIcon"
                  />
                  <div
                    v-else
                    class="alpha-icon w-10 h-10 grid place-items-center text-18px"
                    :style="{ background: item?.remark?.color || 'transparent' }"
                  >
                    {{ item?.remark && item?.remark?.defaultIcon }}
                  </div>

                  <div class="w-full select-none">
                    {{ item.webName }}
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem class="gap-10px" @click="handleSelectContextMenu('edit', item)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" /></g></svg>
                  <span>
                    编辑
                  </span>
                </ContextMenuItem>

                <ContextMenuSeparator class="h-[1px] bg-[#bcbbc130] m-[5px]" />

                <ContextMenuItem class="gap-10px hover:bg-#d45453!" @click="handleSelectContextMenu('delete', item)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></svg>
                  <span>
                    删除
                  </span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </FlatSortableItem>

          <!-- 添加地址 -->
          <AddOrEditSiteModal
            ref="addOrEditSiteModalRef"
            :websites="websites"
            @handlehandle-completed="getList()"
          />
        </FlatSortableContent>
      </FlatSortable>
    </ResizeCardContent>
  </ResizeCard>
</template>

<style scoped>
.site-bar-sort-item {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  clip-path: path(
    'M 0 44 C 0 0.9849735503722608 0.9849735503722608 0 44 0 L 100 0 C 143.01502644962773 0 144 0.9849735503722608 144 44 L 144 44 C 144 87.01502644962774 143.01502644962773 88 100 88 L 44 88 C 0.9849735503722608 88 0 87.01502644962774 0 44 z'
  );
}
</style>
