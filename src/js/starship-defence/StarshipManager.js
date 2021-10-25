import * as PIXI from "pixi.js";
import { cover } from "intrinsic-scale";

import Manager from "./Manager";

export default class StarshipManager extends Manager {
	init(starship) {
		super.init();

		this.starship = starship;

		this.starshipSprite = new PIXI.Sprite(this.starship.texture);
		this.naturalWidth = this.starship.data.naturalWidth;
		this.naturalHeight = this.starship.data.naturalHeight;

		// this.updateSize();
		// this.setSize();

		this.generalManager.app.stage.addChild(this.starshipSprite);
	}
}
