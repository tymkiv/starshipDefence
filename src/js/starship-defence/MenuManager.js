export default class MenuManager {
	constructor(generalManager) {
		this.generalManager = generalManager;

		this.state = {
			isOpen: false,
			isDisabled: false,
		}
	}

	open() {
		if (this.state.isDisabled) return;
		this.generalManager.DOM.menuWrapper.classList.add("is-open");
		this.state.isOpen = true;
		this.generalManager.DOM.menuToggler.innerHTML = "Close";
	}

	close() {
		if (this.state.isDisabled) return;
		if (!this.generalManager.managers.game.state.currentGame) return;

		this.generalManager.DOM.menuWrapper.classList.remove("is-open");
		this.state.isOpen = false;
		this.generalManager.DOM.menuToggler.innerHTML = "Menu";
	}

	disable() {
		this.state.isDisabled = true;
	}

	undisable() {
		this.state.isDisabled = false;
	}

	toggle() {
		if (this.state.isDisabled) return;
		if (!this.state.isOpen) this.open();
		else this.close();
	}
}