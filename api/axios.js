import axios from 'axios'
import { appConfig } from '~/static/js/appConfig'

const axiosInstance = axios.create({
  baseURL: appConfig.app.apiUrl
})

const axiosGet = async (url, params = null) => {
  try {
    const response = params
      ? await axiosInstance.get(url, { params })
      : await axiosInstance.get(url)
    return response.data
  } catch (e) {
    return {
      code: -1,
      message: `服务请求失败: ${url}`
    }
  }
}

export { axiosInstance as axios, axiosGet }
