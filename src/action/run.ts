#!/usr/bin/env node

import * as core from '@actions/core'
import getOpts from './getOptions'
import operationSwitch from './operationSwitch'
import cli from '../cli'

async function run() {
  try {
    if (process.env.GITHUB_ACTION) {
      const opts = getOpts()
      await operationSwitch(opts)
    } else {
      await cli.init()
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
