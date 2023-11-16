/* v1.05 20231116 */

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
 * 1 -> ${length * 0}1
 * @param target string | number
 * @param length number
 * @returns string
 */
export const zeroPadPre = (target:number | string, length:number = 1) => {
  if(typeof target === 'number')target = target.toString()
  while(target.length < length){
    target = '0' + target
  }
  return target
}

/** 判断输入是否为一个整数
 * 
 * @param val 
 * @returns boolean 
 */
export function isInteger(val) {
  return Math.floor(val) === val
}

/* 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
export function toInteger(floatNum) {
  var ret = {times: 1, num: 0}
  if (isInteger(floatNum)) {
      ret.num = floatNum
      return ret
  }
  var strfi  = floatNum + ''
  var dotPos = strfi.indexOf('.')
  var len    = strfi.substr(dotPos+1).length
  var times  = Math.pow(10, len)
  var intNum = Number(floatNum.toString().replace('.',''))
  ret.times  = times
  ret.num    = intNum
  return ret
}

/** 乘法（避免浮点运算精度丢失）
 * 
 * @param a 
 * @param b 
 * @returns number
 */
export function add(a:number, b:number){
  let { num: n1, times: t1 } = toInteger(a)
  let { num: n2, times: t2 } = toInteger(b)
  let tmax = t1 > t2 ? t1 : t2
  let result = 0
  if (t1 === t2) { // 两个小数位数相同
    result = n1 + n2
  } else if (t1 > t2) { // o1 小数位 大于 o2
    result = n1 + n2 * (t1 / t2)
  } else { // o1 小数位 小于 o2
    result = n1 * (t2 / t1) + n2
  }
  return result / tmax
}

export function subtract(a:number, b:number){
  let { num: n1, times: t1 } = toInteger(a)
  let { num: n2, times: t2 } = toInteger(b)
  let tmax = t1 > t2 ? t1 : t2
  let result = 0
  if (t1 === t2) {
    result = n1 - n2
  } else if (t1 > t2) {
      result = n1 - n2 * (t1 / t2)
    } else {
      result = n1 * (t2 / t1) - n2
  }
  return result / tmax
}

export function multiply(a:number, b:number){
  let { num: n1, times: t1 } = toInteger(a)
  let { num: n2, times: t2 } = toInteger(b)
  let result = (n1 * n2) / (t1 * t2)
  return result
}

export function divide(a:number, b:number){
  let { num: n1, times: t1 } = toInteger(a)
  let { num: n2, times: t2 } = toInteger(b)
  let result = (n1 / n2) * (t2 / t1)
  return result
}