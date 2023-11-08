<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { watch } from 'vue'
import { createDragInHorizontal } from '~/utils/drag'

const DEFAULT_SITES = [
  {
    index: 0,
    type: 0,
    webName: 'Me',
    url: 'https://mmeme.me/',
    property: {
      color: '#669AE1',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5.926 12.496c2.063-.443 1.782-2.908 1.72-3.447c-.1-.83-1.078-2.282-2.404-2.167c-1.67.15-1.914 2.561-1.914 2.561c-.226 1.115.54 3.497 2.598 3.053Zm2.191 4.289c-.06.173-.195.616-.079 1.002c.23.866.982.905.982.905h1.08v-2.64H8.944c-.52.154-.77.559-.827.733Zm1.638-8.422c1.14 0 2.06-1.312 2.06-2.933c0-1.62-.92-2.93-2.06-2.93c-1.138 0-2.06 1.31-2.06 2.93c0 1.621.923 2.933 2.06 2.933Zm4.907.193c1.523.198 2.502-1.427 2.697-2.659c.198-1.23-.784-2.658-1.862-2.904c-1.08-.248-2.43 1.483-2.552 2.61c-.147 1.38.197 2.758 1.717 2.953Zm0 3.448c-1.865-2.905-4.513-1.723-5.399-.245c-.882 1.477-2.256 2.41-2.452 2.658c-.198.244-2.846 1.673-2.258 4.284c.588 2.609 2.653 2.56 2.653 2.56s1.521.15 3.286-.246c1.766-.391 3.286.098 3.286.098s4.124 1.38 5.253-1.278c1.127-2.66-.638-4.038-.638-4.038s-2.356-1.823-3.731-3.793Zm-6.007 7.75c-1.158-.231-1.62-1.021-1.677-1.156c-.057-.137-.386-.772-.212-1.853c.5-1.619 1.927-1.735 1.927-1.735h1.427v-1.755l1.216.02v6.479H8.655Zm4.59-.019c-1.196-.308-1.252-1.158-1.252-1.158v-3.412l1.252-.02v3.066c.076.328.482.387.482.387H15v-3.433h1.331v4.57h-3.085Zm7.453-9.11c0-.59-.49-2.364-2.305-2.364c-1.818 0-2.061 1.675-2.061 2.859c0 1.13.095 2.707 2.354 2.657c2.26-.05 2.012-2.56 2.012-3.152Z"/></svg>',
  },
  {
    index: 1,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    index: 2,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    index: 3,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    index: 4,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    index: 5,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    index: 6,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    index: 7,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    index: 8,
    type: 0,
    webName: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    property: {
      color: '#70CC72',
    },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },

]

const options = ref({
  containerClassName: 'drag-container',
  elementsClassName: 'my-website-item',
  size: { width: 144, height: 88 },
  gap: 20,
  maximumInLine: 6,
  duration: 300,
})

const containerSize = computed(() => {
  const w = (options.value.size.width + options.value.gap) * options.value.maximumInLine - options.value.gap
  const h = (options.value.size.width + options.value.gap) * Math.floor(DEFAULT_SITES.length / options.value.maximumInLine) - options.value.gap
  return { width: w, height: h }
})

const { resetLayout } = createDragInHorizontal(options.value)

const { width } = useWindowSize()

watch(width, (val) => {
  const max = Math.min(Math.floor(width.value / (options.value.size.width + options.value.gap)), 6)

  if (max !== options.value.maximumInLine) {
    options.value.maximumInLine = max
    resetLayout(undefined, undefined, max)
  }
})
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <div
      :class="options.containerClassName"
      :style="{ width: `${containerSize.width}px` }"
      style="will-change: width;"
      class="h-500px"
    >
      <div
        v-for="(item, index) in DEFAULT_SITES"
        :key="item.webName"
        :class="options.elementsClassName"
        class="
          w-144px h-88px
          flex flex-col justify-center items-center  gap-5px flex-shrink-0 flex-grow-0
          cursor-pointer
          overflow-hidden
          rounded-10px
          text-center
        "
      >
        <div w-144px h-88px>
          {{ item.webName + index }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-website-item {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  clip-path: path("M 0 44 C 0 0.9849735503722608 0.9849735503722608 0 44 0 L 100 0 C 143.01502644962773 0 144 0.9849735503722608 144 44 L 144 44 C 144 87.01502644962774 143.01502644962773 88 100 88 L 44 88 C 0.9849735503722608 88 0 87.01502644962774 0 44 z");
}

.my-website-item::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 8px;
  background: none;
  box-shadow: inset 0 0 0 200px rgb(255, 255, 255, 0.2);
  filter: blur(16px);
  pointer-events: none;
}
</style>
