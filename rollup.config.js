import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';


const babelConfig = {
    presets: [['@babel/preset-env', { modules: false }]],
    babelHelpers: 'bundled',
};

export default [
    {
        input: 'src/flexidatepicker.js',
        output: {
            file: 'dist/flexidatepicker.umd.min.js',
            format: 'umd',
            name: 'FlexiDatepicker',
            sourcemap: true
        },
        plugins: [
            babel(babelConfig),
            terser()
        ]
    },
    {
        input: 'src/flexidatepicker.css',
        output: {
            file: 'dist/flexidatepicker.min.css',
            format: 'es',
        },
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                plugins: [
                    cssnano({
                        preset: 'default',
                    }),
                ],
            }),
        ],
    },
    {
        input: 'src/flexidatepicker.js',
        output: {
            file: 'dist/flexidatepicker.esm.min.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            babel(babelConfig),
            terser()
        ]
    }
];