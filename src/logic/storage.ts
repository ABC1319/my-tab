import { useStorageIndexDB } from '~/composables/useStorageIndexDB'
import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')

export const isShrinkSidebar = useStorageLocal('isShrinkSidebar', 'false')

export const storageWebsiteDB = useStorageIndexDB('website_db', '++id, webName, url, icon, type') // 0 pined 1 most used
