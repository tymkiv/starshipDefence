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
		this.state.shouldBeDetonate = false;
		this.state.shouldBeDestroyed = false;
		this.state.destroyTime = null;
		this.state.time = 0;

		this.asteroidData = asteroidData;
		this.explosionData = explosionData;

		this.asteroidSprite = new PIXI.Sprite(this.asteroidData.texture);
		this.naturalWidth = this.asteroidData.data.naturalWidth;
		this.naturalHeight = this.asteroidData.data.naturalHeight;

		this.generalManager.app.stage.addChild(this.asteroidSprite);

		this.updateRundomDirection();

		this.updateSize();

		this.calculateNormalPositionInstantly();

		this.updatePosition();

		this.tickHandler = this.onTick.bind(this);
		this.generalManager.addListener("tick", this.tickHandler);

		this.generalManager.state.asteroidsArray.push(this);
	}

	updateSize() {
		const { width, height } = contain(
			(this.generalManager.state.width * this.generalManager.settings.asteroidSizeW) / 100,
			(this.generalManager.state.height * this.generalManager.settings.asteroidSizeH) / 100,
			this.naturalWidth,
			this.naturalHeight
		);

		this.state.width = width;
		this.state.height = height;

		this.asteroidSprite.width = this.state.width;
		this.asteroidSprite.height = this.state.height;
	}

	updatePosition() {
		this.state.x = (this.state.normalX / 100) * this.generalManager.state.width - this.state.width / 2;
		this.state.y = (this.state.normalY / 100) * this.generalManager.state.height - this.state.height / 2;

		this.asteroidSprite.x = this.state.x;
		this.asteroidSprite.y = this.state.y;
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

	onDetonate() {
		this.generalManager.state.asteroidsArray = this.generalManager.state.asteroidsArray.filter(
			(asteroid) => asteroid !== this
		);
		this.asteroidSprite.texture = this.explosionData.texture;

		this.state.shouldBeDetonate = false;
		this.state.shouldBeDestroyed = true;
		this.state.destroyTime = this.state.time + this.generalManager.settings.asteroidDelayAfterDetonate;
	}

	onDestroy() {
		super.onDestroy();
		this.generalManager.removeListener("tick", this.tickHandler);
		this.asteroidSprite.parent.removeChild(this.asteroidSprite);
	}

	updateRundomDirection() {
		this.direction = Math.random() * 360;

		const maxTeoreticalX =
			this.state.normalInstantlyX +
			this.generalManager.settings.asteroidSpeed *
				this.generalManager.settings.ticksToChangeAsteroidDirection *
				Math.cos((this.direction * Math.PI) / 180);
		const maxTeoreticalY =
			this.state.normalInstantlyY +
			this.generalManager.settings.asteroidSpeed *
				this.generalManager.settings.ticksToChangeAsteroidDirection *
				Math.sin((this.direction * Math.PI) / 180);
		if (
			maxTeoreticalX > 100 - this.generalManager.settings.asteroidSizeW / 2 ||
			maxTeoreticalX < this.generalManager.settings.asteroidSizeW / 2 ||
			maxTeoreticalY > 50 - this.generalManager.settings.asteroidSizeH / 2 ||
			maxTeoreticalY < this.generalManager.settings.asteroidSizeH / 2
		) {
			this.updateRundomDirection();
		}
	}

	moveByDirection() {
		this.state.normalInstantlyX +=
			this.generalManager.settings.asteroidSpeed * Math.cos((this.direction * Math.PI) / 180);
		this.state.normalInstantlyY +=
			this.generalManager.settings.asteroidSpeed * Math.sin((this.direction * Math.PI) / 180);
	}

	onTick() {
		// if (this.generalManager.state.isPause) return;
		if (this.generalManager.managers.game.state.isPause) return;

		this.state.time += 1;
		// console.log(this.state.time, this.state.destroyTime);

		if (this.state.shouldBeDestroyed) {
			if (this.state.time === this.state.destroyTime) {
				this.onDestroy();
			}
			return;
		}

		if (this.state.shouldBeDetonate) {
			this.onDetonate();
			return;
		}

		if (this.state.time % this.generalManager.settings.ticksToChangeAsteroidDirection === 0) {
			this.updateRundomDirection();
		}
		this.moveByDirection();

		this.calculateNormalPositionFriction();

		this.updatePosition();
	}

	detonate() {
		this.state.shouldBeDetonate = true;
	}

	destroy() {
		this.onDestroy();
		this.generalManager.state.asteroidsArray = this.generalManager.state.asteroidsArray.filter(
			(asteroid) => asteroid !== this
		);
	}

	onResize() {
		this.updateSize();
		this.updatePosition();
	}
}
