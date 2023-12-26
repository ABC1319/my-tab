export interface BentoCellsType {
  id: string
  x: number
  y: number
  width: number
  height: number
  [key: string]: any
}

const isDraggingElement = ref(false)
const isDraggingCanvas = ref(false)
const isPressingSpace = ref(false)
const isPressingMouseLeft = ref(false)
let mouseFrom = { x: 0, y: 0 }
let mouseTo = { x: 0, y: 0 }
export function initGridContainer(
  bentoCells: Ref<BentoCellsType[]>,
  currentClickedElement: Ref<any>,
) {
  bindMouseEvent()

  onUnmounted(() => {
    unBindMouseEvent()
  })

  const containerDom = document.querySelector('.bento-container')

  function bindMouseEvent() {
    window.addEventListener('pointerdown', mousedown, false)
    window.addEventListener('pointermove', mousemove, false)
    window.addEventListener('pointerup', mouseup, false)
    window.addEventListener('keydown', spaceDown, false)
    window.addEventListener('keyup', spaceUp, false)
  }

  function unBindMouseEvent() {
    window.removeEventListener('pointerdown', mousedown, false)
    window.removeEventListener('pointermove', mousemove, false)
    window.removeEventListener('pointerup', mouseup, false)

    window.removeEventListener('keydown', spaceDown, false)
    window.removeEventListener('keyup', spaceUp, false)
  }

  function spaceDown(event: KeyboardEvent) {
    // 移动画布一
    // 1. 空格按下，让状态设置为 true
    // 2. 如果按下的时候，鼠标左键也是按下的，那么就是移动画布
    if (event.key === ' ') {
      isPressingSpace.value = true

      if (containerDom) {
        // 只要空格按下就是开始拖拽了
        containerDom.style.cursor = 'grab'
      }

      if (isPressingMouseLeft.value) {
        isDraggingCanvas.value = true
        containerDom.style.cursor = 'grabbing'
      }
    }
  }
  function spaceUp(event: KeyboardEvent) {
    // 移动画布二
    // 1. 设置状态为 false
    // 2. 移动画布也是 false

    if (event.key === ' ') {
      isPressingSpace.value = false
      isDraggingCanvas.value = false

      if (containerDom) {
        // 只有空格松开就是取消拖拽了
        if (isDraggingCanvas.value)
          containerDom.style.cursor = 'grab'
        else
          containerDom.style.cursor = 'default'
      }
    }
  }

  function mousedown(e: MouseEvent) {
    mouseFrom = { x: e.clientX, y: e.clientY }

    currentClickedElement.value = getCellObjectInStoreFromPosition(mouseFrom)

    // 移动画布三
    // 1. 鼠标左键按下的状态为 true
    // 2. 如果这时候空格也是按下的，那么就是移动画布
    isPressingMouseLeft.value = true
    if (isPressingSpace.value) {
      isDraggingCanvas.value = true
      return
    }

    if (currentClickedElement.value) {
      isDraggingElement.value = true

      // 将当前拖拽的元素放到最上面
      const index = bentoCells.value.findIndex((ele: { id: string }) => ele.id === currentClickedElement.value.id)
      if (index !== -1) {
        const ele = bentoCells.value.splice(index, 1)
        bentoCells.value.push(ele[0])
      }
    }
  }
  function mousemove(e: MouseEvent) {
    mouseTo = { x: e.clientX, y: e.clientY }
    const disX = mouseTo.x - mouseFrom.x
    const disY = mouseTo.y - mouseFrom.y

    // 移动画布
    if (isDraggingCanvas.value) {
      bentoCells.value.forEach((cell) => {
        cell.x += disX
        cell.y += disY
      })
      mouseFrom = { x: e.clientX, y: e.clientY }
      return
    }

    // 移动元素
    if (isDraggingElement.value) {
      currentClickedElement.value.x += disX
      currentClickedElement.value.y += disY
      mouseFrom = { x: e.clientX, y: e.clientY }
    }
  }
  function mouseup(_e: MouseEvent) {
    if (containerDom) {
      // 只有空格松开就是取消拖拽了
      if (isDraggingCanvas.value)
        containerDom.style.cursor = 'grab'
      else
        containerDom.style.cursor = 'default'
    }

    currentClickedElement.value = null
    mouseFrom.x = 0
    mouseFrom.y = 0
    isDraggingElement.value = false
    isDraggingCanvas.value = false
    isPressingMouseLeft.value = false
  }

  function getCellObjectInStoreFromPosition(position: { x: number, y: number }) {
    let result: any = null
    const point = { x: position.x, y: position.y }
    const initElement = document.elementFromPoint(point.x, point.y)
    if (initElement)
      result = bentoCells.value.filter((ele: { id: string }) => ele.id === initElement.id)

    return result ? result[0] : null
  }
}
