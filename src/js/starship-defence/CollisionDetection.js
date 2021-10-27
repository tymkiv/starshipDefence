import { hitTestRectangle } from "./extraFunctions";

export default class CollisionDetection {
	constructor(generalManager) {
		this.generalManager = generalManager;

		this.generalManager.addListener("tick", this.detect.bind(this));
	}

	detect() {
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
					asteroid.destroy();
				}
			});
		});
	}
}
