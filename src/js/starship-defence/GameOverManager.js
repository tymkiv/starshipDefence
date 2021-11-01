import * as PIXI from "pixi.js";

import Manager from "./Manager";

export default class GameOver extends Manager {
	init(text) {
		if (this.state.isInited) return;
		super.init();
		console.log('init');
		this.state.text = text;

		this.createDefaultMessage();
	}

	destroy() {
		if (this.message && this.message.destroy) this.message.destroy();
		this.isInited = false;
	}

	messageBody() {
		this.updatePosition();
		this.generalManager.app.stage.addChild(this.message);
		this.message.zIndex = 100;
	}

	createDefaultMessage() {
		if (this.message && this.message.destroy) this.message.destroy();

		this.message = new PIXI.Text(this.state.text, this.generalManager.settings.textStyleDefault);
		this.messageBody();
	}

	updatePosition() {
		this.message.position.set(
			this.generalManager.state.width / 2 - this.message.width / 2,
			this.generalManager.state.height / 2 - this.message.height / 2
		);
	}

	onResize() {
		if (!this.state.isInited) return;

		this.updatePosition();
	}
}
