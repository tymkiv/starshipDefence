export default class GameManager {
	constructor(generalManager, onWin = () => {}, onLose) {
		this.generalManager = generalManager;

		this.onWin = onWin;

		this.state = {
			currentGame: null,
			isPause: true,
		}

		this.generalManager.addListener("tick", this.onTick.bind(this));

	}

	pause() {
		this.state.isPause = true;
	}
	
	unpause() {
		if (!this.state.currentGame) return;
		this.state.isPause = false;
	}

	toggle() {
		if (!this.state.currentGame) return;

		this.state.isPause = !this.state.isPause;
	}

	createDefaultGame() {
		if (this.state.currentGame) this.deleteCurrentGame();

		this.state.currentGame = "default";
		this.generalManager.DOM.restartBtn.classList.remove("is-hidden");
		this.generalManager.managers.asteroidCreatorManager.create();
		this.generalManager.managers.starship.create();
		this.unpause();
	}
	

	deleteCurrentGame() {
		if (!this.state.currentGame) return;
		
		this.state.currentGame = null;
		// this.generalManager.DOM.restartBtn.classList.add("is-hidden");
		this.generalManager.managers.asteroidCreatorManager.destroy();
		this.generalManager.managers.starship.onDestroy();
		this.generalManager.state.bulletsArray.forEach((bullet) => {
			bullet.destroyInstantly();
		});
		this.pause();
	}

	checkDefaultGame() {
		if (this.generalManager.state.asteroidsArray.length === 0) {
			this.onWin();
			this.deleteCurrentGame();
		}
	}

	onTick() {
		if (this.state.currentGame === "default") this.checkDefaultGame();
	}
}