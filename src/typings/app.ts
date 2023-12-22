export interface IAppStatus {
  appShowMode: 'normal' | 'clean'
  appSidebarMode: 'shrink' | 'grow'
  isShrinkSidebar: 'true' | 'false'
}

export interface ISearchEngine {
  id?: number
  webName: string
  url: string
  icon: string | File
  type: number
  index: number
  remark: Record<string, any>
}
