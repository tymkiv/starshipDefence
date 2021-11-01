import * as PIXI from "pixi.js";
import { contain } from "intrinsic-scale";
import { throttle } from "underscore";

import Manager from "./Manager";
import Bullet from "./Bullet";

export default class StarshipManager extends Manager {
	init(starship) {
		this.starship = starship;
	}

	create() {
		this.state.isInited = true;
		this.state.driftX = null;
		this.state.keyLeftActive = false;
		this.state.keyRightActive = false;
		this.state.shotActive = false;
		this.state.touches = {
			left: {
				start: null,
				move: null,
				id: null,
			},
			right: {
				id: null,
			},
		};

		this.state.normalInstantlyX = this.generalManager.settings.starshipStartPositionX;
		this.state.normalInstantlyY = this.generalManager.settings.starshipStartPositionY;
		this.state.normalX = this.state.normalInstantlyX;
		this.state.normalY = this.state.normalInstantlyY;

		this.state.handlers = {
			onTick: this.onTick.bind(this),
			onKeySpaceDown: this.onKeySpaceDown.bind(this),
			onKeySpaceUp: this.onKeySpaceUp.bind(this),
			onKeyArrowRightDown: this.onKeyArrowRightDown.bind(this),
			onKeyArrowRightUp: this.onKeyArrowRightUp.bind(this),
			onKeyArrowLeftDown: this.onKeyArrowLeftDown.bind(this),
			onKeyArrowLeftUp: this.onKeyArrowLeftUp.bind(this),
			onPointerdown: this.onPointerdown.bind(this),
			onPointermove: this.onPointermove.bind(this),
			onPointerup: this.onPointerup.bind(this),
		};

		this.generalManager.addListener("tick", this.state.handlers.onTick);
		this.generalManager.addListener("keySpaceDown", this.state.handlers.onKeySpaceDown);
		this.generalManager.addListener("keySpaceUp", this.state.handlers.onKeySpaceUp);
		this.generalManager.addListener("keyArrowRightDown", this.state.handlers.onKeyArrowRightDown);
		this.generalManager.addListener("keyArrowRightUp", this.state.handlers.onKeyArrowRightUp);
		this.generalManager.addListener("keyArrowLeftDown", this.state.handlers.onKeyArrowLeftDown);
		this.generalManager.addListener("keyArrowLeftUp", this.state.handlers.onKeyArrowLeftUp);
		this.generalManager.addListener("pointerdown", this.state.handlers.onPointerdown);
		this.generalManager.addListener("pointermove", this.state.handlers.onPointermove);
		this.generalManager.addListener("pointerup", this.state.handlers.onPointerup);

		this.starshipSprite = new PIXI.Sprite(this.starship.texture);
		this.naturalWidth = this.starship.data.naturalWidth;
		this.naturalHeight = this.starship.data.naturalHeight;

		this.generalManager.app.stage.addChild(this.starshipSprite);

		this.updateSize();

		this.calculateNormalPositionInstantly();

		this.updatePosition();

		this.shotHandler = throttle(this.shot.bind(this), this.generalManager.settings.shotThrottleTimeout, {
			trailing: false,
		});
	}

	onDestroy() {
		this.generalManager.removeListener("tick", this.state.handlers.onTick);
		this.generalManager.removeListener("keySpaceDown", this.state.handlers.onKeySpaceDown);
		this.generalManager.removeListener("keySpaceUp", this.state.handlers.onKeySpaceDown);
		this.generalManager.removeListener("keyArrowRightDown", this.state.handlers.onKeyArrowRightDown);
		this.generalManager.removeListener("keyArrowRightUp", this.state.handlers.onKeyArrowRightUp);
		this.generalManager.removeListener("keyArrowLeftDown", this.state.handlers.onKeyArrowLeftDown);
		this.generalManager.removeListener("keyArrowLeftUp", this.state.handlers.onKeyArrowLeftUp);
		this.generalManager.removeListener("pointerdown", this.state.handlers.onPointerdown);
		this.generalManager.removeListener("pointermove", this.state.handlers.onPointermove);
		this.generalManager.removeListener("pointerup", this.state.handlers.onPointerup);

		this.starshipSprite.parent.removeChild(this.starshipSprite);
		this.starshipSprite.destroy();
		this.starshipSprite = null;
		this.state.isInited = false;
	}

	onKeySpaceDown() {
		this.state.shotActive = true;
	}

	onKeySpaceUp() {
		this.state.shotActive = false;
	}

	onKeyArrowRightDown() {
		this.state.keyRightActive = true;
		this.state.driftX = "right";
	}

