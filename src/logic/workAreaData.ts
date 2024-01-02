import { storageLayoutListDB } from '.'
import type { WorkAreaParams } from '~/typings/website'

export async function getWorkArea() {
  const queryResult = await storageLayoutListDB.getAllItem()

  return queryResult
}
export async function addWorkArea(params: WorkAreaParams) {
  return await storageLayoutListDB.addItem(params)
}
export async function deleteWorkArea(params: number) {
  return await storageLayoutListDB.removeItem(params)
}
export async function editWorkArea(params: WorkAreaParams) {
  return await storageLayoutListDB.editItem(params)
}
