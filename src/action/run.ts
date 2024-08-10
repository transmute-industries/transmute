#!/usr/bin/env node

import * as core from '@actions/core'

import cli from '../cli'

async function run() {
  try {
    if (process.env.GITHUB_ACTION) {
      console.warn('todo github action')
    } else {
      await cli.init()
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
