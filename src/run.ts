#!/usr/bin/env node

import * as core from '@actions/core'
import getOpts from './getOptions'
import operationSwitch from './operationSwitch'
import cli from './cli'

async function run() {
  try {
    const done = await cli.init()
    if (!done) {
      const opts = getOpts()
      await operationSwitch(opts)
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
