import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')

export const isShrinkSidebar = useStorageLocal('isShrinkSidebar', 'false')
