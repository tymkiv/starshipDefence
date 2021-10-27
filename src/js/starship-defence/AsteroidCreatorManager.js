import AsteroidManager from "./AsteroidManager";
import { getRandomArbitrary } from "./extraFunctions";

export default class AsteroidCreatorManager {
	constructor(generalManager) {
		this.generalManager = generalManager;
	}

	init(asteroidData, explosionData) {
		for (let i = 0; i < 10; i++) {
			const asteroid = new AsteroidManager(this.generalManager);
			asteroid.init(
				asteroidData,
				explosionData,
				getRandomArbitrary(
					this.generalManager.settings.asteroidSizeW / 2,
					100 - this.generalManager.settings.asteroidSizeW / 2
				),
				getRandomArbitrary(
					this.generalManager.settings.asteroidSizeH / 2,
					50 - this.generalManager.settings.asteroidSizeH / 2
				)
			);
		}
	}
}
