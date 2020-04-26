import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

/**
 * the string separated by the specified separator is converted to hump format
 *
 * @param  str : string    Converted string
 * @param separators ?: string | Array<string>   optional; default: ["-","_"] ; separator or separator good array ["-","_"]；
 * @returns string  return shump format string
 */
function toHumpFormat(str, separators) {
	if (separators == undefined) {
		separators = ['-', '_'];
	} else if (!Array.isArray(separators)) {
		separators = [separators]
	}
	var separatorRexStr = '(' + separators.join('|') + ')' + '+([A-Za-z]?)'
	var separatorRex = new RegExp(separatorRexStr, 'g');
	return str.replace(separatorRex, function (match, p1, p2) {
		return p2.toUpperCase();
	});
}
  
  

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: toHumpFormat(pkg.name),
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
