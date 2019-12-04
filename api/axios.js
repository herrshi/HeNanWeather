import axios from 'axios'

let apiUrl = ''
if (process.env.buildEnv === 'test') {
  apiUrl = 'http://47.110.60.109:18091'
} else if (process.env.buildEnv === 'prod_ali') {
  apiUrl = 'http://47.110.60.109:18091'
} else if (process.env.buildEnv === 'prod') {
  apiUrl = 'http://10.41.109.91:18091'
}

const axiosInstance = axios.create({
  baseURL: apiUrl
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

const axiosPost = async (url, params = null) => {
  const urlParam = new URLSearchParams()
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      urlParam.append(key, params[key])
    }
  }
  try {
    const response = params
      ? await axiosInstance.post(url, urlParam)
      : await axiosInstance.post(url)
    return response.data
  } catch (e) {
    return {
      code: -1,
      message: `服务请求失败: ${url}`
    }
  }
}

export { axiosInstance as axios, axiosGet, axiosPost }
