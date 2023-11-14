<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
async function close() {
  const animateDom = document.querySelectorAll('.custom-modal-mask')[0] as HTMLElement
  animateDom.classList.add('fade-out')

  const animateOutDom1 = document.querySelectorAll('.custom-modal')[0] as HTMLElement
  animateOutDom1.classList.remove('scale-up-center')
  animateOutDom1.classList.add('scale-down-center')

  const ANIMATIONS = animateOutDom1.getAnimations()
  await Promise.all(ANIMATIONS.map(animation => animation.finished))
  visible.value = false
}

function open() {
  visible.value = true
}

defineExpose({
  visible,
  close,
  open,
})
</script>

<template>
  <Teleport to="body" @click.stop>
    <div
      v-if="visible"
      class="custom-modal-mask"
      @click="close"
    >
      <div class="custom-modal scale-up-center" @click.stop>
        <div class="custom-modal-content">
          <slot />
        </div>
        <div
          class="
            absolute right-10px top-10px
            cursor-pointer
            text-white hover:bg-white hover:text-[#252835]
            rounded-full
            transition-all duration-300 ease-in-out
            w-6 h-6
          "
        >
          <div class="w-full h-full" i-carbon-close @click="close" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.custom-modal-mask{
  @apply flex justify-center items-center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  box-shadow: 0 0 1px 1px #ffffff, 0 1px 5px 0px #ffffff;
  padding: 12px;
  z-index: 9999;
}
.custom-modal{
  min-height: 300px;
  width: fit-content;
  height: auto;
  border-radius: 20px;
  background-color: #252836;
  backdrop-filter: blur(40px);
  padding: 12px;
  z-index: 100;
  color: white;
  position: relative;
}
.custom-modal-box{
  width: 100%;
  height: 100%;
  border-radius: 15px;
  backdrop-filter: blur(2px);
  z-index: 100;
  padding-top: 10px;
}
.custom-modal-header{
  @apply flex flex-row justify-between items-center;
  height: 40px;
  border-bottom: 1px solid #f4f4f4;
  padding: 0 20px;
  font-size: 20px;
}
.custom-modal-content{
  height: calc(100% - 40px);
}

.scale-up-center{
  animation:scale-up-center 0.2s;
}
@keyframes scale-up-center{
  0%{
    transform:scale(.5)
  }
  100%{
    transform:scale(1)
  }
}

.scale-down-center{
  animation:scale-down-center 0.2s forwards;
}
@keyframes scale-down-center{
  0%{
    transform:scale(1);
  }
  100%{
    transform:scale(.5);
  }
}

.fade-out{
  animation-name: fade-out;
  animation-duration: 0.2s;
  animation-fill-mode: forwards; /* 动画结束后停留在最终状态 */
}
@keyframes fade-out{
  0%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}
</style>
