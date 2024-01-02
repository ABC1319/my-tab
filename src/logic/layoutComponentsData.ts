import { storageLayoutComponentsDB } from '.'
import type { ILayoutComponentTypeInData } from '~/typings/layout'

export async function getComponentsById(id: number) {
  const queryResult = await storageLayoutComponentsDB.getItemBySQL(
    { key: 'where', value: 'layoutName' },
    { key: 'equals', value: id },
    { key: 'toArray', value: null },
  )

  return queryResult
}
export async function addLayoutComponents(params: ILayoutComponentTypeInData) {
  return await storageLayoutComponentsDB.addItem(params)
}
export async function deleteLayoutComponents(params: number) {
  return await storageLayoutComponentsDB.removeItem(params)
}
export async function editLayoutComponents(params: ILayoutComponentTypeInData) {
  return await storageLayoutComponentsDB.editItem(params)
}
