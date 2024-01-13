<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { appWallPaper } from '~/logic'
import { addCustomWallPaper, deleteCustomWallPaper, getAllCustomWallPaper } from '~/logic/customWallpaperData'
import { defaultWallpapers } from '~/params/wallpaper'
import { renderBlobToImage } from '~/utils/wallpaper'

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

const targetRef = ref<HTMLElement | null>(null)
onClickOutside(targetRef, () => {
  emit('close')
})

/**
 * 总有一个设置：图片地址 遮罩浓度 模糊度
 * 当前组件有三个变量： 默认图片 6 张 ，自定义上传图片最大 6 张，遮罩浓度和模糊度
 *
 * 因为存储的是 blob ，每次拿出来需要转化一下，而转化后的结果都不一样。
 * 所以最好也是直接使用 blob ，只有最后用的时候转一下子。
 */

const wallpaperInputRef = ref<HTMLInputElement | null>(null)

interface ICustomWallpaper {
  id: number
  image: Blob
  renderImage: string
}
const customWallpapers = ref<ICustomWallpaper[]>([])

/**
 * 1. 触发添加自定义墙纸
 */
function handleAddCustomWallpaper() {
  wallpaperInputRef.value?.click()
}
/**
 * 2. 上传墙纸到 indexDB
 * @param e
 */
function handleUploadWallpaper(e: any) {
  const file = e.target.files[0]

  addCustomWallPaper({
    image: file,
  })

  getAllCustomWallPaperFromDB()
}

/**
 * 3. 查询所有自定义墙纸
 */
await getAllCustomWallPaperFromDB()
async function getAllCustomWallPaperFromDB() {
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

  customWallpapers.value = wallpapers_processing.filter(item => item?.image) as any
}

/**
 * 4. 删除自定义墙纸
 */
function handleDeleteWallpaper(item: typeof customWallpapers.value[number]) {
  deleteCustomWallPaper(item.id)

  // 如果删除的是当前应用的，那么删除成功后，使用默认第一个为墙纸
  if (item.id === appWallPaper.value.wallpaperId)
    handleSetWallpaper(defaultWallpapers[0])

  getAllCustomWallPaperFromDB()
}

/**
 * 5. 设置墙纸
 */
function handleSetWallpaper(item: typeof defaultWallpapers[number] | typeof customWallpapers.value[number]) {
  appWallPaper.value.wallpaperId = item.id
}
</script>

<template>
  <div
    ref="targetRef"
    class="
      absolute top-0px right-8px z-999
      w-370px h-screen
      text-white
      flex-shrink-0
      flex flex-col justify-center items-center
    "
  >
    <div
      class="
        w-full h-645px
        bg-[#252835]
        rounded-10px py-20px px-20px
        flex flex-col flex-shrink-0
        overflow-auto select-none
        relative gap-20px
      "
    >
      <!-- close -->
      <div class="absolute right-10px top-10px w-16px h-16px cursor-pointer" i-carbon-close @click="close" />

      <!-- 默认墙纸 -->
      <div class="w-full ">
        <!-- title -->
        <div class="w-full h-4 font-bold mb-10px">
          默认墙纸
        </div>
        <div class="grid grid-rows-2 grid-cols-3 gap-20px">
          <div
            v-for="item in defaultWallpapers"
            :key="item.id"
            class="
              w-full h-80px
              bg-[#ffffff1a]
              rounded-10px
              flex items-center justify-center
              relative cursor-pointer
              transition-all duration-200 ease-in-out
              hover:outline-[#474d63] outline-2px outline-transparent outline-solid outline-offset-2px
              group
            "
            @click="handleSetWallpaper(item)"
          >
            <img class="w-full h-full rounded-10px object-cover" :src="item.image" alt="">
            <!-- 选中按钮 -->
            <div v-if="appWallPaper.wallpaperId === item.id" class="absolute top-1/2 left-1/2 -translate-1/2 grid place-items-center w-24px h-24px bg-[#ffffffa1] text-black rounded-full transition-opacity duration-100 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5" /></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 自定义墙纸 -->
      <div class="w-full ">
        <!-- title -->
        <div class="w-full h-4 font-bold mb-10px">
          自定义墙纸
        </div>
        <div class="grid grid-rows-2 grid-cols-3 gap-20px">
          <div
            v-for="item in customWallpapers"
            :key="item.id"
            class="
              w-100px h-80px
              bg-[#ffffff1a]
              rounded-10px object-contain
              flex items-center justify-center
              relative cursor-pointer
              transition-all duration-200 ease-in-out
              hover:outline-[#474d63] outline-2px outline-transparent outline-solid outline-offset-2px
              group
            "
            @click="handleSetWallpaper(item)"
          >
            <img class="w-full h-full rounded-10px object-cover" :src="item.renderImage" alt="">

            <!-- 选中按钮 -->
            <div v-if="appWallPaper.wallpaperId === item.id" class="absolute top-1/2 left-1/2 -translate-1/2 grid place-items-center w-24px h-24px bg-[#ffffffa1] text-black rounded-full transition-opacity duration-100 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5" /></svg>
            </div>

            <!-- 删除按钮 -->
            <div class="hover:bg-[#ffffff90] group-hover-opacity-100 absolute top-3px right-3px grid place-items-center w-20px h-20px bg-[#ffffff1a] rounded-full opacity-0 transition-opacity duration-100 ease-in-out" @click.stop="handleDeleteWallpaper(item)">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></svg>
            </div>
          </div>

          <div
            v-if="customWallpapers.length < 6"
            class="
              w-100px h-80px
              bg-[#ffffff1a]
              rounded-10px object-contain
              flex items-center justify-center
              text-[#ffffff90] cursor-pointer
            "
            @click="handleAddCustomWallpaper"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M8 12h8m-4-4v8" /></g></svg>
          </div>
        </div>

        <div class="mt-20px w-full h-1px border-b border-dashed border-[#3c3e49]" />
      </div>

      <!-- 墙纸的遮罩浓度 -->
      <div class="w-full ">
        <div class="w-full h-4 font-bold mb-10px">
          遮罩浓度
        </div>

        <CustomRange
          v-model:value="appWallPaper.mask"
          class="w-full h-30px"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </div>

      <!-- 墙纸的模糊度 -->
      <div class="w-full">
        <div class="w-full h-4 font-bold mb-10px">
          模糊度
        </div>
        <CustomRange
          v-model:value="appWallPaper.blur"
          class="w-full h-30px"
          :min="0"
          :max="40"
          :step="0.5"
        />
      </div>
    </div>

    <input v-show="false" ref="wallpaperInputRef" type="file" accept="image/*" @change="handleUploadWallpaper">
  </div>
</template>

<style scoped>

</style>
