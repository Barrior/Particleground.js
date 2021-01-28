import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'

import pkg from '../package.json'

const versionInfo = `
/*!
 * JParticles v${pkg.version} (https://github.com/Barrior/JParticles)
 * Copyright 2016-${new Date().getFullYear()} Barrior <Barrior@qq.com>
 * Released under the MIT License.
 */
`

const utils = path.resolve(__dirname, '../src/utils/')
const Base = path.resolve(__dirname, '../src/common/base.ts')
const Mask = path.resolve(__dirname, '../src/common/mask.ts')
const events = path.resolve(__dirname, '../src/common/events.ts')
const easing = path.resolve(__dirname, '../src/common/easing.ts')
const comExternal = [Base, Mask, utils, events, easing]
const comGlobals = {
  [Base]: 'JParticles.Base',
  [Mask]: 'JParticles.Mask',
  [utils]: 'JParticles.utils',
  [events]: 'JParticles.events',
  [easing]: 'JParticles.easing',
}

const commonPlugins = [
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        declaration: false,
        module: 'ESNext',
      },
    },
  }),
  nodeResolve(),
  // terser({
  //   output: {
  //     comments: false,
  //   },
  // }),
]

export default [
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: {
      file: 'browser/jparticles.all.js',
      format: 'umd',
      esModule: false,
      name: 'JParticles',
      exports: 'named',
      banner: versionInfo.trim(),
    },
    plugins: [...commonPlugins],
  },
  {
    input: path.resolve(__dirname, '../src/line.ts'),
    external: comExternal,
    output: {
      file: 'browser/line.js',
      format: 'iife',
      esModule: false,
      name: 'JParticles.Line',
      globals: comGlobals,
    },
    plugins: [...commonPlugins],
  },
]
