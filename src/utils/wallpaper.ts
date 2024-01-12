/**
 * 将 blob 转成图片
 * @param file
 */
export function renderBlobToImage(file: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      const iconUrl = URL.createObjectURL(file)
      resolve(iconUrl)
    }
  })
}
