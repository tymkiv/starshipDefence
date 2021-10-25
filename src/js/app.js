import sayHello from "./lib/sayHello";
import StarshipDefenceGame from "./starship-defence";

sayHello();

new StarshipDefenceGame(document.getElementById("game-container")); // eslint-disable-line no-new
