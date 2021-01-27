import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import license from 'rollup-plugin-license'
import typescript from 'rollup-plugin-typescript2'

import pkg from '../package.json'

const versionInfo = `
JParticles v${pkg.version} (https://github.com/Barrior/JParticles)
Copyright 2016-${new Date().getFullYear()} Barrior <Barrior@qq.com>
Released under the MIT License.
`

export default {
  input: {
    'jparticles.all': path.resolve(__dirname, '../src/index.ts'),
  },
  output: {
    dir: 'browser',
    format: 'umd',
    esModule: false,
    name: 'JParticles',
    plugins: [
      license({
        banner: {
          content: versionInfo.trim(),
          commentStyle: 'ignored',
        },
      }),
    ],
  },
  plugins: [
    typescript({
      declaration: false,
      module: 'ESNext',
    }),
    nodeResolve(),
    // terser({
    //   output: {
    //     comments: false,
    //   },
    // }),
  ],
}
