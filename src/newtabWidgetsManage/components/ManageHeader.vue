<script setup lang="ts">
defineProps<{
  currentType: string
  searchText: string
}>()

const navFilter = [
  { label: '推荐', route: 'recommend' },
  { label: '照片', route: 'picture' },
  { label: '时间', route: 'time' },
  { label: '文本', route: 'text' },
]

const navItemOptions = {
  width: 80,
  height: 36,
  padding: 5,
}

// 0. 通过序号计算左右移动的位置
const currentItemIndex = ref<number>(-2)
// 1. 背景的样式，外面的盒子移动
const outerBgStyles = computed(() => {
  return {
    width: `${navItemOptions.width}px`,
    height: `${navItemOptions.height}px`,
    transform: `
      translate(
        ${currentItemIndex.value * navItemOptions.width + navItemOptions.padding}px,
        5px
      )
    `,
  }
})
// 2. 背景的样式，里面的盒子跳动
const bgInnerRef = ref<HTMLElement>()
// ------------------------------------data------------------------------------//

// ------------------------------------logic------------------------------------//
// 1. 获取当前路由，设置动画
onMounted(() => {
  refreshActiveTab(navFilter[0], 0)
})

// 2. 设置当前选中的 item 的背景
function refreshActiveTab(item: typeof navFilter[0], index: number) {
  // b. 设置头部动画
  currentItemIndex.value = index
  startJelloShowAnimate()
}

function startJelloShowAnimate() {
  const jello = [
    'scale3d(1, 1, 1)',
    'scale3d(1.25, 0.75, 1)',
    'scale3d(0.75, 1.25, 1)',
    'scale3d(1.15, 0.85, 1)',
    'scale3d(0.95, 1.05, 1)',
    'scale3d(1.05, 0.95, 1)',
    'scale3d(1, 1, 1)',
  ]
  const opacity = [1, 1]

  if (bgInnerRef.value) {
    const animation = bgInnerRef.value.animate(
      { transform: jello, opacity },
      { duration: 900, fill: 'forwards' },
    )
    animation.onfinish = () => {
      // eslint-disable-next-line no-console
      console.log('动画完成')
    }
  }
}
</script>

<template>
  <div class=" w-full h-100px flex-shrink-0 flex flex-row items-center gap-40px px-8 ">
    <!-- nav -->
    <div class="nav-container">
      <!-- item -->
      <div
        v-for="(item, index) in navFilter"
        :key="item.label"
        :to="item.route"
        replace
        class="nav-item"
        :style="{ height: `${navItemOptions.height}px`, width: `${navItemOptions.width}px` }"
        @click="refreshActiveTab(item, index)"
      >
        {{ item.label }}
      </div>
      <!-- bg 外层移动，内层动画 -->
      <div
        :style="outerBgStyles"
        class="pointer-events-none absolute left-0 top-0 transition-transform duration-300 ease-in-out"
      >
        <div
          ref="bgInnerRef"
          class="h-full w-full rounded-50px bg-[#ffffff]"
        />
      </div>
    </div>

    <!-- 检索 -->
    <Input
      class="rounded-20px max-w-270px "
      type="text"
    />
  </div>
</template>

<style scoped>
.nav-container {
  position: relative;
  border-radius: 23px;
  display: flex;
  font-size: 14px;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
  font-weight: bold;
  flex-shrink: 0;
}
.nav-item {
  cursor: pointer;
  border-radius: 50px;
  -webkit-box-align: center;
  padding: 0px 16px;
  transition: opacity 0.3s ease 0s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1;
  user-select: none;
  color: #ffffff;
  mix-blend-mode: difference;
}
</style>
