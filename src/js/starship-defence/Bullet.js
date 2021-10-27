import * as PIXI from "pixi.js";

import Manager from "./Manager";

export default class Bullet extends Manager {
	constructor(generalManager, normalX, normalY) {
		super(generalManager);

		this.state.normalX = normalX;
		this.state.normalY = normalY;
		this.state.x = null;
		this.state.y = null;
		this.state.radius = null;
		this.state.isDestroyed = false;
		this.state.shouldBeDestroyed = false;

		this.updateSize();
		this.create();
		this.updatePosition();

		this.tickHandler = this.onTick.bind(this);
		this.generalManager.addListener("tick", this.tickHandler);

		this.generalManager.state.bulletsArray.push(this);
	}

	create() {
		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(0x66ccff);
		this.graphics.drawCircle(0, 0, this.state.radius);
		this.graphics.endFill();

		this.generalManager.app.stage.addChild(this.graphics);
	}

	updateSize() {
		this.state.radius =
			(this.generalManager.settings.bulletRadius / 100) *
			this.generalManager.state.width;
	}

	updatePosition() {
		if (this.state.isDestroyed) return;

		this.state.x = (this.state.normalX / 100) * this.generalManager.state.width;
		this.state.y =
			(this.state.normalY / 100) * this.generalManager.state.height;

		this.graphics.x = this.state.x;
		this.graphics.y = this.state.y;
	}

	move() {
		if (this.state.normalY <= 0) this.onDestroy();
		this.state.normalY -= this.generalManager.settings.bulletSpeed;
	}

	onDestroy() {
		super.onDestroy();
		this.state.isDestroyed = true;
		this.generalManager.removeListener("tick", this.tickHandler);
		this.graphics.destroy();
		this.generalManager.state.bulletsArray =
			this.generalManager.state.bulletsArray.filter(
				(bullet) => bullet !== this
			);
	}

	destroy() {
		this.state.shouldBeDestroyed = true;
	}

	onTick() {
		if (this.state.shouldBeDestroyed) {
			this.onDestroy();
			return;
		}
		this.move();
		this.updatePosition();
	}

	onResize() {
		this.graphics.destroy();
		this.updateSize();
		this.create();
		this.updatePosition();
	}
}
