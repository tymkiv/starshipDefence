// import * as PIXI from "pixi.js";

import Manager from "../Manager";
import MenuToggler from "./MenuToggler";
import MenuBgManager from "./MenuBgManager";
import SomeBtn from "./SomeBtn";

// export default class MenuManager extends Manager {
// 	init() {
// 		super.init();

// 		this.state.isOpen = false;
// 		this.state.managers = {
// 			menuToggler: new MenuToggler(this.generalManager),
// 			menuBgManager: new MenuBgManager(this.generalManager),
// 			restartBtn: new SomeBtn(this.generalManager),
// 			playDefaultGame: new SomeBtn(this.generalManager),
// 		};

// 		this.state.numberOfBtn = 0;
// 		// this.generalManager.addListener("keyEscapeDown", this.toggle.bind(this));

// 		this.createDefaultGameBtn();
// 		this.state.managers.playDefaultGame.open();
// 	}

// 	createMenuToggleBtn() {
// 		this.state.managers.menuToggler.init(this.open.bind(this), this.close.bind(this));
// 	}

// 	destroyMenuToggleBtn() {
// 		this.state.managers.menuToggler.destroy();
// 	}

// 	createRestartBtn() {
// 		this.state.numberOfBtn += 1;
// 		this.state.managers.restartBtn.init(() => {
// 			this.generalManager.managers.game.deleteCurrentGame();
// 			this.generalManager.managers.game.createDefaultGame();
// 			this.close();
// 			this.createMenuToggleBtn();
// 		}, "Restart current game", this.state.numberOfBtn, this.state.numberOfBtn - 1);
// 	}

// 	destroyRestartBtn() {
// 		this.state.numberOfBtn -= 1;
// 		this.state.managers.restartBtn.destroy();
// 	}
	
// 	createDefaultGameBtn() {
// 		this.state.numberOfBtn += 1;
// 		this.state.managers.playDefaultGame.init(() => {
// 			this.generalManager.managers.game.createDefaultGame();
// 			this.close();
// 			this.createMenuToggleBtn();
// 			this.createRestartBtn();
// 		}, "Play Default Game", this.state.numberOfBtn, this.state.numberOfBtn - 1);
// 	}

// 	destroyDefaultGameBtn() {
// 		this.state.numberOfBtn -= 1;
// 		this.state.managers.playDefaultGame.destroy();
// 	}

// 	toggle() {
// 		if (this.state.isOpen) {
// 			this.close();
// 		} else {
// 			this.open();
// 		}
// 	}

// 	open() {
// 		if (!this.state.isInited || this.state.isOpen) return;

// 		this.state.isOpen = true;
// 		this.state.managers.menuToggler.open();
// 		this.state.managers.restartBtn.open();
// 		this.state.managers.playDefaultGame.open();
// 		this.state.managers.menuBgManager.init();

// 		this.generalManager.managers.game.pause();
// 	}

// 	close() {
// 		if (!this.state.isInited || !this.state.isOpen) return;

// 		this.state.isOpen = false;
// 		this.state.managers.menuToggler.close();
// 		this.state.managers.restartBtn.close();
// 		this.state.managers.playDefaultGame.close();
// 		this.state.managers.menuBgManager.clear();

// 		this.generalManager.managers.game.unpause();
// 	}
// }


export default class MenuManager {
	constructor(generalManager) {
		this.generalManager = generalManager;

		this.state = {
			isOpen: false,
		}
	}

	open() {
		this.generalManager.DOM.menuWrapper.classList.add("is-open");
		this.state.isOpen = true;
		this.generalManager.DOM.menuToggler.innerHTML = "Close";
	}

	close() {
		if (!this.generalManager.managers.game.state.currentGame) return;
		
		this.generalManager.DOM.menuWrapper.classList.remove("is-open");
		this.state.isOpen = false;
		this.generalManager.DOM.menuToggler.innerHTML = "Menu";
	}

	toggle() {
		if (!this.state.isOpen) this.open();
		else this.close();
	}
}