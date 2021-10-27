function hitTestRectangle(r1, r2) {
	if (!r1 || !r2 || !r1.x || !r1.y || !r2.x || !r2.y) return false;
	let hit = false;

	const r1CenterX = r1.x + r1.width / 2;
	const r1CenterY = r1.y + r1.height / 2;
	const r2CenterX = r2.x + r2.width / 2;
	const r2CenterY = r2.y + r2.height / 2;

	const r1HalfWidth = r1.width / 2;
	const r1HalfHeight = r1.height / 2;
	const r2HalfWidth = r2.width / 2;
	const r2HalfHeight = r2.height / 2;

	const vx = r1CenterX - r2CenterX;
	const vy = r1CenterY - r2CenterY;

	const combinedHalfWidths = r1HalfWidth + r2HalfWidth;
	const combinedHalfHeights = r1HalfHeight + r2HalfHeight;

	if (Math.abs(vx) < combinedHalfWidths) {
		if (Math.abs(vy) < combinedHalfHeights) {
			hit = true;
		} else {
			hit = false;
		}
	} else {
		hit = false;
	}
	return hit;
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

export { hitTestRectangle, getRandomArbitrary };
