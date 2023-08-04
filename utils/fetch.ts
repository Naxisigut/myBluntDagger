/* v1.1 */
import { join2Query } from './string';

/* 简单fetch：get */
const fetch_get = (url: string, params: Record<string, any> = {}) => {
  return fetch(url + join2Query(params), {
    method: 'GET',
  }).then((response) => {
    return response.json()
  })
}

/* 简单fetch：post */
const fetch_post = (url: string, params: Record<string, any> = {}, config:ResponseInit = {} ) => {
  return fetch(url, {
    ...config,
    body: JSON.stringify(params)
  }).then((response) => {
    return response.json()
  })
}

export const easyFetch = {
  get: fetch_get,
  post: fetch_post
}