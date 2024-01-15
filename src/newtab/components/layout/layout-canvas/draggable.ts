import type { ILayoutComponentTypeInData } from '~/typings/layout'

const isDraggingElement = ref(false)
const isDraggingCanvas = ref(false)
const isPressingSpace = ref(false)
const isPressingMouseLeft = ref(false)
const isResizingElement = ref(false)
let mouseFrom = { x: 0, y: 0 }
let mouseTo = { x: 0, y: 0 }
const DEVIATION = 10

export function initGridContainer(
  bentoCells: Ref<ILayoutComponentTypeInData[]>,
  currentClickedElement: Ref<ILayoutComponentTypeInData | null>,
  disabled: Ref<boolean>,
  containerDom: HTMLElement,
  scale: Ref<number>,
  xRulerPosition: Ref<number>,
  yRulerPosition: Ref<number>,
) {
  bindMouseEvent()

  onUnmounted(() => {
    unBindMouseEvent()
  })

  watchEffect(() => {
    if (disabled.value) {
      // 说明禁止拖拽
      unBindMouseEvent()
    }
    else {
      bindMouseEvent()
    }
  })

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

      containerDom.style.cursor = 'grab'

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

      // 只有空格松开就是取消拖拽了
      if (isDraggingCanvas.value)
        containerDom.style.cursor = 'grab'
      else
        containerDom.style.cursor = 'default'
    }
  }

  function mousedown(e: MouseEvent) {
    mouseFrom = { x: e.clientX, y: e.clientY }

    currentClickedElement.value = getCellObjectInStoreFromPosition(mouseFrom)

    // 如果当前选中的要素是已经被锁定的，那么就不对其操作
    if (currentClickedElement.value && currentClickedElement.value.isFixed)
      return

    // 移动画布三。鼠标左键按下的状态为 true，如果这时候空格也是按下的，那么就是移动画布
    isPressingMouseLeft.value = true
    if (isPressingSpace.value) {
      isDraggingCanvas.value = true
      return
    }

    // 移动元素
    if (currentClickedElement.value) {
      isDraggingElement.value = true

      // 将当前拖拽的元素放到最上面
      const index = bentoCells.value.findIndex(ele => ele.id === currentClickedElement.value!.id)
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
        cell.x += (disX / scale.value)
        cell.y += (disY / scale.value)
      })
      mouseFrom = { x: e.clientX, y: e.clientY }
      return
    }

    // 移动元素
    if (isDraggingElement.value && currentClickedElement.value) {
      // 这里的移动元素，新增了吸附线的功能，误差默认设置为 5  start //
      currentClickedElement.value.x += (disX / scale.value)
      currentClickedElement.value.y += (disY / scale.value)
      // mouseFrom = { x: e.clientX, y: e.clientY } // 不需要吸附的话，直接放开这行，注释下面的 switch

      // 1. 针对于竖线有左右两条边
      // 2. 针对于h横线有上下两条边
      // 3. 同时针对两条线（就是排列组合，暂时不做）
      switch (true) {
        // ----------------------------------------------x--------------------------------------------------//
        case
          (xRulerPosition.value - DEVIATION) < currentClickedElement.value.x
          && currentClickedElement.value.x < (xRulerPosition.value + DEVIATION):

          // 因为获取的 width 是已经 scale 的像素尺寸，而坐标点位跟 scale 无关，所以尺寸的值需要 / scale
          currentClickedElement.value.x = xRulerPosition.value

          // 这里因为 x 的值被吸附到辅助线了，所以坐标只更新 y 的就行了
          // x 的坐标应该是辅助线的坐标，[左往右/右往左] 移动，上一个值[加/减]误差值
          if (mouseTo.x > mouseFrom.x)
            mouseFrom = { x: mouseFrom.x + DEVIATION * scale.value, y: e.clientY }
          else
            mouseFrom = { x: mouseFrom.x - DEVIATION * scale.value, y: e.clientY }
          break

        case
          (xRulerPosition.value - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width / scale.value)
          && (currentClickedElement.value.x + currentClickedElement.value.width / scale.value) < (xRulerPosition.value + DEVIATION):

          currentClickedElement.value.x = xRulerPosition.value - currentClickedElement.value.width / scale.value
          if (mouseTo.x > mouseFrom.x)
            mouseFrom = { x: mouseFrom.x + DEVIATION * scale.value, y: e.clientY }
          else
            mouseFrom = { x: mouseFrom.x - DEVIATION * scale.value, y: e.clientY }
          break

        // ----------------------------------------------y--------------------------------------------------//
        case
          (yRulerPosition.value - DEVIATION) < currentClickedElement.value.y
          && currentClickedElement.value.y < (yRulerPosition.value + DEVIATION):

          // 因为获取的 width 是已经 scale 的像素尺寸，而坐标点位跟 scale 无关，所以尺寸的值需要 / scale
          currentClickedElement.value.y = yRulerPosition.value

          // 这里因为 x 的值被吸附到辅助线了，所以坐标只更新 y 的就行了
          // x 的坐标应该是辅助线的坐标，[左往右/右往左] 移动，上一个值[加/减]误差值
          if (mouseTo.y > mouseFrom.y)
            mouseFrom = { x: e.clientX, y: mouseFrom.y + DEVIATION * scale.value }
          else
            mouseFrom = { x: e.clientX, y: mouseFrom.y - DEVIATION * scale.value }
          break

        case
          (yRulerPosition.value - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height / scale.value)
          && (currentClickedElement.value.y + currentClickedElement.value.height / scale.value) < (yRulerPosition.value + DEVIATION):

          currentClickedElement.value.y = yRulerPosition.value - currentClickedElement.value.height / scale.value
          if (mouseTo.y > mouseFrom.y)
            mouseFrom = { x: e.clientX, y: mouseFrom.y + DEVIATION * scale.value }
          else
            mouseFrom = { x: e.clientX, y: mouseFrom.y - DEVIATION * scale.value }
          break

        default:
          mouseFrom = { x: e.clientX, y: e.clientY }
          break
      }

      // 这里的移动元素，新增了吸附线的功能，误差默认设置为 5  end  //
    }

    // 缩放元素
    if (isResizingElement.value && currentClickedElement.value) {
      // 初始的宽度
      const initWidth = currentClickedElement.value.width * scale.value
      // 偏移的距离
      const offsetX = disX / scale.value

      if (offsetX !== 0) {
        const offsetScaleX = offsetX / initWidth
        currentClickedElement.value.scale += offsetScaleX
      }

      mouseFrom = { x: e.clientX, y: e.clientY }
    }
  }
  function mouseup(_e: MouseEvent) {
    // 只有空格松开就是取消拖拽了
    if (isDraggingCanvas.value)
      containerDom.style.cursor = 'grab'
    else
      containerDom.style.cursor = 'default'

    currentClickedElement.value = null
    mouseFrom.x = 0
    mouseFrom.y = 0
    isDraggingElement.value = false
    isDraggingCanvas.value = false
    isPressingMouseLeft.value = false
    isResizingElement.value = false
  }

  // 从点击的位置获取组件
  function getCellObjectInStoreFromPosition(position: { x: number, y: number }) {
    let result: ILayoutComponentTypeInData | null = null
    const point = { x: position.x, y: position.y }
    const initElement = document.elementFromPoint(point.x, point.y)

    // 遍历 clickedElement 的父元素，直到找到 id 为 box1 的元素
    let currentElement = initElement
    while (currentElement && !currentElement.id.includes('layout-component'))
      currentElement = currentElement.parentElement

    // 如果找到了 id 为 box1 的元素
    if (currentElement && currentElement.id.includes('layout-component')) {
      const domIdToNumber = Number(currentElement.id.match(/layout-component-(\S*)/)?.[1] || -1)
      result = bentoCells.value?.find(ele => ele.id === domIdToNumber) || null

      if (result) {
        const { width, height } = currentElement.getBoundingClientRect()
        result.width = width
        result.height = height
      }
    }

    return result
  }

  // 从点击的位置获取组件的控制点
  // function getControlPointInStoreFromPosition(position: { x: number, y: number }) {
  //   let result: any = null
  //   const point = { x: position.x, y: position.y }
  //   const initElement = document.elementFromPoint(point.x, point.y)
  //   if (initElement) {
  //     const domIdToNumber = Number(initElement.id.match(/component-control-dot-(\S*)/)?.[1] || -1)
  //     result = bentoCells.value?.find(ele => ele.id === domIdToNumber)

  //     const currentElement = document.querySelector(`#layout-component-${domIdToNumber}`)
  //     if (result && currentElement) {
  //       const { width, height } = currentElement.getBoundingClientRect()
  //       result.width = width
  //       result.height = height
  //     }
  //   }

  //   return result || null
  // }
}
