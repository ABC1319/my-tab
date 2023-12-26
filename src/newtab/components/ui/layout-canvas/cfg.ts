import { defineComponent, h, markRaw } from 'vue'

export const cfg = [
  { id: '1', x: 0, y: 0, width: 100, height: 100, component: markRaw(createBentoCellComponent('Bento1', '1')) },
  { id: '2', x: 100, y: 0, width: 100, height: 100, component: markRaw(createBentoCellComponent('Bento2', '2')) },
  { id: '3', x: 200, y: 0, width: 200, height: 200, component: markRaw(createBentoCellComponent('Bento3', '3')) },
  { id: '4', x: 0, y: 0, width: 200, height: 200, component: markRaw(createBentoCellComponent('Bento4', '4')) },
  { id: '5', x: 0, y: 100, width: 200, height: 100, component: markRaw(createBentoCellComponent('Bento5', '5')) },
  { id: '6', x: 200, y: 100, width: 200, height: 100, component: markRaw(createBentoCellComponent('Bento6', '6')) },
]

// 创建组件
const colors = 'cae7b9-f3de8a-eb9486-7e7f9a-97a7b3-4059ad'.split('-').map(a => `#${a}`)
function createBentoCellComponent(name: string, content: string) {
  return defineComponent({
    name,
    setup() {
      return () => h(
        'div',
        {
          style: `
            background: ${colors[Number(content) - 1]};
            place-items: center;
            user-select: none;
          `,
        },
        content,
      )
    },
  })
}
