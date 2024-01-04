export interface ILayoutComponentTypeInData {
  id?: number
  x: number
  y: number
  width: number
  height: number
  componentName: string
  isFixed: boolean
  layoutName: number
}

export interface ILayoutComponentTypeInPage extends ILayoutComponentTypeInData {
  component: any
}
