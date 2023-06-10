/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs');
const axios = require('axios');
const contextsUrls = [
  'https://www.w3.org/ns/credentials/v2',
  'https://www.w3.org/2018/credentials/v1',
  'https://w3id.org/security/data-integrity/v1',
  'https://w3id.org/vc-revocation-list-2020/v1',
  'https://w3id.org/traceability/v1',
];

(async ()=>{
  console.log('💀 @context drift...');
  const contexts = {}
  for (const contextUrl of contextsUrls){
    const response = await axios.get(contextUrl)
    contexts[contextUrl] = response.data
  }
  fs.writeFileSync(`./src/api/rdf/contexts/contexts.json`, Buffer.from(JSON.stringify(contexts)))
})()