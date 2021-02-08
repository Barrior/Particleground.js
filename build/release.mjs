import execa from 'execa'
import fs from 'fs'
import path from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const buildDir = path.resolve(__dirname)

const logger = pino({
  prettyPrint: {
    translateTime: 'SYS:HH:MM:ss',
    colorize: true,
  },
})

// check publish branch
const BRANCH_NAME = execa.commandSync('git symbolic-ref HEAD --short')
if (BRANCH_NAME !== 'master') {
  logger.error(
    'Publish command running only on the master branch, please checkout it.'
  )
  process.exit(1)
}

// run auto testing
const pTest = execa.command('yarn test --verbose=false')
pTest.stdout.pipe(process.stdout)
pTest.stderr.pipe(process.stderr)
await pTest

// build package files
await execa.command('yarn build', { stdio: 'inherit' })

// update NPM docs
fs.writeFileSync(
  path.resolve(rootDir, 'README.md'),
  fs.readFileSync(path.resolve(buildDir, 'README_NPM.md'))
)

// info Current version: 3.0.0-beta.0
// New version(optional):
// Set tag(optional):
// @todo input version
// @todo generate changelog

await execa.command('yarn login', { stdio: 'inherit' })
await execa.command('yarn publish', { stdio: 'inherit' })
await execa.command('git checkout .', { stdio: 'inherit' })
