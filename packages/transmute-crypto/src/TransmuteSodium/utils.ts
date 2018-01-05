const util = require('ethereumjs-util')

export const hexToAscii = (value: string) => {
  return util.toAscii(value).replace(/\u0000/g, '')
}
