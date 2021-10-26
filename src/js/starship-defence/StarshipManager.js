import * as PIXI from "pixi.js";
import { contain } from "intrinsic-scale";

import Manager from "./Manager";
import Bullet from "./Bullet";

export default class StarshipManager extends Manager {
	init(starship) {
		super.init();

		this.starship = starship;

		this.state.normalInstantlyX =
			this.generalManager.settings.starshipStartPositionX;
		this.state.normalInstantlyY =
			this.generalManager.settings.starshipStartPositionY;
		this.state.normalX = this.state.normalInstantlyX;
		this.state.normalY = this.state.normalInstantlyY;

		this.starshipSprite = new PIXI.Sprite(this.starship.texture);
		this.naturalWidth = this.starship.data.naturalWidth;
		this.naturalHeight = this.starship.data.naturalHeight;

		this.generalManager.app.stage.addChild(this.starshipSprite);

		this.generalManager.addListener("tick", this.onTick.bind(this));
		this.generalManager.addListener("shot", this.onShot.bind(this));

		this.updateSize();

		this.calculateNormalPositionInstantly();

		this.updatePosition();
	}

	updateSize() {
		const { width, height } = contain(
			(this.generalManager.state.width *
				this.generalManager.settings.starshipSizeW) /
				100,
			(this.generalManager.state.height *
				this.generalManager.settings.starshipSizeH) /
				100,
			this.naturalWidth,
			this.naturalHeight
		);

		this.state.width = width;
		this.state.height = height;

		this.starshipSprite.width = this.state.width;
		this.starshipSprite.height = this.state.height;
	}

	updatePosition() {
		this.state.x =
			(this.state.normalX / 100) * this.generalManager.state.width -
			this.state.width / 2;
		this.state.y =
			(this.state.normalY / 100) * this.generalManager.state.height -
			this.state.height / 2;

		this.starshipSprite.x = this.state.x;
		this.starshipSprite.y = this.state.y;
	}

	calculateNormalPositionFriction() {
		this.state.normalX +=
			this.generalManager.settings.starshipFriction *
			(this.state.normalInstantlyX - this.state.normalX);
		this.state.normalY +=
			this.generalManager.settings.starshipFriction *
			(this.state.normalInstantlyY - this.state.normalY);
	}

	calculateNormalPositionInstantly() {
		this.state.normalX = this.state.normalInstantlyX;
		this.state.normalY = this.state.normalInstantlyY;
	}

	setCenterPosition() {
		this.state.normalInstantlyX =
			this.generalManager.settings.starshipStartPositionX;
		this.state.normalInstantlyY =
			this.generalManager.settings.starshipStartPositionY;
	}

	onStartGame() {
		this.setCenterPosition();
	}

	moveLeft() {
		if (
			this.state.normalInstantlyX -
				this.generalManager.settings.starshipDriftSpeed <
			this.generalManager.settings.starshipSizeW / 2
		)
			return;

		this.state.normalInstantlyX -=
			this.generalManager.settings.starshipDriftSpeed;
	}

	moveRight() {
		if (
			this.state.normalInstantlyX +
				this.generalManager.settings.starshipDriftSpeed >
			100 - this.generalManager.settings.starshipSizeW / 2
		)
			return;

		this.state.normalInstantlyX +=
			this.generalManager.settings.starshipDriftSpeed;
	}

	onShot() {
		new Bullet( // eslint-disable-line no-new
			this.generalManager,
			this.state.normalX,
			this.state.normalY - this.generalManager.settings.starshipSizeH / 2
		);
	}

	onTick() {
		if (this.generalManager.state.driftX === "left") this.moveLeft();
		if (this.generalManager.state.driftX === "right") this.moveRight();

		this.calculateNormalPositionFriction();
		this.updatePosition();
	}

	onResize() {
		this.updateSize();
		this.updatePosition();
	}
}
