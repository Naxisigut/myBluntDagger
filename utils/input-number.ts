
/* v1.05 20231116 */

/** 只保留字符串内的数字
 * 
 * @param val 
 * @returns 
 */
export const sanitize2Number = (val:string) => val.replace(/[^0-9]/g, '')

/** 只保留字符串内的数字，小数点
 * 
 * @param val 
 * @returns 
 */
export const sanitize2NumberDot = (val:string) => val.replace(/[^0-9.]/g, '')

/** 只保留字符串内的数字，负号
 * 
 * @param val 
 * @returns 
 */
export const sanitize2NumberMinus = (val:string) => val.replace(/[^0-9-]/g, '')

/** 只保留字符串内的数字，负号，小数点
 * 
 * @param val 
 * @returns 
 */
export const sanitize2NumberMinusDot = (val:string) => val.replace(/[^0-9.-]/g, '')

/** 将字符串最前面的连续0+数字替换为该数字
 *  如 0001 => 1
 * @param val 
 * @returns 
 */
export const sanitizeSequentialZero = (val: string) => val.replace(/^0+(?=\d)/, '')

/** 只保留字符串内的首个小数点
 *  如 1.2.3 => 1.23
 * @param val 
 * @returns 
 */
export const sanitize2OneDot = (val: string) => val.replace('.','$#$').replace(/\./g,'').replace('$#$','.')

/** 只保留字符串的位于最开头的负号
 * 如 -1-2 => -12, 1-2 => 12
 * @param val 
 * @returns 
 */
export const sanitize2FirstMinus = (val: string) => {
  const regex = /^(-)|-/g; // 匹配开头的负号和其他负号
  return val.replace(regex, '$1'); // 替换其他负号为空字符串，保留开头的负号
}

/** 保留小数点后的固定位数
 * 
 * @param val 
 * @param digits 要保留的位数 
 * 
 */
export const sanitizeFixedDigits = (val: string, digits: number) => {
  if(digits <= 0)throw new Error('digits should be positive int')
  if(digits.toString().includes('.'))throw new Error('digits should be positive int')
  const reg = new RegExp(`(\\.\\d{${digits}})\\d+$`) // 动态生成正则
  return val.replace(reg, '$1') 
}

/** 限定字符串为非负整数
 * 
 * @param val 
 * @returns 
 */
export const toNonNegativeInt = (val:string)=> sanitizeSequentialZero(sanitize2Number(val));

/** 限定输入非负数
 * 
 * @param val 
 * @returns 
 */
export const toNonNegative = (val:string)=> sanitize2OneDot(sanitizeSequentialZero(sanitize2NumberDot(val)));

/** 限定输入整数
 * 
 * @param val 
 * @returns 
 */
export const toInt = (val:string)=>{
  const res1 = sanitize2FirstMinus(sanitize2NumberMinus(val))
  let isPositive = !res1.startsWith('-')
  let positivePart = res1.startsWith('-') ? res1.slice(1) : res1
  return `${isPositive ? '' : '-'}${sanitizeSequentialZero(positivePart)}`
}

/** 限定输入数字
 * 
 * @param val 
 * @returns 
 */
export const toNumber = (val:string)=>{
  const res1 = sanitize2FirstMinus(sanitize2NumberMinusDot(val))
  let isPositive = !res1.startsWith('-')
  let positivePart = res1.startsWith('-') ? res1.slice(1) : res1
  return `${isPositive ? '' : '-'}${sanitize2OneDot(sanitizeSequentialZero(positivePart))}`
}

type SanitizeOption = {
  isMinusAllowed?: boolean,
  isDotAllowed?: boolean,
  digits?: number
}

/** 数字字符串的输入处理
 * 
 * @param val 
 * @param option 处理配置
 * - isMinusAllowed 是否允许负数,  不传默认为false
 * - isDotAllowed 是否允许小数，不传默认为false
 * - digits 保留位数，仅在允许小数时生效，小于1时保留1位; 不填则默认保留任意位数。
 * @returns 
 */
export const numSanitize = (val: string | number, option: SanitizeOption = {})=>{
  if(typeof val === 'number')return val
  let { isDotAllowed, isMinusAllowed, digits }  = option
  if(digits !== undefined){
    digits = Math.max(1, digits)
    digits = parseInt(digits.toString())
  }

  // 过滤
  if(isDotAllowed && isMinusAllowed){
    val = sanitize2NumberMinusDot(val)
  }else if(isDotAllowed){
    val = sanitize2NumberDot(val)
  }else if(isMinusAllowed){
    val = sanitize2NumberMinus(val)  
  }else{
    val = sanitize2Number(val)
  }

  // 处理负号：只保留位于首位的负号, 并将其提取出来
  if(isMinusAllowed){
    val = sanitize2FirstMinus(val)
  }
  let isPositive = !val.startsWith('-')
  val = val.startsWith('-') ? val.slice(1) : val
  // 处理字符串首连续0
  val = sanitizeSequentialZero(val)
  // 处理小数点
  if(isDotAllowed){
    val = sanitize2OneDot(val)
    if(val.startsWith('.'))val = '0' + val
    // 保留位数
    if(digits !== undefined){
      val = sanitizeFixedDigits(val, digits)
    }
  }

  // 还原负号
  return `${isPositive ? '' : '-'}${val}`
}


export function iptNumFilter(val, option = {}){
  function createCtx(source, option){
    const ctx = {
      source,
      dotAllowed: false,
      minusAllowed: false,
      digits: 0,
      
      dot: false,
      minus: false,
      currentDigits: 0,
      result: ''
    }
    ctx.dotAllowed = !!option.isDotAllowed
    ctx.minusAllowed = !!option.isMinusAllowed
    ctx.digits = option.digits
    return ctx
  }
  const ctx = createCtx(val, option)
  


}

