import Stats from "stats-js";
import * as PIXI from "pixi.js";
import { throttle } from "underscore";

import BgManager from "./BgManager";
import StarshipManager from "./StarshipManager";
import AsteroidCreatorManager from "./AsteroidCreatorManager";
import CollisionDetection from "./CollisionDetection";
import MenuManager from "./menu/MenuManager";
import GameManager from "./GameManager";
import GameOver from "./GameOverManager";

export default class StarshipDefenceGame {
	constructor(props = {}) {
		this.DOM = {
			container: props.DOMcontainer,
			menuToggler: props.menuToggler,
			menuWrapper: props.menuWrapper,
			restartBtn: props.restartBtn,
			defaultGameBtn: props.defaultGameBtn,
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
			shotThrottleTimeout: 100,
			asteroidSizeW: 5,
			asteroidSizeH: 10,
			asteroidSpeed: 0.5,
			// in ticks
			ticksToChangeAsteroidDirection: 30,
			asteroidDelayAfterDetonate: 20,

			textStyleDefault: new PIXI.TextStyle({
				fontFamily: "IrishGrover",
				fontSize: 36,
				fill: "white",
				stroke: "#ff3300",
				strokeThickness: 4,
				dropShadow: true,
				dropShadowColor: "#000000",
				dropShadowBlur: 4,
				dropShadowAngle: Math.PI / 6,
				dropShadowDistance: 6,
			}),

			textStyleHover: new PIXI.TextStyle({
				fontFamily: "IrishGrover",
				fontSize: 36,
				fill: "yellow",
				stroke: "#ff3300",
				strokeThickness: 4,
				dropShadow: true,
				dropShadowColor: "#000000",
				dropShadowBlur: 4,
				dropShadowAngle: Math.PI / 6,
				dropShadowDistance: 6,
			}),
		};

		this.state = {
			width: null,
			height: null,
			isPause: false,
			eventCallbacks: {
				resize: [],
				load: [],
				progress: [],
				tick: [],
				keyEscapeDown: [],
				keySpaceDown: [],
				keyArrowRightDown: [],
				keyArrowLeftDown: [],
				keyEscapeUp: [],
				keySpaceUp: [],
				keyArrowRightUp: [],
				keyArrowLeftUp: [],
				pointerdown: [],
				pointermove: [],
				pointerup: [],
				win: [],
				lose: [],
			},
			bulletsArray: [],
			asteroidsArray: [],
		};

		this.managers = {
			bg: new BgManager(this),
			starship: new StarshipManager(this),
			collisionDetection: new CollisionDetection(this),
			asteroidCreatorManager: new AsteroidCreatorManager(this),
			menu: new MenuManager(this),
			game: new GameManager(this, this.onWin.bind(this)),
			gameOverText: new GameOver(this),
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
		this.app.stage.interactive = true;
		this.app.stage.sortableChildren = true;
		this.DOM.container.appendChild(this.app.view);
		this.loader = PIXI.Loader.shared;

		// ---- -> EVENT LISTENERS ----

		window.addEventListener("resize", throttle(this.onResize.bind(this), 300));
		window.addEventListener("keydown", this.onKeydown.bind(this));
		window.addEventListener("keyup", this.onKeyup.bind(this));

		this.app.stage.on("pointerdown", this.onPointerdown.bind(this));
		this.app.stage.on("pointermove", this.onPointermove.bind(this));
		this.app.stage.on("pointerup", this.onPointerup.bind(this));

		this.DOM.menuToggler.addEventListener("click", this.onMenuTogglerClick.bind(this))
		this.DOM.defaultGameBtn.addEventListener("click", this.onMenuPlayDefaultClick.bind(this))
		this.DOM.restartBtn.addEventListener("click", this.onMenuRestartClick.bind(this))

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
		if (!this.state.eventCallbacks[type] || this.state.eventCallbacks[type].includes(callback)) return;

		this.state.eventCallbacks[type].push(callback);
	}

	removeListener(type, callback) {
		this.state.eventCallbacks[type] = this.state.eventCallbacks[type].filter((oldCallback) => callback !== oldCallback);
	}

	onWin(gameName) {
		this.managers.gameOverText.init("You win!");

		setTimeout(() => {
			this.managers.menu.open();
			this.managers.gameOverText.destroy();
		}, 1000)

		this.state.eventCallbacks.win.forEach((callback) => {
			callback(gameName);
		});
	}

	onMenuTogglerClick() {
		this.managers.menu.toggle();

		this.managers.game.toggle();
	}

	onMenuPlayDefaultClick() {
		this.managers.game.createDefaultGame();
		this.managers.menu.close();
	}
	
	onMenuRestartClick() {
		this.managers.game.createDefaultGame();
		this.managers.menu.close();
	}

	onLoad() {
		this.managers.bg.init(this.loader.resources.bg);
		this.managers.starship.init(this.loader.resources.starship);
		this.managers.asteroidCreatorManager.init(this.loader.resources.asteroid, this.loader.resources.explosion);
		// this.managers.menu.init();
		this.managers.menu.open();
		// this.managers.game.createDefaultGame();

		this.state.eventCallbacks.load.forEach((callback) => {
			callback();
		});

		window.requestAnimationFrame(this.onTick.bind(this));
	}

	onProgress({ progress }) {
		this.state.eventCallbacks.progress.forEach((callback) => {
			callback(progress);
		});
	}

	onTick() {
		this.state.eventCallbacks.tick.forEach((callback) => {
			callback();
		});

		if (this.state.bulletsArray.length !== this.tempNumber) {
			this.tempNumber = this.state.bulletsArray.length;
			console.log("bullets:", this.state.bulletsArray);
		}
		if (this.state.asteroidsArray.length !== this.tempNumberAsteroids) {
			this.tempNumberAsteroids = this.state.asteroidsArray.length;
			console.log("asteroids:", this.state.asteroidsArray);
		}

		window.requestAnimationFrame(this.onTick.bind(this));
	}

	onEscapeDown() {
		this.managers.menu.toggle();
		this.managers.game.toggle();

		this.state.eventCallbacks.keyEscapeDown.forEach((callback) => {
			callback();
		});
	}

	onSpaceDown() {
		this.state.eventCallbacks.keySpaceDown.forEach((callback) => {
			callback();
		});
	}

	onArrowRightDown() {
		this.state.eventCallbacks.keyArrowRightDown.forEach((callback) => {
			callback();
		});
	}

	onArrowLeftDown() {
		this.state.eventCallbacks.keyArrowLeftDown.forEach((callback) => {
			callback();
		});
	}

	onEscapeUp() {
		this.state.eventCallbacks.keyEscapeUp.forEach((callback) => {
			callback();
		});
	}

	onSpaceUp() {
		this.state.eventCallbacks.keySpaceUp.forEach((callback) => {
			callback();
		});
	}

	onArrowRightUp() {
		this.state.eventCallbacks.keyArrowRightUp.forEach((callback) => {
			callback();
		});
	}

	onArrowLeftUp() {
		this.state.eventCallbacks.keyArrowLeftUp.forEach((callback) => {
			callback();
		});
	}

	onKeydown({ code }) {
		if (code === "ArrowLeft") this.onArrowLeftDown();

		if (code === "ArrowRight") this.onArrowRightDown();

		if (code === "Space") this.onSpaceDown();

		if (code === "Escape") this.onEscapeDown();
	}

	onKeyup({ code }) {
		if (code === "ArrowLeft") this.onArrowLeftUp();

		if (code === "ArrowRight") this.onArrowRightUp();

		if (code === "Space") this.onSpaceUp();

		if (code === "Escape") this.onEscapeUp();
	}

	onPointerdown(touch) {
		this.state.eventCallbacks.pointerdown.forEach((callback) => {
			callback(touch);
		});
	}

	onPointermove(touch) {
		this.state.eventCallbacks.pointermove.forEach((callback) => {
			callback(touch);
		});
	}

	onPointerup(touch) {
		this.state.eventCallbacks.pointerup.forEach((callback) => {
			callback(touch);
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
