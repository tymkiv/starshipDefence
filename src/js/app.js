import sayHello from "./lib/sayHello";
import StarshipDefenceGame from "./starship-defence";

sayHello();

new StarshipDefenceGame({ // eslint-disable-line no-new
	DOMcontainer: document.getElementById("js-game-container"),
	menuToggler: document.getElementById("js-game-menu-toggler"),
	menuWrapper: document.getElementById("js-game-menu-wrapper"),
	restartBtn: document.getElementById("js-game-menu-restart"),
	defaultGameBtn: document.getElementById("js-game-menu-default"),
	bulletInfo: document.getElementById("js-game-bullet-info"),
	bulletUsed: document.getElementById("js-game-bullet-used"),
	bulletNumber: document.getElementById("js-game-bullet-number"),
	payment: document.getElementById("js-payment"),
	paymentClose: document.getElementById("js-payment-close"),
	joke: document.getElementById("js-joke"),
});
