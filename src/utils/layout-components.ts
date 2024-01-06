// 从单个文件目录获取原始文件内容
export async function getAllCustomLayoutComponentsRaw() {
  // 单组件
  const posts = await Promise.all(
    Object.entries(
      import.meta.glob('~/components/custom-layout-card/*.vue'),
    )
      .map(async ([path, resolver]) => {
        return {
          raw: await resolver() as any,
          name: (path as any).split('/').pop().split('.')[0],
          path,
        }
      }),
  )

  // 两级目录的组件
  const posts1 = await Promise.all(
    Object.entries(
      import.meta.glob('~/components/custom-layout-card/*/index.vue'),
    )
      .map(async ([path, resolver]) => {
        return {
          raw: await resolver() as any,
          name: toPascalCase(path.split('/').at(-2) || ''),
          path,
        }
      }),
  )

  return [...posts, ...posts1]
}

function toPascalCase(str: string) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
