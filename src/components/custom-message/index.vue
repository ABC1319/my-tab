<script setup lang="ts">
interface MessageProps {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

const props = defineProps<MessageProps>()
const { message, type } = toRefs(props)

const duration = 1000

const visible = ref(false)

const currentAlertPosition = ref({
  top: 20,
  right: 20,
})

let timer: any = null

if (!type.value)
  type.value = 'info'

function open() {
  handleMultiAlertsPosition()

  visible.value = true

  timer = setTimeout(() => {
    visible.value = false
  }, duration)
}

function handleMultiAlertsPosition() {
  const doms = document.querySelectorAll('.custom-alert')
  const customAlert = Array.from(doms)

  if (customAlert.length > 0)
    currentAlertPosition.value.top = customAlert.length * (40 + 20) + 20
}

onMounted(() => {
  open()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <Transition
    name="bounce"
    @after-leave="$emit('destroy')"
  >
    <div
      v-show="visible"
      role="alert"
      class="alert custom-alert"
      :style="{
        top: `${currentAlertPosition.top}px`,
        right: `${currentAlertPosition.right}px`,
      }"
    >
      <slot>
        <p v-html="message" />
      </slot>
    </div>
  </Transition>
</template>

<style scoped>
.custom-alert {
  width: fit-content;
  position: fixed;
  padding: 10px;
  z-index: 99999;
  background-color: #44617b;
  color: #fff;
  border: 1px solid #44617b;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
