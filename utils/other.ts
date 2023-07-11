/* v1.01 */

/** 复制指定文本到剪切板
 * 
 * @param string 
 * @returns undefined
 */
export const copyText = (str: string) => {
  const ipt = document.createElement('input')
  ipt.value = str
  document.body.appendChild(ipt)
  ipt.select()
  const copyRes = document.execCommand('copy')
  document.body.removeChild(ipt)
  return copyRes
}

/** 浏览器调用拨打电话
 * 
 * @param phoneNumber 
 */
export const call = (phoneNumber: string) => {
  window.location.href = "tel://" + phoneNumber
}