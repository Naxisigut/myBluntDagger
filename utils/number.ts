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
