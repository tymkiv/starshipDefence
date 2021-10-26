import * as PIXI from "pixi.js";
import { contain } from "intrinsic-scale";

import Manager from "./Manager";

export default class AsteroidManager extends Manager {
	init(asteroidData, explosionData, x, y) {
		super.init();

		this.state.normalInstantlyX = x;
		this.state.normalInstantlyY = y;
		this.state.normalX = x;
		this.state.normalY = y;

		this.asteroidData = asteroidData;
		this.explosionData = explosionData;

		this.asteroidSprite = new PIXI.Sprite(this.asteroidData.texture);
		this.naturalWidth = this.asteroidData.data.naturalWidth;
		this.naturalHeight = this.asteroidData.data.naturalHeight;

		this.generalManager.app.stage.addChild(this.asteroidSprite);

		this.updateSize();

		this.calculateNormalPositionInstantly();

		this.updatePosition();

		// setTimeout(() => {
		// 	this.asteroidSprite.texture = this.explosionData.texture;
		// }, 3000);
	}

	updateSize() {
		const { width, height } = contain(
			(this.generalManager.state.width *
				this.generalManager.settings.asteroidSizeW) /
				100,
			(this.generalManager.state.height *
				this.generalManager.settings.asteroidSizeH) /
				100,
			this.naturalWidth,
			this.naturalHeight
		);

		this.state.width = width;
		this.state.height = height;

		this.asteroidSprite.width = this.state.width;
		this.asteroidSprite.height = this.state.height;
	}

	updatePosition() {
		this.state.x =
			(this.state.normalX / 100) * this.generalManager.state.width -
			this.state.width / 2;
		this.state.y =
			(this.state.normalY / 100) * this.generalManager.state.height -
			this.state.height / 2;

		this.asteroidSprite.x = this.state.x;
		this.asteroidSprite.y = this.state.y;
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

	onResize() {
		this.updateSize();
		this.updatePosition();
	}
}
