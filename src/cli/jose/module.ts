

import key from "./key"

export const action = `jose`

export const command = `${action} <resource> <action>`

export const describe = `${action} operations`

const resources = {
  key
}

export const handler = async function (argv) {
  const { resource, action } = argv
  if (resources[resource][action]) {
    resources[resource][action](argv)
  }
}

export const builder = (yargs) => {
  return yargs
    .positional('resource', {
      describe: `The ${action} resource`,
      type: 'string',
    })
    .positional('action', {
      describe: `The operation on the ${action} resource`,
      type: 'string',
    })
}

