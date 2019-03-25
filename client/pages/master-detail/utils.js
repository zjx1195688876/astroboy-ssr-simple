/**
 * 销量数据格式化，如果销量>9999,显示1.2w，1.3w
 * @param {number} salesNum
 * @returns {string || number}
 */
export function formatSalesNum(salesNum = 0) {
  if (salesNum > 9999) {
    if (salesNum % 10000 === 0) {
      return `${salesNum / 10000}w`;
    } else {
      const tmpNum = (salesNum / 10000).toString().split('.');
      return `${tmpNum[0]}.${tmpNum[1].slice(0, 1)}w`;
    }
  }
  return salesNum;
}