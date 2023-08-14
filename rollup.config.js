import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'cjs'
    },
    plugins: [commonjs(), typescript()],
    external: [
        'acorn',
        'acorn-jsx',
        'cjs-module-lexer',
        'es-module-lexer',
        'fs',
        'magic-string',
        'path',
        'typescript',
    ]
};
