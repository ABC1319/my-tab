import { useStorageIndexDB } from '~/composables/useStorageIndexDB'
import { useStorageLocal } from '~/composables/useStorageLocal'
import { useBroadcast } from '~/composables/useBroadcast'
import type { IAppStatus, ISearchEngine } from '~/typings/app'
import { searchEngine } from '~/params/searchEngine'

export const broadcast = useBroadcast()

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const isShrinkSidebar = useStorageLocal('isShrinkSidebar', false) as Ref<IAppStatus['isShrinkSidebar']>
export const appHomeShowMode = useStorageLocal('appHomeShowMode', 1) as Ref<IAppStatus['appShowMode']>
export const appSearchEngine = useStorageLocal('appSearchEngine', searchEngine[0]) as Ref<ISearchEngine>
export const appIsEditCleanHome = useStorageLocal('appIsEditCleanHome', false) as Ref<IAppStatus['appIsEditCleanHome']>

export const storageWebsiteDB = useStorageIndexDB('website_db', '++id, webName, url, icon, type, index, remark')
export const storageSearchEngineDB = useStorageIndexDB('search_engine_db', '++id, webName, url, icon, type, index, remark')
export const storageLayoutComponentsDB = useStorageIndexDB('layout_components_db', '++id, layoutName, componentName, x, y, width, height, remark')
export const storageLayoutListDB = useStorageIndexDB('layout_list_db', '++id, layoutName, icon, index, isChecked, remark')
