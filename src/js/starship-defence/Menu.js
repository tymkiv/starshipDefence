import * as PIXI from "pixi.js";

export default class Menu {
	constructor(generalManager) {
		this.generalManager = generalManager;

		this.styleDefault = new PIXI.TextStyle({
			fontFamily: "IrishGrover",
			fontSize: 36,
			fill: "white",
			stroke: "#ff3300",
			strokeThickness: 4,
			dropShadow: true,
			dropShadowColor: "#000000",
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
		});

		this.styleHover = new PIXI.TextStyle({
			fontFamily: "IrishGrover",
			fontSize: 36,
			fill: "yellow",
			stroke: "#ff3300",
			strokeThickness: 4,
			dropShadow: true,
			dropShadowColor: "#000000",
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
		});
	}

	init() {
		this.createDefaultMessage();
	}

	messageBody() {
		this.message.position.set(window.innerWidth - this.message.width, 0);
		this.generalManager.app.stage.addChild(this.message);
		this.message.interactive = true;
		this.message.buttonMode = true;
	}

	createDefaultMessage() {
		if (this.message && this.message.destroy) this.message.destroy();

		this.message = new PIXI.Text("Menu", this.styleDefault);
		this.messageBody();

		this.message.on("pointerover", this.createHoverMessage.bind(this));
		this.message.on("pointerdown", this.onTap.bind(this));
	}

	createHoverMessage() {
		if (this.message && this.message.destroy) this.message.destroy();

		this.message = new PIXI.Text("Menu", this.styleHover);
		this.messageBody();

		this.message.on("pointerout", this.createDefaultMessage.bind(this));
		this.message.on("pointerdown", this.onTap.bind(this));
	}

	onTap(event) {
		event.stopPropagation();
		console.log(event);
		return this;
	}
}
