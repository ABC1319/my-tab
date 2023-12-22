import { useStorageIndexDB } from '~/composables/useStorageIndexDB'
import { useStorageLocal } from '~/composables/useStorageLocal'
import { useBroadcast } from '~/composables/useBroadcast'
import type { IAppStatus, ISearchEngine } from '~/typings/app'
import { searchEngine } from '~/params/searchEngine'

export const broadcast = useBroadcast()

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const isShrinkSidebar = useStorageLocal('isShrinkSidebar', false) as Ref<IAppStatus['isShrinkSidebar']>
export const appHomeShowMode = useStorageLocal('appHomeShowMode', 'normal') as Ref<IAppStatus['appShowMode']>
export const appSearchEngine = useStorageLocal('appSearchEngine', searchEngine[0]) as Ref<ISearchEngine>

export const storageWebsiteDB = useStorageIndexDB('website_db', '++id, webName, url, icon, type, remark, index')
export const storageSearchEngineDB = useStorageIndexDB('search_engine_db', '++id, webName, url, icon, type, remark, index')
