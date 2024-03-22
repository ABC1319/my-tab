<script setup lang="ts">
import BackgroundBar from './BackgroundBar.vue'
import CommandRoot from './CommandRoot.vue'
import { appWallPaper } from '~/logic'
import AnimatedBackground from '~/components/AnimatedBackground.vue'
import { defaultWallpapers } from '~/params/wallpaper'
import { getAllCustomWallPaper } from '~/logic/customWallpaperData'
import { renderBlobToImage } from '~/utils/wallpaper'

const currentWallpaper = ref<string>('')

watch(() => appWallPaper.value.wallpaperId, async () => {
  if (!appWallPaper.value) {
    appWallPaper.value = { wallpaperId: 'default-1', blur: 0, mask: 0 }
    return
  }
  const wallpapers = await getAllWallpaper()
  if (typeof appWallPaper.value.wallpaperId === 'string') {
    // 默认
    const wallpaper = wallpapers.default?.find((item: any) => item.id === appWallPaper.value.wallpaperId)
    currentWallpaper.value = wallpaper?.image || defaultWallpapers[0].image
  }
  if (typeof appWallPaper.value.wallpaperId === 'number') {
    // 自定义墙纸
    const wallpaper = wallpapers.custom?.find((item: any) => item.id === appWallPaper.value.wallpaperId)
    currentWallpaper.value = wallpaper.renderImage || defaultWallpapers[0].image
  }
}, {
  immediate: true,
})

async function getAllWallpaper() {
  // 1. 从 indexDB 获取所有自定义壁纸 blob
  // 2. 将 blob 转成图片赋值给变量
  const originData = await getAllCustomWallPaper()

  const wallpapers_processing = await Promise.all(originData.map(async (item) => {
    if (item.image instanceof Blob) {
      const imageUrl = await renderBlobToImage(item.image) as string
      return {
        id: item.id,
        image: item.image,
        renderImage: imageUrl,
      }
    }
    else {
      return null
    }
  }))

  return {
    default: defaultWallpapers,
    custom: wallpapers_processing.filter(item => item?.image) as any,
  }
}
</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <ContextMenu>
      <ContextMenuTrigger>
        <AnimatedBackground
          v-model="currentWallpaper"
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <BackgroundBar v-model="currentWallpaper" />
      </ContextMenuContent>
    </ContextMenu>
    <CommandRoot />
  </div>
</template>

<style scoped>

</style>
