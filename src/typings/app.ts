export interface IAppStatus {
  appShowMode: number
  appSidebarMode: 'shrink' | 'grow'
  isShrinkSidebar: boolean
  appIsEditCleanHome: boolean
  appBackgroundImage: {
    url: string
    blur: number
    mask: number
  }
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
