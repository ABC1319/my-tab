export interface WebsiteParams {
  id?: number
  webName: string
  url: string
  icon: string | File
  type: number
  index: number
  remark?: Record<string, any>
}

export interface WorkAreaParams {
  id?: number
  layoutName: string
  icon: string | File
  index: number
  isChecked: boolean
  remark?: Record<string, any>
}
