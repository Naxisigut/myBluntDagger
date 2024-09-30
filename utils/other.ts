/* v1.01 */

/** 阻塞指定时间
 * 
 * @param ms 时间，单位毫秒 
 */
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