	onKeyArrowRightUp() {
		this.state.keyRightActive = false;
		if (this.state.driftX === "right") this.state.driftX = this.state.keyLeftActive ? "left" : "";
	}

	onKeyArrowLeftDown() {
		this.state.keyLeftActive = true;
		this.state.driftX = "left";
	}

	onKeyArrowLeftUp() {
		this.state.keyLeftActive = false;
		if (this.state.driftX === "left") this.state.driftX = this.state.keyRightActive ? "right" : "";
	}

	onPointerdown(touch) {
		if (touch.data.global.x < this.generalManager.state.width / 2 && !this.state.touches.left.id) {
			this.state.touches.left.start = touch.data.global.x;
			this.state.touches.left.id = touch.data.identifier;
		}

		if (touch.data.global.x > this.generalManager.state.width / 2 && !this.state.touches.right.id) {
			this.state.touches.right.id = touch.data.identifier;
			this.state.shotActive = true;
		}
	}

	onPointermove(touch) {
		if (touch.data.identifier === this.state.touches.left.id) {
			this.state.touches.left.move = touch.data.global.x;

			if (this.state.touches.left.move > this.state.touches.left.start) {
				this.state.driftX = "right";
			}
			if (this.state.touches.left.move < this.state.touches.left.start) {
				this.state.driftX = "left";
			}
		}
	}

	onPointerup(touch) {
		if (touch.data.identifier === this.state.touches.left.id) {
			this.state.touches.left.start = null;
			this.state.touches.left.move = null;
			this.state.touches.left.id = null;

			this.state.driftX = "";
		}

		if (touch.data.identifier === this.state.touches.right.id) {
			this.state.touches.right.id = null;
			this.state.shotActive = false;
		}
	}

	updateSize() {
		const { width, height } = contain(
			(this.generalManager.state.width * this.generalManager.settings.starshipSizeW) / 100,
			(this.generalManager.state.height * this.generalManager.settings.starshipSizeH) / 100,
			this.naturalWidth,
			this.naturalHeight
		);

		this.state.width = width;
		this.state.height = height;

		this.starshipSprite.width = this.state.width;
		this.starshipSprite.height = this.state.height;
	}

	updatePosition() {
		this.state.x = (this.state.normalX / 100) * this.generalManager.state.width - this.state.width / 2;
		this.state.y = (this.state.normalY / 100) * this.generalManager.state.height - this.state.height / 2;

		this.starshipSprite.x = this.state.x;
		this.starshipSprite.y = this.state.y;
	}

	calculateNormalPositionFriction() {
		this.state.normalX +=
			this.generalManager.settings.starshipFriction * (this.state.normalInstantlyX - this.state.normalX);
		this.state.normalY +=
			this.generalManager.settings.starshipFriction * (this.state.normalInstantlyY - this.state.normalY);
	}

	calculateNormalPositionInstantly() {
		this.state.normalX = this.state.normalInstantlyX;
		this.state.normalY = this.state.normalInstantlyY;
	}

	setCenterPosition() {
		this.state.normalInstantlyX = this.generalManager.settings.starshipStartPositionX;
		this.state.normalInstantlyY = this.generalManager.settings.starshipStartPositionY;
	}

	onStartGame() {
		this.setCenterPosition();
	}

	moveLeft() {
		if (
			this.state.normalInstantlyX - this.generalManager.settings.starshipDriftSpeed <
			this.generalManager.settings.starshipSizeW / 2
		)
			return;

		this.state.normalInstantlyX -= this.generalManager.settings.starshipDriftSpeed;
	}

	moveRight() {
		if (
			this.state.normalInstantlyX + this.generalManager.settings.starshipDriftSpeed >
			100 - this.generalManager.settings.starshipSizeW / 2
		)
			return;

		this.state.normalInstantlyX += this.generalManager.settings.starshipDriftSpeed;
	}

	shot() {
		if (this.generalManager.state.isPause) return;

		new Bullet( // eslint-disable-line no-new
			this.generalManager,
			this.state.normalX,
			this.state.normalY - this.generalManager.settings.starshipSizeH / 2
		);
	}

	onTick() {
		if (this.generalManager.managers.game.state.isPause) return;

		if (this.state.driftX === "left") this.moveLeft();
		if (this.state.driftX === "right") this.moveRight();
		if (this.state.shotActive) this.shotHandler();

		this.calculateNormalPositionFriction();
		this.updatePosition();
	}

	onResize() {
		if (!this.state.isInited) return;

		this.updateSize();
		this.updatePosition();
	}
}
