/* v1.01 */

/* 获取min~max之间的随机整数 */
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* 获取min~max之间随机整数的工厂函数 */
export function getRandomNumberFactory(min, max) {
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