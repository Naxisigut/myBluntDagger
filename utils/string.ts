// v1.0

/** 删除字符串的最后一位
 * 
 * @param str 
 * @returns 
 */
export const strPop = (str: string)=>{
  if(str === '')return ''
  return str.slice(0, -1)
}

/** 将对象拼接为请求字符串
 * 
 * @param 参数对象 
 * @returns string
 */
export const join2Query = (params: Record<string, any>) => {
  const arr = Object.entries(params)
  if(!arr.length)return ''
  let query = '?'
  for(let param of arr){
    query = query + param[0] + '=' + param[1] + '&'
  }
  query = strPop(query)
  return query
}