import * as PIXI from "pixi.js";

import Manager from "../Manager";

export default class RestartBtn extends Manager {
	init(onClick) {
		super.init();

		this.onClick = onClick;

		this.state.text = "Restart current game";
		this.state.isOpen = false;

		// this.createDefaultMessage();
	}

	messageBody() {
		this.updatePosition();
		this.generalManager.app.stage.addChild(this.message);
		this.message.interactive = true;
		this.message.buttonMode = true;
		this.message.zIndex = 100;
	}

	createDefaultMessage() {
		if (this.message && this.message.destroy) this.message.destroy();

		this.message = new PIXI.Text(this.state.text, this.generalManager.settings.textStyleDefault);
		this.messageBody();

		this.message.on("pointerover", this.createHoverMessage.bind(this));
		this.message.on("pointerdown", this.onTap.bind(this));
	}

	createHoverMessage() {
		if (this.message && this.message.destroy) this.message.destroy();

		this.message = new PIXI.Text(this.state.text, this.generalManager.settings.textStyleHover);
		this.messageBody();

		this.message.on("pointerout", this.createDefaultMessage.bind(this));
		this.message.on("pointerdown", this.onTap.bind(this));
	}

	open() {
		if (!this.state.isInited || this.state.isOpen) return;

		this.state.isOpen = true;
		this.createDefaultMessage();
	}

	close() {
		if (!this.state.isInited || !this.state.isOpen) return;

		this.state.isOpen = false;
		this.message.destroy();
		this.message = null;
	}

	onTap(event) {
		event.stopPropagation();

		this.onClick();
	}

	updatePosition() {
		this.message.position.set(
			this.generalManager.state.width / 2 - this.message.width / 2,
			this.generalManager.state.height / 10
		);
	}

	onResize() {
		if (!this.state.isInited) return;

		this.updatePosition();
	}
}
