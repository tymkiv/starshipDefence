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

		this.resizeHandler = this.onResize.bind(this);
		this.generalManager.addListener("resize", this.resizeHandler);
	}

	init() {
		this.state.isInited = true;
	}

	onResize() {} // eslint-disable-line class-methods-use-this

	onDestroy() {
		this.generalManager.removeListener("resize", this.resizeHandler);
	}
}
