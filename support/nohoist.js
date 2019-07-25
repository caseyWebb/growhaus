#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const fs = require('fs')
const path = require('path')
const isDocker = require('is-docker')

if (isDocker()) {
  const pkgJsonPath = path.resolve(__dirname, '../package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath))
  pkg.workspaces.nohoist.push('**')
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg))
} else {
  console.error('This script is only intended to be used with Docker')
  process.exitCode = 1
}
