import * as PIXI from "pixi.js";

export default class Bullet {
	constructor(generalManager, normalX, normalY) {
		this.generalManager = generalManager;
		this.state = {
			normalX,
			normalY,
			x: null,
			y: null,
			radius: null,
			isDestroyed: false,
		};

		this.updateSize();
		this.create();
		this.updatePosition();

		this.tickHandler = this.onTick.bind(this);
		this.resizeHandler = this.onResize.bind(this);
		this.generalManager.addListener("tick", this.tickHandler);
		this.generalManager.addListener("resize", this.resizeHandler);
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
		if (this.state.normalY <= 0) this.destroy();
		this.state.normalY -= this.generalManager.settings.bulletSpeed;
	}

	destroy() {
		this.state.isDestroyed = true;
		this.generalManager.removeListener("tick", this.tickHandler);
		this.generalManager.removeListener("resize", this.resizeHandler);
		this.graphics.destroy();
	}

	onTick() {
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
