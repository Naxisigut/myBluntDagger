/* v1.03 */

/* 获取min~max之间的随机整数 */
export function getRandomNumber(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* 获取min~max之间随机整数的工厂函数 */
export function getRandomNumberFactory(min:number, max:number) {
  return function() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
}

/** 将字符串或整型数字补零至指定位数
 * 
 * @param target 
 * @param length 
 * @returns 
 */
export const zeroPadPre = (target:number | string, length:number = 1) => {
  if(typeof target === 'number')target = target.toString()
  while(target.length < length){
    target = '0' + target
  }
  return target
}

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
export const sanitize2FirstMinus = (val: string) => val.replace(/(?<=.)-/g,'')

/** 保留小数点后的固定位数
 * 
 * @param val 
 * @param digits 要保留的位数 
 * 
 */
export const sanitizeFixedDigits = (val: string, digits: number) => {
  const reg = new RegExp(`(\\.\\d{${digits}})\\d+$`)
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
  isMinusAllowed: boolean,
  isDotAllowed: boolean,
  digits?: number
}

/** 数字字符串的输入处理
 * 
 * @param val 
 * @param option 处理配置
 * - isMinusAllowed 是否允许负数
 * - isDotAllowed 是否允许小数
 * - digits 保留位数，仅在允许小数时生效; 不填则默认保留任意位数
 * @returns 
 */
export const numSanitize = (val: string, option: SanitizeOption)=>{
// export const numSanitize = (val: string, isMinusAllowed: boolean = true, isDotAllowed: boolean = true, digits: number)=>{
  let { isDotAllowed, isMinusAllowed, digits }  = option
  if(digits){
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
    // 保留位数
    if(digits){
      val = sanitizeFixedDigits(val, digits)
    }
  }

  // 还原负号
  return `${isPositive ? '' : '-'}${val}`
}