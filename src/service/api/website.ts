import { websiteRequest } from '../request'

function adapter(obj: any) {
  if (obj.code === 200)
    return obj.data
  throw new Error('错误')
}

/**
 * 获取网址的 favicon
 * @param url 地址
 */
interface IWebSiteFavicon {
  icon: string[]
  name: string
  src: string
  url: string
}
export function getWebSiteFavicon(params?: { url: string }) {
  return websiteRequest.get('website/info?lang=cn', { params }).then(res => adapter(res) as IWebSiteFavicon)
}
