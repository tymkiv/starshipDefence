import * as PIXI from "pixi.js";
import { cover } from "intrinsic-scale";

import Manager from "./Manager";

export default class BgManager extends Manager {
	init(bg) {
		super.init();

		this.bg = bg;

		this.bgSprite = new PIXI.Sprite(this.bg.texture);
		this.naturalWidth = this.bg.data.naturalWidth;
		this.naturalHeight = this.bg.data.naturalHeight;

		this.updateSize();
		this.setSize();

		this.generalManager.app.stage.addChild(this.bgSprite);
	}

	updateSize() {
		const { width, height, x, y } = cover(
			this.generalManager.state.width,
			this.generalManager.state.height,
			this.naturalWidth,
			this.naturalHeight
		);

		this.state.width = width;
		this.state.height = height;
		this.state.x = x;
		this.state.y = y;
	}

	setSize() {
		this.bgSprite.width = this.state.width;
		this.bgSprite.height = this.state.height;
		this.bgSprite.x = this.state.x;
		this.bgSprite.y = this.state.y;
	}

	onResize() {
		if (!this.state.isInited) return;

		this.updateSize();
		this.setSize();
	}
}
