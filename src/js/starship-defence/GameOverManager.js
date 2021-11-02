import * as PIXI from "pixi.js";

import Manager from "./Manager";

export default class GameOver extends Manager {
	initGameOver(onYes, onNo) {
		super.init();

		this.container = new PIXI.Container();
		this.generalManager.app.stage.addChild(this.container);
		this.state.text = 
		`
		Game over! Loser!
		Do you want to buy sume bullets?
		`;

		
		this.createDefaultMessage();
		this.createBtn("Yes!", onYes);
		this.createBtn("No!", onNo);
		
	}
	
	initWin(onNext) {
		super.init();

		this.container = new PIXI.Container();
		this.generalManager.app.stage.addChild(this.container);
		this.state.text = 
		`
		You win!
		`;

		
		this.createDefaultMessage();
		this.createBtn("Next!", onNext);
		
	}

	destroy() {
		// if (this.message && this.message.destroy) this.message.destroy();
		if (this.container && this.container.destroy) this.container.destroy();

		this.state.isInited = false;
		// this.message = null;
		this.container = null;
	}

	messageBody() {
		this.updatePosition();
		this.container.addChild(this.message)
		// this.generalManager.app.stage.addChild(this.message);
		this.message.zIndex = 100;
	}

	createBtn(text, onClick = () => {}) {
		const btn = new PIXI.Text(text, this.generalManager.settings.textStyleDefault);
		btn.zIndex = 100;
		btn.interactive = true;
		btn.buttonMode = true;
		btn.addListener("pointerdown", onClick)
		this.container.addChild(btn);
		this.updatePosition();
	}

	createDefaultMessage() {
		if (this.message && this.message.destroy) this.message.destroy();

		this.message = new PIXI.Text(this.state.text, this.generalManager.settings.textStyleDefault);
		this.messageBody();
	}

	updatePosition() {

		this.container.position.set(
			this.generalManager.state.width / 2 - this.container.width / 2,
			this.generalManager.state.height / 2 - this.container.height / 2
		);

		this.container.children.reduce((y, text) => {
			text.position.set(0, y);
			return y + text.height;
		}, 0)
		// this.container
		// this.message.position.set(
		// 	this.generalManager.state.width / 2 - this.message.width / 2,
		// 	this.generalManager.state.height / 2 - this.message.height / 2
		// );
	}

	onResize() {
		if (!this.state.isInited) return;

		this.updatePosition();
	}
}
