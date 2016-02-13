(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/batten-js/src/Solarfield/Batten/Environment',
			[
				'solarfield/ok-kit-js/src/Solarfield/Ok/ok',
				'solarfield/batten-js/src/Solarfield/Batten/Options'
			],
			factory
		);
	}

	else {
		factory(
			Solarfield.Ok,
			Solarfield.Batten.Options
		);
	}
})
(function (Ok, Options) {
	"use strict";

	/**
	 * @constructor
	 * @abstract
	 */
	var Environment = function () {
		throw Error("ABSTRACT");
	};

	/**
	 * @private
	 * @static
	 */
	Environment._be_baseChain = null;

	Environment.init = function (aOptions) {
		var options = Ok.objectAssign({
			baseChain: null,
			vars: {}
		}, aOptions);

		var vars;

		this._be_baseChain = options.baseChain;

		vars = this.getVars();
		Object.keys(options.vars).forEach(function (k) {
			vars.set(k, options.vars[k]);
		});
	};

	/**
	 * @static
	 * @returns {object}
	 */
	Environment.getBaseChain = function () {
		return this._be_baseChain;
	};

	Environment.getVars = function () {
		if (!this._be_vars) {
			this._be_vars = new Options({
				readOnly:true
			});
		}

		return this._be_vars;
	};

	Ok.defineNamespace('Solarfield.Batten');
	return Solarfield.Batten.Environment = Environment;
});
