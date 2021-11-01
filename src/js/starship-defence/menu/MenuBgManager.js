import * as PIXI from "pixi.js";

import Manager from "../Manager";

export default class MenuBgManager extends Manager {
	init() {
		super.init();

		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(0x000000, 0.6);
		this.graphics.drawRect(0, 0, this.generalManager.state.width, this.generalManager.state.height);
		this.graphics.endFill();
		this.graphics.zIndex = 50;

		this.generalManager.app.stage.addChild(this.graphics);

		this.setSize();
	}

	clear() {
		if (!this.state.isInited) return;

		this.graphics.destroy();
	}

	setSize() {
		this.graphics.width = this.generalManager.state.width;
		this.graphics.height = this.generalManager.state.height;
	}

	onResize() {
		if (!this.state.isInited) return;

		this.setSize();
	}
}
