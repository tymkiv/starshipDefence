// import * as PIXI from "pixi.js";

import Manager from "../Manager";
import MenuToggler from "./MenuToggler";
import MenuBgManager from "./MenuBgManager";
import RestartBtn from "./RestartBtn";

export default class MenuManager extends Manager {
	init() {
		super.init();

		this.state.isOpen = false;
		this.state.managers = {
			menuToggler: new MenuToggler(this.generalManager),
			menuBgManager: new MenuBgManager(this.generalManager),
			restartBtn: new RestartBtn(this.generalManager),
		};

		this.state.managers.menuToggler.init(this.open.bind(this), this.close.bind(this));
		this.state.managers.restartBtn.init(() => {
			console.log("restart");
			this.generalManager.cancelGame();
			this.generalManager.startGame();
			this.close();
		});

		this.generalManager.addListener("keyEscapeDown", this.toggle.bind(this));
	}

	toggle() {
		if (this.state.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}

	open() {
		if (!this.state.isInited || this.state.isOpen) return;

		this.state.isOpen = true;
		this.state.managers.menuToggler.open();
		this.state.managers.restartBtn.open();
		this.state.managers.menuBgManager.init();

		this.generalManager.pause();
	}

	close() {
		if (!this.state.isInited || !this.state.isOpen) return;

		this.state.isOpen = false;
		this.state.managers.menuToggler.close();
		this.state.managers.restartBtn.close();
		this.state.managers.menuBgManager.clear();

		this.generalManager.unpause();
	}
}
