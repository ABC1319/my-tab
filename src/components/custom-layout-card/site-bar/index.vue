<script setup lang="ts">
import { broadcast } from '~/logic'
import { editPinedWebsite, getPinedWebsite } from '~/logic/websiteData'
import type { WebsiteParams } from '~/typings/website'

const websites = ref<WebsiteParams[]>([
])

onMounted(() => {
  handleSynchronize()
})

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

const flatContents = ref(websites.value.map(item => `website-id-${item.id}`))

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

function handleSynchronize() {
  broadcast.syncWebsites.listen(async (event: MessageEvent<any>) => {
    if (JSON.parse(event.data).cmd === 'SyncWebsites')
      await getList()
  })
}
function noticeSynchronize() {
  broadcast.syncWebsites.call()
}
</script>

<template>
  <ResizeCard :max-width="650" class="bg-transparent h-fit!">
    <ResizeCardContent>
      <FlatSortable>
        <FlatSortableContent v-model="flatContents" direction="row" :gap="10" class="flex-wrap">
          <FlatSortableItem
            v-for="(item, index) in websites"
            :key="index"
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
          </FlatSortableItem>

          <!-- 添加地址 -->
          <AddOrEditSite :websites="websites" @handle-o-k="getList()" />
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
