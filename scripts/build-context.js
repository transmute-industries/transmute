/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
const contextsUrls = [
  'https://www.w3.org/2018/credentials/v1',
  'https://www.w3.org/ns/credentials/v2',
  'https://www.w3.org/ns/credentials/examples/v2'
];

(async () => {
  let index = ''
  const contexts = {}
  for (const contextUrl of contextsUrls) {
    const response = await axios.get(contextUrl, {
      transformResponse: r => r
    })
    const urlContentHash = crypto
      .createHash('sha256')
      .update(response.data)
      .digest('hex')
    fs.writeFileSync(`./src/vcwg/graph/contexts/${urlContentHash}.json`, response.data)
    const context = `import { default as c${urlContentHash} } from "./${urlContentHash}.json"`
    index += `${context}\n`
    contexts[contextUrl] = `c${urlContentHash}`
  }
  index += `export const contexts = {\n`
  for (let [url, urlContentHash] of Object.entries(contexts)) {
    index += `  "${url}": ${urlContentHash},\n`
  }
  index += `}\n`
  fs.writeFileSync(`./src/vcwg/graph/contexts/index.ts`, index)
})()