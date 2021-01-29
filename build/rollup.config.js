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

const common = {
  external: [Base, Mask, utils, events, easing],
  globals: {
    [Base]: 'JParticles.Base',
    [Mask]: 'JParticles.Mask',
    [utils]: 'JParticles.utils',
    [events]: 'JParticles.events',
    [easing]: 'JParticles.easing',
  },
  plugins: [
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
  ],
}

const effects = [
  { filename: 'line', effectName: 'Line' },
  { filename: 'particle', effectName: 'Particle' },
  { filename: 'snow', effectName: 'Snow' },
  { filename: 'wave', effectName: 'Wave' },
  { filename: 'wave-loading', effectName: 'WaveLoading' },
]

const inputs = effects.map(({ filename, effectName }) => {
  return {
    input: path.resolve(__dirname, `../src/${filename}.ts`),
    external: common.external,
    output: {
      file: `browser/${filename}.js`,
      format: 'iife',
      esModule: false,
      name: `JParticles.${effectName}`,
      globals: common.globals,
    },
    plugins: [...common.plugins],
  }
})

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
    plugins: [...common.plugins],
  },
  ...inputs,
]
