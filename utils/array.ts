/* 获取数组内的随机元素 */
export function getRandomElement(array: Array<any>) {
  let randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}