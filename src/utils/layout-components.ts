// 从单个文件目录获取原始文件内容
export async function getAllCustomLayoutComponentsRaw() {
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
  return posts
}
