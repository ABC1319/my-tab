export interface IAppStatus {
  appShowMode: 'normal' | 'clean'
  appSidebarMode: 'shrink' | 'grow'
  isShrinkSidebar: 'true' | 'false'
}

export interface ISearchEngine {
  label: string
  url: string
  icon: string
}
