<script setup lang="ts">
const props = defineProps({
  max: {
    default: 10,
  },
  min: {
    default: 0,
  },
  step: {
    default: 0.1,
  },
  value: {
    default: 0,
  },
})

const emit = defineEmits([
  'update:value',
])

const value = ref(props.value)
watch(value, (val) => {
  emit('update:value', val)
})
</script>

<template>
  <div class="flex flex-row">
    <div class="range-box">
      <input
        v-model="value"
        :min="min"
        :max="max"
        :step="step"
        class="range-bar"
        type="range"
      >
    </div>

    <div class="grid items-center w-10px h-full">
      <span class="h-3px w-full bg-[#474d63] " />
    </div>

    <input
      v-model="value"
      class="w-36px h-full bg-[#474d63] text-white rounded-10px text-12px outline-none text-center grid items-center"
      type="number"
      :min="min"
      :max="max"
      :step="step"
    >
  </div>
</template>

<style scoped>
.range-box {
  width: 100%;
  height: 100%;
  background: #474d63;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
}
.range-bar {
  margin: auto;
  width: 100%;
  background: #a4b2c1;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}

/* 样式调整 */
input[type='range'] {
  -webkit-appearance: none; /* 隐藏默认样式（Chrome 和 Safari）*/
  width: 100%; /* 设置宽度为100% */
  height: 4px; /* 设置高度 */
  background-color: #e5e1da; /* 设置背景颜色 */
  border: none; /* 移除边框 */
  border-radius: 5px; /* 设置边框圆角 */
  outline: none; /* 移除点击时的外边框 */
  transition: background-color 0.3s; /* 设置过渡效果 */
}

/* 滑块样式 */
input[type='range']::-webkit-slider-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f6b17a;
  box-shadow:
    0 0 2px rgba(10, 10, 10, 0.3),
    0 3px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  -webkit-appearance: none;
  box-shadow: 0 0 0 0px #f6b17a90;
  transition: box-shadow 0.2s ease-out;
}
/* 滑块在激活（点击并拖动）时的样式 */
input[type='range']::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 4px #f6b17a90;
}
input[type='range']:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px #f6b17a90;
}
</style>
