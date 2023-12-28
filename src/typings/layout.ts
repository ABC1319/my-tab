export interface ILayoutComponentTypeInData {
  id: string
  x: number
  y: number
  width: number
  height: number
  componentName: string
  layoutName: string
}

export interface ILayoutComponentTypeInPage extends ILayoutComponentTypeInData {
  component: any
}
