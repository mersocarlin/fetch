import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: {
    // https://rollupjs.org/guide/en/#outputexports
    exports: 'default',
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: Object.keys(pkg.dependencies),
  plugins: [typescript(), terser()],
}
