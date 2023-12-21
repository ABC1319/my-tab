import { useStorageIndexDB } from '~/composables/useStorageIndexDB'
import { useStorageLocal } from '~/composables/useStorageLocal'
import { useBroadcast } from '~/composables/useBroadcast'
import type { IAppStatus } from '~/typings/app'

export const broadcast = useBroadcast()

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')

export const isShrinkSidebar = useStorageLocal('isShrinkSidebar', 'false') as Ref<IAppStatus['isShrinkSidebar']>

export const storageWebsiteDB = useStorageIndexDB('website_db', '++id, webName, url, icon, type, remark, index')

export const appHomeShowMode = useStorageLocal('appHomeShowMode', 'normal') as Ref<IAppStatus['appShowMode']>
