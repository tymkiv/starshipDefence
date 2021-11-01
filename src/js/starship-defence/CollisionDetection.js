import { hitTestRectangle } from "./extraFunctions";

export default class CollisionDetection {
	constructor(generalManager) {
		this.generalManager = generalManager;

		this.generalManager.addListener("tick", this.detect.bind(this));
	}

	detect() {
		// if (this.generalManager.state.isPause) return;
		if (!this.generalManager.managers.game.state.currentGame) return;

		this.generalManager.state.bulletsArray.forEach((bullet) => {
			this.generalManager.state.asteroidsArray.forEach((asteroid) => {
				if (
					!bullet ||
					!bullet.graphics ||
					!asteroid ||
					!asteroid.asteroidSprite
				)
					return;

				if (hitTestRectangle(bullet.graphics, asteroid.asteroidSprite)) {
					bullet.destroy();
					asteroid.detonate();
				}
			});
		});
	}
}
