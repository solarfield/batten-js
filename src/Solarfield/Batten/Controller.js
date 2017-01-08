(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(
			'solarfield/batten-js/src/Solarfield/Batten/Controller',
			[
				'app/App/Environment',
				'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
				'solarfield/ok-kit-js/src/Solarfield/Ok/StringUtils',
				'solarfield/batten-js/src/Solarfield/Batten/ComponentResolver',
				'solarfield/batten-js/src/Solarfield/Batten/ControllerPlugins',
				'solarfield/ok-kit-js/src/Solarfield/Ok/EventTarget',
				'solarfield/batten-js/src/Solarfield/Batten/Model'
			],
			factory
		);
	}

	else {
		factory(
			App.Environment,
			Solarfield.Ok.ObjectUtils,
			Solarfield.Ok.StringUtils,
			Solarfield.Batten.ComponentResolver,
			Solarfield.Batten.ControllerPlugins,
			Solarfield.Ok.EventTarget,
			Solarfield.Batten.Model
		);
	}
})
(function (Environment, ObjectUtils, StringUtils, ComponentResolver, ControllerPlugins, EvtTarget, Model) {
	"use strict";

	/**
	 * @class Solarfield.Batten.Controller
	 * @param {String} aCode
	 * @param {Object} aOptions
	 */
	const Controller = function (aCode, aOptions) {
		this._bc_model = null;
		this._bc_code = aCode+'';
		this._bc_plugins = null;
		this._bc_eventTarget = new EvtTarget();
	};

	Controller.boot = function (aInfo) {
		const controller = this.fromCode(aInfo.moduleCode, aInfo.controllerOptions);
		controller.init();
		return controller;
	};

	Controller.bail = function (aEx) {
		Environment.getLogger().error('Bailed.', {
			exception: aEx
		});
	};

	/**
	 * @static
	 * @returns {Solarfield.Batten.ComponentResolver}
	 */
	Controller.getComponentResolver = function () {
		return new ComponentResolver();
	};

	/**
	 * Gets the MVC chain for the specified module code.
	 * @returns {object|null}
	 * @static
	 */
	Controller.getChain = function (aModuleCode) {
		const chain = ObjectUtils.clone(App.Environment.getBaseChain());

		if (aModuleCode != null) {
			chain['module'] = {
				namespace: 'App.Modules.' + aModuleCode
			};
		}

		return chain;
	};

	/**
	 * Creates an instance of the appropriate module class.
	 * @param {String} aCode
	 * @param {Object=} aOptions
	 * @returns {Solarfield.Batten.Controller}
	 * @static
	 */
	Controller.fromCode = function (aCode, aOptions) {
		const component = this.getComponentResolver().resolveComponent(
			this.getChain(aCode),
			'Controller'
		);

		if (!component) {
			throw new Error(
				"Could not resolve Controller component for module '" + aCode + "'."
			);
		}

		return new component.classObject(aCode, aOptions);
	};

	/**
	 * @protected
	 */
	Controller.prototype.resolvePlugins = function () {

	};

	/**
	 * @param {Object} aEvent
	 * @param {Object=} aOptions
	 * @protected
	 * @see Solarfield.Ok.EventTarget::dispatchEvent()
	 */
	Controller.prototype.dispatchEvent = function (aEvent, aOptions) {
		this._bc_eventTarget.dispatchEvent(this, aEvent, aOptions);
	};

	/**
	 * @protected
	 * @param {Solarfield.Ok.ExtendableEventManager} aExtendable
	 * @param {Object=} aOptions Call time options.
	 * @see Solarfield.Ok.EventTarget::dispatchExtendableEvent()
	 */
	Controller.prototype.dispatchExtendableEvent = function (aExtendable, aOptions) {
		return this._bc_eventTarget.dispatchExtendableEvent(this, aExtendable, aOptions);
	};

	Controller.prototype.addEventListener = function (aEventType, aListener) {
		this._bc_eventTarget.addEventListener(aEventType, aListener);
	};

	Controller.prototype.getPlugins = function () {
		if (!this._bc_plugins) {
			this._bc_plugins = new ControllerPlugins(this);
		}

		return this._bc_plugins;
	};

	Controller.prototype.getModel = function () {
		if (!this._bc_model) {
			this._bc_model = new Model();
		}

		return this._bc_model;
	};

	Controller.prototype.connect = function () {
		const controller = this;

		return new Promise(function (resolve, reject) {
			function handleDomReady() {
				document.removeEventListener('DOMContentLoaded', handleDomReady);

				Promise.resolve(controller.hookup())
				.then(function () {resolve()})
				.catch(function (ex) {reject(ex)});
			}

			if (self.document && ['interactive', 'complete'].includes(document.readyState)) {
				handleDomReady();
			}

			else {
				document.addEventListener('DOMContentLoaded', handleDomReady);
			}
		});
	};

	Controller.prototype.hookup = function () {
		return Promise.resolve();
	};

	Controller.prototype.run = function () {
		this.doTask();
	};

	Controller.prototype.doTask = function () {

	};

	Controller.prototype.init = function () {
		this.resolvePlugins();
	};

	Controller.prototype.getCode = function () {
		return this._bc_code;
	};

	Controller.prototype.handleException = function (aEx) {
		Environment.getLogger().error(''+aEx, {
			exception: aEx
		});
	};

	ObjectUtils.defineNamespace('Solarfield.Batten');
	return Solarfield.Batten['Controller'] = Controller;
});
