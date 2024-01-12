import { storageCustomWallpaperDB } from '.'

export async function getAllCustomWallPaper() {
  const queryResult = await storageCustomWallpaperDB.getAllItem()

  return queryResult
}
export async function addCustomWallPaper(params: { image: string }) {
  return await storageCustomWallpaperDB.addItem(params)
}
export async function deleteCustomWallPaper(params: number) {
  return await storageCustomWallpaperDB.removeItem(params)
}
export async function editCustomWallPaper(params: { image: string }) {
  return await storageCustomWallpaperDB.editItem(params)
}
