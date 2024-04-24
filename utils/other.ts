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

/** 阻塞指定时间
 * 
 * @param ms 时间，单位毫秒 
 */
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))


/** 以JSON解析后输出至工作台
 * 
 * @param obj 解析对象
 * @param tag 输出标签
 */
export const jsonLog = (obj: any, tag: string) => {
  const output = obj === undefined ? undefined : JSON.parse(JSON.stringify(obj))
  console.log(
    `%cJsonLog${tag ? `%c${tag}` : ''}`, 
    'background: #00cc00; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 5px',
    tag ? 'background: #1475B2; color: #fff; border-radius: 0 3px 3px 0; padding: 2px 5px' : '',
    output
  );
}