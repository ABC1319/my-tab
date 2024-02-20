import type { AxiosRequestHeaders } from 'axios'
import axios from 'axios'

/**
 * 创建请求
 * @param axiosConfig - axios配置
 */
export function createRequest(axiosConfig: any) {
  const instance = axios.create(axiosConfig)
  instance.interceptors.request.use(
    (config) => {
      (config.headers as AxiosRequestHeaders).SERVICE_TOKEN = 'tabtab'

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )
  instance.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error),
  )
  return instance
}
