/* v1.01 */

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

/** 格式化时间
 * 
 */
export const formatTime = (date: Date, formatStr: string) => {
  const formatType = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  }
  return formatStr.replace(
    /Y+|M+|D+|h+|m+|s+/g,
    target => (new Array(target.length).join('0') + formatType[target[0]]).substr(-target.length)
  )
}