import * as PIXI from "pixi.js";
import { throttle } from "underscore";

import BgManager from "./BgManager";
import StarshipManager from "./StarshipManager";

export default class StarshipDefenceGame {
	constructor(DOMcontainer) {
		this.DOM = {
			container: DOMcontainer,
		};

		this.state = {
			width: null,
			height: null,
			eventCallbacks: {
				resize: [],
				load: [],
				progress: [],
			},
		};

		this.managers = {
			bg: new BgManager(this),
			starship: new StarshipManager(this),
		};

		this.managersArr = Object.values(this.managers); // for better optimization in RAF and resize

		this.updateSize();

		this.setUp();

		this.startLoading();
	}

	updateSize() {
		this.state.width = this.DOM.container.clientWidth;
		this.state.height = this.DOM.container.clientHeight;
	}

	setUp() {
		this.app = new PIXI.Application({
			width: this.state.width,
			height: this.state.height,
			antialias: true,
			backgroundAlpha: 0,
			resolution: 2, // for test | should be removed
			// resolution: window.devicePixelRatio,
			autoDensity: true,
		});
		this.DOM.container.appendChild(this.app.view);

		this.loader = PIXI.Loader.shared;

		// ---- -> EVENT LISTENERS ----

		window.addEventListener("resize", throttle(this.onResize.bind(this), 300));

		// ---- EVENT LISTENERS <- ----
	}

	startLoading() {
		this.loader.add("bg", "../img/background.png");
		this.loader.add("starship", "../img/starship.png");

		this.loader.load(this.onLoad.bind(this));
		this.loader.onProgress.add(this.onProgress.bind(this));
	}

	addListener(type, callback) {
		if (
			!this.state.eventCallbacks[type] ||
			this.state.eventCallbacks[type].includes(callback)
		)
			return;

		this.state.eventCallbacks[type].push(callback);
	}

	removeListener(type, callback) {
		if (
			!this.state.eventCallbacks[type] ||
			this.state.eventCallbacks[type].includes(callback)
		)
			return;

		this.state.eventCallbacks[type] = this.state.eventCallbacks[type].filter(
			(oldCallback) => callback !== oldCallback
		);
	}

	onLoad() {
		console.log("load");
		this.managers.bg.init(this.loader.resources.bg);
		this.managers.starship.init(this.loader.resources.starship);

		this.state.eventCallbacks.load.forEach((callback) => {
			callback();
		});
	}

	onProgress({ progress }) {
		console.log("progress", progress);

		this.state.eventCallbacks.progress.forEach((callback) => {
			callback();
		});
	}

	onResize() {
		this.updateSize();

		this.app.renderer.resize(this.state.width, this.state.height);

		this.state.eventCallbacks.resize.forEach((callback) => {
			callback();
		});
	}
}
