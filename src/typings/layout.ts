export interface ILayoutComponentTypeInData {
  id?: number
  x: number
  y: number
  width: number
  height: number
  componentName: string
  isFixed: boolean
  layoutName: number
  scale: number
  rotate: number
  isVerticalCenter: boolean
}

export interface ILayoutComponentTypeInPage extends ILayoutComponentTypeInData {
  component: any
}
