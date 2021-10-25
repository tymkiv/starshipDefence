export default class Manager {
	constructor(generalManager) {
		this.generalManager = generalManager;

		this.state = {
			isInited: false,
			width: null,
			height: null,
			x: null,
			y: null,
		};

		this.generalManager.addListener("resize", this.onResize.bind(this));
	}

	init() {
		this.state.isInited = true;
	}

	onResize() {
		console.log("resize from Manager");
		return this;
	}
}
