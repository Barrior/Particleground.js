import execa from 'execa'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import logger from './logger'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const buildDir = path.resolve(__dirname)

// Check branch and status
const BRANCH_NAME = execa.commandSync('git symbolic-ref HEAD --short')
if (BRANCH_NAME !== 'master') {
  logger.error(
    'Publish command running only on the master branch, please checkout it.'
  )
  process.exit(1)
}

// Run auto testing
await execa.command('yarn test --verbose=false', { stdio: 'inherit' })

// info Current version: 3.0.0-beta.0
// New version(optional):
// Set tag(optional):

// @todo flow:
//   1. edit version field of package.json (version are not equal)
//   2. build and publish to NPM
//   3. generate changelog?
//   4. commit version changes [feat(release): v3.0.0-beta.0]
//   5. generate git tag
//   6. push to remote

// Discard changes when emit error
process.on('uncaughtException', () => {
  execa.commandSync('git checkout .', { stdio: 'inherit' })
})

// Build package files
await execa.command('yarn build', { stdio: 'inherit' })

// Update NPM docs
fs.writeFileSync(
  path.resolve(rootDir, 'README.md'),
  fs.readFileSync(path.resolve(buildDir, 'README_NPM.md'))
)

await execa.command('yarn login', { stdio: 'inherit' })
await execa.command('yarn publish --tag next', { stdio: 'inherit' })
await execa.command('git checkout .', { stdio: 'inherit' })
