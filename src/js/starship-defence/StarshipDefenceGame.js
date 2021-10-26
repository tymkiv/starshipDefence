import Stats from "stats-js";
import * as PIXI from "pixi.js";
import { throttle } from "underscore";

import BgManager from "./BgManager";
import StarshipManager from "./StarshipManager";
import AsteroidManager from "./AsteroidManager";

export default class StarshipDefenceGame {
	constructor(DOMcontainer) {
		this.DOM = {
			container: DOMcontainer,
		};

		const stats = new Stats();
		stats.showPanel(0);
		document.body.appendChild(stats.dom);
		function animate() {
			stats.begin();
			stats.end();
			requestAnimationFrame(animate);
		}
		requestAnimationFrame(animate);

		this.settings = {
			// all sizes is in procent -> 100 is max
			starshipSizeW: 10,
			starshipSizeH: 20,
			starshipStartPositionX: 50,
			starshipStartPositionY: 85,
			starshipDriftSpeed: 1,
			starshipFriction: 0.05,
			bulletRadius: 0.5,
			bulletSpeed: 1,
			shotThrottleTimeout: 500,
			asteroidSizeW: 10,
			asteroidSizeH: 20,
		};

		this.state = {
			width: null,
			height: null,
			driftX: null,
			keyLeftActive: false,
			keyRightActive: false,
			shotActive: false,
			touches: {
				left: {
					start: null,
					move: null,
					id: null,
				},
				right: {
					id: null,
				},
			},
			eventCallbacks: {
				resize: [],
				load: [],
				progress: [],
				tick: [],
				shot: [],
			},
		};

		this.managers = {
			bg: new BgManager(this),
			starship: new StarshipManager(this),
		};

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
			resolution: window.devicePixelRatio,
			autoDensity: true,
		});
		this.DOM.container.appendChild(this.app.view);

		this.loader = PIXI.Loader.shared;

		// ---- -> EVENT LISTENERS ----

		this.shotHandler = throttle(
			this.onShot.bind(this),
			this.settings.shotThrottleTimeout,
			{ trailing: false }
		);

		window.addEventListener("resize", throttle(this.onResize.bind(this), 300));
		window.addEventListener("keydown", this.onKeydown.bind(this));
		window.addEventListener("keyup", this.onKeyup.bind(this));
		window.addEventListener("pointerdown", this.onPointerdown.bind(this));
		window.addEventListener("pointermove", this.onPointermove.bind(this));
		window.addEventListener("pointerup", this.onPointerup.bind(this));

		// ---- EVENT LISTENERS <- ----
	}

	startLoading() {
		this.loader.add("bg", "../img/background.png");
		this.loader.add("starship", "../img/starship.png");
		this.loader.add("asteroid", "../img/asteroid.png");
		this.loader.add("explosion", "../img/explosion.png");

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
		this.state.eventCallbacks[type] = this.state.eventCallbacks[type].filter(
			(oldCallback) => callback !== oldCallback
		);
	}

	onLoad() {
		this.managers.bg.init(this.loader.resources.bg);
		this.managers.starship.init(this.loader.resources.starship);

		const asteroid = new AsteroidManager(this);
		asteroid.init(
			this.loader.resources.asteroid,
			this.loader.resources.explosion,
			10,
			10
		);

		window.requestAnimationFrame(this.onTick.bind(this));

		this.state.eventCallbacks.load.forEach((callback) => {
			callback();
		});
	}

	onProgress({ progress }) {
		this.state.eventCallbacks.progress.forEach((callback) => {
			callback(progress);
		});
	}

	onTick() {
		if (this.state.shotActive) this.shotHandler();

		this.state.eventCallbacks.tick.forEach((callback) => {
			callback();
		});

		window.requestAnimationFrame(this.onTick.bind(this));
	}

	onShot() {
		this.state.eventCallbacks.shot.forEach((callback) => {
			callback();
		});
	}

	onKeydown({ code }) {
		if (code === "ArrowLeft") {
			this.state.keyLeftActive = true;
			this.state.driftX = "left";
		}
		if (code === "ArrowRight") {
			this.state.keyRightActive = true;
			this.state.driftX = "right";
		}
		if (code === "Space") {
			this.state.shotActive = true;
		}
	}

	onKeyup({ code }) {
		if (code === "ArrowLeft") {
			this.state.keyLeftActive = false;

			if (this.state.driftX === "left")
				this.state.driftX = this.state.keyRightActive ? "right" : "";
		}
		if (code === "ArrowRight") {
			this.state.keyRightActive = false;

			if (this.state.driftX === "right")
				this.state.driftX = this.state.keyLeftActive ? "left" : "";
		}
		if (code === "Space") {
			this.state.shotActive = false;
		}
	}

	onPointerdown(touch) {
		if (touch.pageX < window.innerWidth / 2 && !this.state.touches.left.id) {
			this.state.touches.left.start = touch.pageX;
			this.state.touches.left.id = touch.pointerId;
		}

		if (touch.pageX > window.innerWidth / 2 && !this.state.touches.right.id) {
			this.state.touches.right.id = touch.pointerId;
			this.state.shotActive = true;
		}
	}

	onPointermove(touch) {
		if (touch.pointerId === this.state.touches.left.id) {
			this.state.touches.left.move = touch.pageX;

			if (this.state.touches.left.move > this.state.touches.left.start) {
				this.state.driftX = "right";
			}
			if (this.state.touches.left.move < this.state.touches.left.start) {
				this.state.driftX = "left";
			}
		}
	}

	onPointerup(touch) {
		if (touch.pointerId === this.state.touches.left.id) {
			this.state.touches.left.start = null;
			this.state.touches.left.move = null;
			this.state.touches.left.id = null;

			this.state.driftX = "";
		}

		if (touch.pointerId === this.state.touches.right.id) {
			this.state.touches.right.id = null;
			this.state.shotActive = false;
		}
	}

	onResize() {
		this.updateSize();

		this.app.renderer.resize(this.state.width, this.state.height);

		this.state.eventCallbacks.resize.forEach((callback) => {
			callback();
		});
	}
}
