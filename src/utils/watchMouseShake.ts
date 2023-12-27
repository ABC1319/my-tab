/* eslint-disable no-console */

export function watchMouseShake() {
  // 1. 监听鼠标移动的频率
  // 2. 如果频率超过某个阈值，开始监听
  // 3. 是否在某个范围内移动，如果超过这个范围，那么就 false
  // 4. 如果是在这个范围内移动，那么监听 2s 内移动的总距离
  // 5. 如果移动的总距离超过某个阈值，那么就触发 true

  const MaxChangedNumber = 300 // 位置更新的次数
  const MaxChangedTime = 2000 // 位置更新的次数为最大的时候所需要的时间
  const MaxDistanceInTime = 1000 // 在某个时间内移动的最大距离
  const MaxDistanceInOnce = 500 // 一次移动的最大距离

  let totalDistance = 0 // 在某个时间内移动的实际总的距离
  let mouseFrom = { x: 0, y: 0 }
  let isShaking = false
  let initTimestamp = new Date().getTime()
  let lastTimestamp = new Date().getTime()
  let frequencyNumber = 0

  function handleMouseMove(e: MouseEvent) {
    const currentX = e.clientX
    const currentY = e.clientY

    // 如果这次移动的时间跟上一次相比，超过了 MaxChangedTime ，那么就是从头开始
    if ((new Date().getTime() - lastTimestamp) > MaxChangedTime) {
      console.log(111)
      reset()
      return
    }

    const distance = Math.sqrt((currentX - mouseFrom.x) ** 2 + (currentY - mouseFrom.y) ** 2)
    // 如果这次的位置相对于上一次的位置移动的距离过远，也是要重置
    console.log(frequencyNumber, distance)
    if (distance > MaxDistanceInOnce) {
      reset()
      return
    }

    if (frequencyNumber > MaxChangedNumber) {
      // 说明现在移动的次数大于了次数阈值
      // 然后判断用了多少时间，来判断频率
      const time = new Date().getTime() - initTimestamp

      if (time > MaxChangedTime) {
        // 说明时间用得多，那么就频率不够达到剧烈晃动，那么这里就是重置状态
        console.log('重置，因为所用的时间超过了阈值时间，实际时间：', time)
        reset()
      }
      else {
        // 这里开始下一阶段的判断，频率够了，开始判断距离
        console.log('次数够了，开始判断距离，实际时间：', time)
        checkShaking()
      }
    }
    else {
      // 次数不够，那么就继续添加次数修改
      if (!mouseFrom.x && !mouseFrom.y) {
        console.log('重置后第一次记录')
        // 记录初始点位置
        mouseFrom = { x: currentX, y: currentY }
        initTimestamp = new Date().getTime()
        // 重置总距离
        totalDistance = 0
        frequencyNumber = 0
        isShaking = false
      }
      else {
        console.log('次数不够，继续更新位置')

        const deltaX = currentX - mouseFrom.x
        const deltaY = currentY - mouseFrom.y
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
        totalDistance += distance
        // 更新初始点位置
        mouseFrom = { x: currentX, y: currentY }
        frequencyNumber++
      }
    }

    // 每次移动都更新一下时间
    lastTimestamp = new Date().getTime()
    // 如果有位置超过一个范围，那么就 false
  }

  function reset() {
    console.log(222)
    totalDistance = 0 // 在某个时间内移动的实际总的距离
    isShaking = false
    initTimestamp = lastTimestamp
    frequencyNumber = 0
  }

  function checkShaking() {
    console.log('实际运动了300次后的距离是', totalDistance)
    if (totalDistance > MaxDistanceInTime) {
      isShaking = true
      console.log('鼠标晃动')
    }

    // 重置
    console.log('已经进行了判断，重置所有')
    reset()
  }

  function handleMouseStop(_e: MouseEvent) {
    // 重置初始点位置和总距离
    mouseFrom = { x: 0, y: 0 }
    totalDistance = 0

    if (isShaking) {
      console.log('Mouse shaking stopped.')
      isShaking = false
    }
  }

  function handleMousedown(e: MouseEvent) {
    if (e.button === 0) {
      // 按下左键后开始监听
      mouseFrom.x = e.clientX
      mouseFrom.y = e.clientY
      document.addEventListener('mousemove', handleMouseMove)
    }
  }

  document.addEventListener('mousedown', handleMousedown)
  document.addEventListener('mouseup', (e) => {
    handleMouseStop(e)
    document.removeEventListener('mousemove', handleMouseMove)
  })
}
