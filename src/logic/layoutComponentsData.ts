import { storageLayoutDB } from '.'
import type { ILayoutComponentTypeInData } from '~/typings/layout'

export async function getLayoutComponents() {
  const queryResult = await storageLayoutDB.getItemBySQL(
    { key: 'where', value: 'layoutName' },
    { key: 'equals', value: '1' },
    { key: 'toArray', value: null },
  )

  return queryResult
}
export async function addLayoutComponents(params: ILayoutComponentTypeInData) {
  return await storageLayoutDB.addItem(params)
}
export async function deleteLayoutComponents(params: number) {
  return await storageLayoutDB.removeItem(params)
}
export async function editLayoutComponents(params: ILayoutComponentTypeInData) {
  return await storageLayoutDB.editItem(params)
}
