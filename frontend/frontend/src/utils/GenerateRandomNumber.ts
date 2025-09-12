/**
 * 生成一个10位的随机数字字符串
 * @returns {string} 10位随机数字
 */
export function generateRandom10DigitNumber(): string {
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}
