/**
 * note:
 *     if (!remainder.eq(0)) {
 *      const minIndex = getMinIndex(splitCombined.map(v => v.amount))
 *    const remainderIndex = minIndex.length === 1 ? minIndex[0] : randomPick(minIndex)
 *
 *    return splitCombined.map((v, i) => {
 *      return {
 *        ...v,
 *        amount: i === remainderIndex ? v.amount.plus(remainder) : v.amount,
 *        takeRemainder: i === remainderIndex
 *      }
 *    })
 *  }
 *  return splitCombined.map((v) => {
 *    return {
 *      ...v,
 *      amount: v.amount,
 *      takeRemainder: false
 *    }
 *  })
 */
export const randomPick = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)];
