import purgeCss from '@fullhuman/postcss-purgecss'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss'
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import tailwind from 'tailwindcss'

const production = process.env.NODE_ENV === "production";

const removeUnusedCss = purgeCss({
	content: ['./src/**/*.html', './src/**/*.svelte'],
	defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
	whitelist: [
		'html',
		'body',
		'a',
		'input',
		'button',
	]
})

export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		dir: 'public'
	},
	plugins: [
		svelte({
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('bundle.css', !production);
			},
			emitCss: true
		}),
		postcss({
			plugins: [
				postcssImport,
				tailwind(),
				autoprefixer,
				production && removeUnusedCss,
			].filter(Boolean),
			extract: 'bundle.css',
			sourceMap: !production,
			minimize: production
		}),
		resolve({
			browser: true,
		}),
		commonjs(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
