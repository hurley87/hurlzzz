(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var exports;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/risul:accounting/lib/accounting.js                                                        //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
/*!                                                                                                   // 1
 * accounting.js v0.4.2                                                                               // 2
 * Copyright 2014 Open Exchange Rates                                                                 // 3
 *                                                                                                    // 4
 * Freely distributable under the MIT license.                                                        // 5
 * Portions of accounting.js are inspired or borrowed from underscore.js                              // 6
 *                                                                                                    // 7
 * Full details and documentation:                                                                    // 8
 * http://openexchangerates.github.io/accounting.js/                                                  // 9
 */                                                                                                   // 10
                                                                                                      // 11
(function(root, undefined) {                                                                          // 12
                                                                                                      // 13
	/* --- Setup --- */                                                                                  // 14
                                                                                                      // 15
	// Create the local library object, to be exported or referenced globally later                      // 16
	var lib = {};                                                                                        // 17
                                                                                                      // 18
	// Current version                                                                                   // 19
	lib.version = '0.4.1';                                                                               // 20
                                                                                                      // 21
                                                                                                      // 22
	/* --- Exposed settings --- */                                                                       // 23
                                                                                                      // 24
	// The library's settings configuration object. Contains default parameters for                      // 25
	// currency and number formatting                                                                    // 26
	lib.settings = {                                                                                     // 27
		currency: {                                                                                         // 28
			symbol : "$",		// default currency symbol is '$'                                                   // 29
			format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)             // 30
			decimal : ".",		// decimal point separator                                                         // 31
			thousand : ",",		// thousands separator                                                            // 32
			precision : 2,		// decimal places                                                                  // 33
			grouping : 3		// digit grouping (not implemented yet)                                              // 34
		},                                                                                                  // 35
		number: {                                                                                           // 36
			precision : 0,		// default precision on numbers is 0                                               // 37
			grouping : 3,		// digit grouping (not implemented yet)                                             // 38
			thousand : ",",                                                                                    // 39
			decimal : "."                                                                                      // 40
		}                                                                                                   // 41
	};                                                                                                   // 42
                                                                                                      // 43
                                                                                                      // 44
	/* --- Internal Helper Methods --- */                                                                // 45
                                                                                                      // 46
	// Store reference to possibly-available ECMAScript 5 methods for later                              // 47
	var nativeMap = Array.prototype.map,                                                                 // 48
		nativeIsArray = Array.isArray,                                                                      // 49
		toString = Object.prototype.toString;                                                               // 50
                                                                                                      // 51
	/**                                                                                                  // 52
	 * Tests whether supplied parameter is a string                                                      // 53
	 * from underscore.js                                                                                // 54
	 */                                                                                                  // 55
	function isString(obj) {                                                                             // 56
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));                                     // 57
	}                                                                                                    // 58
                                                                                                      // 59
	/**                                                                                                  // 60
	 * Tests whether supplied parameter is a string                                                      // 61
	 * from underscore.js, delegates to ECMA5's native Array.isArray                                     // 62
	 */                                                                                                  // 63
	function isArray(obj) {                                                                              // 64
		return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';                // 65
	}                                                                                                    // 66
                                                                                                      // 67
	/**                                                                                                  // 68
	 * Tests whether supplied parameter is a true object                                                 // 69
	 */                                                                                                  // 70
	function isObject(obj) {                                                                             // 71
		return obj && toString.call(obj) === '[object Object]';                                             // 72
	}                                                                                                    // 73
                                                                                                      // 74
	/**                                                                                                  // 75
	 * Extends an object with a defaults object, similar to underscore's _.defaults                      // 76
	 *                                                                                                   // 77
	 * Used for abstracting parameter handling from API methods                                          // 78
	 */                                                                                                  // 79
	function defaults(object, defs) {                                                                    // 80
		var key;                                                                                            // 81
		object = object || {};                                                                              // 82
		defs = defs || {};                                                                                  // 83
		// Iterate over object non-prototype properties:                                                    // 84
		for (key in defs) {                                                                                 // 85
			if (defs.hasOwnProperty(key)) {                                                                    // 86
				// Replace values with defaults only if undefined (allow empty/zero values):                      // 87
				if (object[key] == null) object[key] = defs[key];                                                 // 88
			}                                                                                                  // 89
		}                                                                                                   // 90
		return object;                                                                                      // 91
	}                                                                                                    // 92
                                                                                                      // 93
	/**                                                                                                  // 94
	 * Implementation of `Array.map()` for iteration loops                                               // 95
	 *                                                                                                   // 96
	 * Returns a new Array as a result of calling `iterator` on each array value.                        // 97
	 * Defers to native Array.map if available                                                           // 98
	 */                                                                                                  // 99
	function map(obj, iterator, context) {                                                               // 100
		var results = [], i, j;                                                                             // 101
                                                                                                      // 102
		if (!obj) return results;                                                                           // 103
                                                                                                      // 104
		// Use native .map method if it exists:                                                             // 105
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);                          // 106
                                                                                                      // 107
		// Fallback for native .map:                                                                        // 108
		for (i = 0, j = obj.length; i < j; i++ ) {                                                          // 109
			results[i] = iterator.call(context, obj[i], i, obj);                                               // 110
		}                                                                                                   // 111
		return results;                                                                                     // 112
	}                                                                                                    // 113
                                                                                                      // 114
	/**                                                                                                  // 115
	 * Check and normalise the value of precision (must be positive integer)                             // 116
	 */                                                                                                  // 117
	function checkPrecision(val, base) {                                                                 // 118
		val = Math.round(Math.abs(val));                                                                    // 119
		return isNaN(val)? base : val;                                                                      // 120
	}                                                                                                    // 121
                                                                                                      // 122
                                                                                                      // 123
	/**                                                                                                  // 124
	 * Parses a format string or object and returns format obj for use in rendering                      // 125
	 *                                                                                                   // 126
	 * `format` is either a string with the default (positive) format, or object                         // 127
	 * containing `pos` (required), `neg` and `zero` values (or a function returning                     // 128
	 * either a string or object)                                                                        // 129
	 *                                                                                                   // 130
	 * Either string or format.pos must contain "%v" (value) to be valid                                 // 131
	 */                                                                                                  // 132
	function checkCurrencyFormat(format) {                                                               // 133
		var defaults = lib.settings.currency.format;                                                        // 134
                                                                                                      // 135
		// Allow function as format parameter (should return string or object):                             // 136
		if ( typeof format === "function" ) format = format();                                              // 137
                                                                                                      // 138
		// Format can be a string, in which case `value` ("%v") must be present:                            // 139
		if ( isString( format ) && format.match("%v") ) {                                                   // 140
                                                                                                      // 141
			// Create and return positive, negative and zero formats:                                          // 142
			return {                                                                                           // 143
				pos : format,                                                                                     // 144
				neg : format.replace("-", "").replace("%v", "-%v"),                                               // 145
				zero : format                                                                                     // 146
			};                                                                                                 // 147
                                                                                                      // 148
		// If no format, or object is missing valid positive value, use defaults:                           // 149
		} else if ( !format || !format.pos || !format.pos.match("%v") ) {                                   // 150
                                                                                                      // 151
			// If defaults is a string, casts it to an object for faster checking next time:                   // 152
			return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {                     // 153
				pos : defaults,                                                                                   // 154
				neg : defaults.replace("%v", "-%v"),                                                              // 155
				zero : defaults                                                                                   // 156
			};                                                                                                 // 157
                                                                                                      // 158
		}                                                                                                   // 159
		// Otherwise, assume format was fine:                                                               // 160
		return format;                                                                                      // 161
	}                                                                                                    // 162
                                                                                                      // 163
                                                                                                      // 164
	/* --- API Methods --- */                                                                            // 165
                                                                                                      // 166
	/**                                                                                                  // 167
	 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value     // 168
	 * Alias: `accounting.parse(string)`                                                                 // 169
	 *                                                                                                   // 170
	 * Decimal must be included in the regular expression to match floats (defaults to                   // 171
	 * accounting.settings.number.decimal), so if the number uses a non-standard decimal                 // 172
	 * separator, provide it as the second argument.                                                     // 173
	 *                                                                                                   // 174
	 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)                                        // 175
	 *                                                                                                   // 176
	 * Doesn't throw any errors (`NaN`s become 0) but this may change in future                          // 177
	 */                                                                                                  // 178
	var unformat = lib.unformat = lib.parse = function(value, decimal) {                                 // 179
		// Recursively unformat arrays:                                                                     // 180
		if (isArray(value)) {                                                                               // 181
			return map(value, function(val) {                                                                  // 182
				return unformat(val, decimal);                                                                    // 183
			});                                                                                                // 184
		}                                                                                                   // 185
                                                                                                      // 186
		// Fails silently (need decent errors):                                                             // 187
		value = value || 0;                                                                                 // 188
                                                                                                      // 189
		// Return the value as-is if it's already a number:                                                 // 190
		if (typeof value === "number") return value;                                                        // 191
                                                                                                      // 192
		// Default decimal point comes from settings, but could be set to eg. "," in opts:                  // 193
		decimal = decimal || lib.settings.number.decimal;                                                   // 194
                                                                                                      // 195
		 // Build regex to strip out everything except digits, decimal point and minus sign:                // 196
		var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),                                            // 197
			unformatted = parseFloat(                                                                          // 198
				("" + value)                                                                                      // 199
				.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives                            // 200
				.replace(regex, '')         // strip out any cruft                                                // 201
				.replace(decimal, '.')      // make sure decimal point is standard                                // 202
			);                                                                                                 // 203
                                                                                                      // 204
		// This will fail silently which may cause trouble, let's wait and see:                             // 205
		return !isNaN(unformatted) ? unformatted : 0;                                                       // 206
	};                                                                                                   // 207
                                                                                                      // 208
                                                                                                      // 209
	/**                                                                                                  // 210
	 * Implementation of toFixed() that treats floats more like decimals                                 // 211
	 *                                                                                                   // 212
	 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present                     // 213
	 * problems for accounting- and finance-related software.                                            // 214
	 */                                                                                                  // 215
	var toFixed = lib.toFixed = function(value, precision) {                                             // 216
		precision = checkPrecision(precision, lib.settings.number.precision);                               // 217
		var power = Math.pow(10, precision);                                                                // 218
                                                                                                      // 219
		// Multiply up by precision, round accurately, then divide and use native toFixed():                // 220
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);                        // 221
	};                                                                                                   // 222
                                                                                                      // 223
                                                                                                      // 224
	/**                                                                                                  // 225
	 * Format a number, with comma-separated thousands and custom precision/decimal places               // 226
	 * Alias: `accounting.format()`                                                                      // 227
	 *                                                                                                   // 228
	 * Localise by overriding the precision and thousand / decimal separators                            // 229
	 * 2nd parameter `precision` can be an object matching `settings.number`                             // 230
	 */                                                                                                  // 231
	var formatNumber = lib.formatNumber = lib.format = function(number, precision, thousand, decimal) {  // 232
		// Resursively format arrays:                                                                       // 233
		if (isArray(number)) {                                                                              // 234
			return map(number, function(val) {                                                                 // 235
				return formatNumber(val, precision, thousand, decimal);                                           // 236
			});                                                                                                // 237
		}                                                                                                   // 238
                                                                                                      // 239
		// Clean up number:                                                                                 // 240
		number = unformat(number);                                                                          // 241
                                                                                                      // 242
		// Build options object from second param (if object) or all params, extending defaults:            // 243
		var opts = defaults(                                                                                // 244
				(isObject(precision) ? precision : {                                                              // 245
					precision : precision,                                                                           // 246
					thousand : thousand,                                                                             // 247
					decimal : decimal                                                                                // 248
				}),                                                                                               // 249
				lib.settings.number                                                                               // 250
			),                                                                                                 // 251
                                                                                                      // 252
			// Clean up precision                                                                              // 253
			usePrecision = checkPrecision(opts.precision),                                                     // 254
                                                                                                      // 255
			// Do some calc:                                                                                   // 256
			negative = number < 0 ? "-" : "",                                                                  // 257
			base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",                            // 258
			mod = base.length > 3 ? base.length % 3 : 0;                                                       // 259
                                                                                                      // 260
		// Format the number:                                                                               // 261
		return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
	};                                                                                                   // 263
                                                                                                      // 264
                                                                                                      // 265
	/**                                                                                                  // 266
	 * Format a number into currency                                                                     // 267
	 *                                                                                                   // 268
	 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)        // 269
	 * defaults: (0, "$", 2, ",", ".", "%s%v")                                                           // 270
	 *                                                                                                   // 271
	 * Localise by overriding the symbol, precision, thousand / decimal separators and format            // 272
	 * Second param can be an object matching `settings.currency` which is the easiest way.              // 273
	 *                                                                                                   // 274
	 * To do: tidy up the parameters                                                                     // 275
	 */                                                                                                  // 276
	var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) { // 277
		// Resursively format arrays:                                                                       // 278
		if (isArray(number)) {                                                                              // 279
			return map(number, function(val){                                                                  // 280
				return formatMoney(val, symbol, precision, thousand, decimal, format);                            // 281
			});                                                                                                // 282
		}                                                                                                   // 283
                                                                                                      // 284
		// Clean up number:                                                                                 // 285
		number = unformat(number);                                                                          // 286
                                                                                                      // 287
		// Build options object from second param (if object) or all params, extending defaults:            // 288
		var opts = defaults(                                                                                // 289
				(isObject(symbol) ? symbol : {                                                                    // 290
					symbol : symbol,                                                                                 // 291
					precision : precision,                                                                           // 292
					thousand : thousand,                                                                             // 293
					decimal : decimal,                                                                               // 294
					format : format                                                                                  // 295
				}),                                                                                               // 296
				lib.settings.currency                                                                             // 297
			),                                                                                                 // 298
                                                                                                      // 299
			// Check format (returns object with pos, neg and zero):                                           // 300
			formats = checkCurrencyFormat(opts.format),                                                        // 301
                                                                                                      // 302
			// Choose which format to use for this value:                                                      // 303
			useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;                    // 304
                                                                                                      // 305
		// Return with currency symbol added:                                                               // 306
		return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	};                                                                                                   // 308
                                                                                                      // 309
                                                                                                      // 310
	/**                                                                                                  // 311
	 * Format a list of numbers into an accounting column, padding with whitespace                       // 312
	 * to line up currency symbols, thousand separators and decimals places                              // 313
	 *                                                                                                   // 314
	 * List should be an array of numbers                                                                // 315
	 * Second parameter can be an object containing keys that match the params                           // 316
	 *                                                                                                   // 317
	 * Returns array of accouting-formatted number strings of same length                                // 318
	 *                                                                                                   // 319
	 * NB: `white-space:pre` CSS rule is required on the list container to prevent                       // 320
	 * browsers from collapsing the whitespace in the output strings.                                    // 321
	 */                                                                                                  // 322
	lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {                    // 323
		if (!list) return [];                                                                               // 324
                                                                                                      // 325
		// Build options object from second param (if object) or all params, extending defaults:            // 326
		var opts = defaults(                                                                                // 327
				(isObject(symbol) ? symbol : {                                                                    // 328
					symbol : symbol,                                                                                 // 329
					precision : precision,                                                                           // 330
					thousand : thousand,                                                                             // 331
					decimal : decimal,                                                                               // 332
					format : format                                                                                  // 333
				}),                                                                                               // 334
				lib.settings.currency                                                                             // 335
			),                                                                                                 // 336
                                                                                                      // 337
			// Check format (returns object with pos, neg and zero), only need pos for now:                    // 338
			formats = checkCurrencyFormat(opts.format),                                                        // 339
                                                                                                      // 340
			// Whether to pad at start of string or after currency symbol:                                     // 341
			padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,             // 342
                                                                                                      // 343
			// Store value for the length of the longest string in the column:                                 // 344
			maxLength = 0,                                                                                     // 345
                                                                                                      // 346
			// Format the list according to options, store the length of the longest string:                   // 347
			formatted = map(list, function(val, i) {                                                           // 348
				if (isArray(val)) {                                                                               // 349
					// Recursively format columns if list is a multi-dimensional array:                              // 350
					return lib.formatColumn(val, opts);                                                              // 351
				} else {                                                                                          // 352
					// Clean up the value                                                                            // 353
					val = unformat(val);                                                                             // 354
                                                                                                      // 355
					// Choose which format to use for this value (pos, neg or zero):                                 // 356
					var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,                    // 357
                                                                                                      // 358
						// Format this value, push into formatted list and save the length:                             // 359
						fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));
                                                                                                      // 361
					if (fVal.length > maxLength) maxLength = fVal.length;                                            // 362
					return fVal;                                                                                     // 363
				}                                                                                                 // 364
			});                                                                                                // 365
                                                                                                      // 366
		// Pad each number in the list and send back the column of numbers:                                 // 367
		return map(formatted, function(val, i) {                                                            // 368
			// Only if this is a string (not a nested array, which would have already been padded):            // 369
			if (isString(val) && val.length < maxLength) {                                                     // 370
				// Depending on symbol position, pad after symbol or at index 0:                                  // 371
				return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
			}                                                                                                  // 373
			return val;                                                                                        // 374
		});                                                                                                 // 375
	};                                                                                                   // 376
                                                                                                      // 377
                                                                                                      // 378
	/* --- Module Definition --- */                                                                      // 379
                                                                                                      // 380
	// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.              // 381
	// Otherwise, just add `accounting` to the global object                                             // 382
	if (typeof exports !== 'undefined') {                                                                // 383
		if (typeof module !== 'undefined' && module.exports) {                                              // 384
			exports = module.exports = lib;                                                                    // 385
		}                                                                                                   // 386
		exports.accounting = lib;                                                                           // 387
	} else if (typeof define === 'function' && define.amd) {                                             // 388
		// Return the library as an AMD module:                                                             // 389
		define([], function() {                                                                             // 390
			return lib;                                                                                        // 391
		});                                                                                                 // 392
	} else {                                                                                             // 393
		// Use accounting.noConflict to restore `accounting` back to its original value.                    // 394
		// Returns a reference to the library's `accounting` object;                                        // 395
		// e.g. `var numbers = accounting.noConflict();`                                                    // 396
		lib.noConflict = (function(oldAccounting) {                                                         // 397
			return function() {                                                                                // 398
				// Reset the value of the root's `accounting` variable:                                           // 399
				root.accounting = oldAccounting;                                                                  // 400
				// Delete the noConflict method:                                                                  // 401
				lib.noConflict = undefined;                                                                       // 402
				// Return reference to the library to re-assign it:                                               // 403
				return lib;                                                                                       // 404
			};                                                                                                 // 405
		})(root.accounting);                                                                                // 406
                                                                                                      // 407
		// Declare `fx` on the root (global/window) object:                                                 // 408
		root['accounting'] = lib;                                                                           // 409
	}                                                                                                    // 410
                                                                                                      // 411
	// Root will be `window` in browser or `global` on the server:                                       // 412
}(this));                                                                                             // 413
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['risul:accounting'] = {};

})();

//# sourceMappingURL=risul_accounting.js.map
