export default class GameManager {
	constructor(generalManager, onWin = () => {}, onLose = () => {}) {
		this.generalManager = generalManager;

		this.onWin = onWin;
		this.onLose = onLose;

		this.state = {
			currentGame: null,
			previousGame: null,
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

	createGame(nameOfGame) {
		console.log(nameOfGame);
		if (this.state.currentGame) this.deleteCurrentGame();

		this.state.currentGame = nameOfGame;
		this.state.previousGame = nameOfGame;
		this.generalManager.DOM.restartBtn.classList.remove("is-hidden");
		this.generalManager.managers.asteroidCreatorManager.create();
		this.generalManager.managers.starship.create(this.generalManager.settings.games[nameOfGame].maxBullet);
		this.generalManager.state.bulletNumber = 0;
		this.generalManager.DOM.bulletInfo.classList.remove("is-hidden");
		this.unpause();
		this.generalManager.managers.menu.close();
	} 

	checkCurrentGame() {
		if (this.state.isPause) return;

		this.generalManager.DOM.bulletUsed.innerHTML = this.generalManager.state.bulletNumber;
		this.generalManager.DOM.bulletNumber.innerHTML = this.generalManager.settings.games[this.state.currentGame].maxBullet;
		if (
			this.generalManager.state.bulletNumber >= this.generalManager.settings.games[this.state.currentGame].maxBullet && 
			this.generalManager.state.asteroidsArray.length > 0 &&
			this.generalManager.state.bulletsArray.length === 0
		) {
				this.onLose();
				this.deleteCurrentGame();
		} else if (this.generalManager.state.asteroidsArray.length === 0) {
			this.onWin();
			this.deleteCurrentGame();
		}
	}

	restartCurrentGame() {
		this.createGame(this.state.previousGame);
	}

	// createDefaultGame() {
	// 	if (this.state.currentGame) this.deleteCurrentGame();

	// 	this.state.currentGame = "default";
	// 	this.generalManager.DOM.restartBtn.classList.remove("is-hidden");
	// 	this.generalManager.managers.asteroidCreatorManager.create();
	// 	this.generalManager.managers.starship.create(this.rules.defaultGame.maxBullet);
	// 	this.generalManager.state.bulletNumber = 0;
	// 	this.generalManager.DOM.bulletInfo.classList.remove("is-hidden");
	// 	this.unpause();
	// }
	

	deleteCurrentGame() {
		if (!this.state.currentGame) return;
		
		this.state.currentGame = null;
		this.generalManager.DOM.bulletInfo.classList.add("is-hidden");
		// this.generalManager.DOM.restartBtn.classList.add("is-hidden");
		this.generalManager.managers.asteroidCreatorManager.destroy();
		this.generalManager.managers.starship.onDestroy();
		this.generalManager.state.bulletsArray.forEach((bullet) => {
			bullet.destroyInstantly();
		});
		this.pause();
	}

	// checkDefaultGame() {
	// 	this.generalManager.DOM.bulletUsed.innerHTML = this.generalManager.state.bulletNumber;
	// 	this.generalManager.DOM.bulletNumber.innerHTML = this.rules.defaultGame.maxBullet;
	// 	if (
	// 		this.generalManager.state.bulletNumber >= this.rules.defaultGame.maxBullet && 
	// 		this.generalManager.state.asteroidsArray.length > 0 &&
	// 		this.generalManager.state.bulletsArray.length === 0
	// 	) {
	// 			this.onLose();
	// 			this.deleteCurrentGame();
	// 	} else if (this.generalManager.state.asteroidsArray.length === 0) {
	// 		this.onWin();
	// 		this.deleteCurrentGame();
	// 	}
	// }

	onTick() {
		if (this.state.currentGame) this.checkCurrentGame();
	}
}