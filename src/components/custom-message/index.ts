import { createVNode, render } from 'vue'
import element from './index.vue'

export interface MessageOptions {
  message: string
  type?: 'success' | 'info' | 'warning' | 'error'
}

function Message(options: MessageOptions) {
  if (typeof options === 'string') {
    options = {
      message: options as string,
    }
  }

  const opts = { ...options }

  // vue3写法，需要用虚拟节点
  const div = document.createElement('div')
  // 渲染组件
  const vNode = createVNode(element, opts)
  vNode.props!.onDestroy = () => {
    render(null, div) // render会移除dom，注意：此方法在vue2中无法使用
  }
  // 挂载到div上
  render(vNode, div)
  // 加入页面
  document.body.appendChild(div.firstElementChild!)
}

export default Message
