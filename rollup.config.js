import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';

export default {
	input: 'src/index.js',
	output: {
		file: 'lib/_axios.min.js',
		format: 'umd',
		name: '_axios'
	},
	plugins: [
		eslint({
			throwOnError: true,
			throwOnWarning: true,
			include: ['src/**'],
			exclude: ['node_modules/**', 'lib/**']
		}),
		babel({
			exclude: 'node_modules/**',
			runtimeHelpers: true
		}),
		uglify()
	]
};
