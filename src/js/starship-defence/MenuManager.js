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