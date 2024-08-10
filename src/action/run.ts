#!/usr/bin/env node

import * as core from '@actions/core'

import cli from '../cli'

async function run() {
  if (process.env.GITHUB_ACTION) {
    try {
      console.warn('todo github action')
    } catch (error) {
      core.setFailed((error as Error).message)
    }
  } else {
    await cli.init()
  }
}

run()
