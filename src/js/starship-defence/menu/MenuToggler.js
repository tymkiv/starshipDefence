import * as PIXI from "pixi.js";

import Manager from "../Manager";

export default class MenuToggler extends Manager {
	init(onMenuOpen, onMenuClose) {
		if (this.state.isInited) return;
		super.init();

		this.onMenuOpen = onMenuOpen;
		this.onMenuClose = onMenuClose;

		this.state.text = "Menu";
		this.state.isOpen = false;

		this.toggleHandler = this.toggle.bind(this);
		this.generalManager.addListener("keyEscapeDown", this.toggleHandler);

		this.createDefaultMessage();
	}

	destroy() {
		if (this.message && this.message.destroy) this.message.destroy();
		this.state.isInited = false;
		this.generalManager.removeListener("keyEscapeDown", this.toggleHandler);
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
		this.state.text = "Close";
		this.createDefaultMessage();
		this.onMenuOpen();
	}

	close() {
		if (!this.state.isInited || !this.state.isOpen) return;

		this.state.isOpen = false;
		this.state.text = "Menu";
		this.createDefaultMessage();
		this.onMenuClose();
	}

	toggle() {
		if (this.state.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}

	onTap(event) {
		event.stopPropagation();

		this.toggle();
	}

	updatePosition() {
		this.message.position.set(this.generalManager.state.width - this.message.width, 0);
	}

	onResize() {
		if (!this.state.isInited) return;

		this.updatePosition();
	}
}
