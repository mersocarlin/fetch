import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: {
    exports: 'default',
    file: pkg.main,
    format: 'cjs',
  },
  external: Object.keys(pkg.dependencies),
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    terser(),
  ],
}
