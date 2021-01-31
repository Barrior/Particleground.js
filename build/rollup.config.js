import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'

export default [
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      esModule: false,
    },
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext',
            // rootDir: '.',
          },
        },
      }),
      nodeResolve(),
    ],
  },
]
