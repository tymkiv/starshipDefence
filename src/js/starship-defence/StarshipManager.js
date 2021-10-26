import * as PIXI from "pixi.js";
import { contain } from "intrinsic-scale";

import Manager from "./Manager";

export default class StarshipManager extends Manager {
	init(starship) {
		super.init();

		this.starship = starship;

		this.state.normalX = this.generalManager.settings.starshipStartPositionX;
		this.state.normalY = this.generalManager.settings.starshipStartPositionY;

		this.starshipSprite = new PIXI.Sprite(this.starship.texture);
		this.naturalWidth = this.starship.data.naturalWidth;
		this.naturalHeight = this.starship.data.naturalHeight;

		this.generalManager.app.stage.addChild(this.starshipSprite);

		this.generalManager.addListener("tick", this.onTick.bind(this));

		this.updateSize();
		this.setSize();

		this.updatePosition();
		this.setPositionInstantly();
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
	}

	setSize() {
		this.starshipSprite.width = this.state.width;
		this.starshipSprite.height = this.state.height;
	}

	updatePosition() {
		this.state.leapX =
			(this.state.normalX / 100) * this.generalManager.state.width -
			this.state.width / 2;
		this.state.leapY =
			(this.state.normalY / 100) * this.generalManager.state.height -
			this.state.height / 2;
	}

	setPositionInstantly() {
		this.state.x = this.state.leapX;
		this.state.y = this.state.leapY;

		this.starshipSprite.x = this.state.x;
		this.starshipSprite.y = this.state.y;
	}

	setPositionFriction() {
		this.state.x +=
			this.generalManager.settings.starshipFriction *
			(this.state.leapX - this.state.x);
		this.state.y +=
			this.generalManager.settings.starshipFriction *
			(this.state.leapY - this.state.y);

		this.starshipSprite.x = this.state.x;
		this.starshipSprite.y = this.state.y;
	}

	setCenterPosition() {
		this.state.normalX = this.generalManager.settings.starshipStartPositionX;
		this.state.normalY = this.generalManager.settings.starshipStartPositionY;
	}

	onStartGame() {
		this.setCenterPosition();
	}

	moveLeft() {
		if (
			this.state.normalX - this.generalManager.settings.starshipDriftSpeed <
			this.generalManager.settings.starshipSizeW / 2
		)
			return;

		this.state.normalX -= this.generalManager.settings.starshipDriftSpeed;
	}

	moveRight() {
		if (
			this.state.normalX + this.generalManager.settings.starshipDriftSpeed >
			100 - this.generalManager.settings.starshipSizeW / 2
		)
			return;

		this.state.normalX += this.generalManager.settings.starshipDriftSpeed;
	}

	onTick() {
		if (this.generalManager.state.driftX === "left") this.moveLeft();
		if (this.generalManager.state.driftX === "right") this.moveRight();
		this.updatePosition();
		this.setPositionFriction();
	}

	onResize() {
		this.updateSize();
		this.updatePosition();
	}
}
