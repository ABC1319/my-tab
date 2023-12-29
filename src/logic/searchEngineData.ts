import { storageSearchEngineDB } from '.'
import type { ISearchEngine } from '~/typings/app'

export async function getSearchEngine() {
  const queryResult = await storageSearchEngineDB.getItemBySQL(
    { key: 'where', value: 'type' },
    { key: 'equals', value: 0 },
    { key: 'toArray', value: null },
  )

  return queryResult
}
export async function addSearchEngine(params: ISearchEngine) {
  return await storageSearchEngineDB.addItem(params)
}
export async function deleteSearchEngine(params: number) {
  return await storageSearchEngineDB.removeItem(params)
}
export async function editSearchEngine(params: ISearchEngine) {
  return await storageSearchEngineDB.editItem(params)
}
