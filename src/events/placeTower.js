function placeTower(state) {
  if (state.activePlaceableTower && state.activePlaceableTowerIsPlaceable) {
    const tower = {
      type: state.activePlaceableTower,
      x: state.mousePos.x,
      y: state.mousePos.y,
    };

    tower.launchPikes = launchPikesFactory(tower);

    state.towers.push(tower);

    state.activePlaceableTower = 0;
    state.activePlaceableTowerIsPlaceable = false;
  }
}

function launchPikesFactory(tower) {

  return function launchPikes(state) {
    if (state.iteration % 50) return;

    let dx;
    let dy;

    for (let i = state.balloons.length - 1; i >= 0; i--) {
      const balloon = state.balloons[i];
      const a = tower.x - balloon.position.x;
      const b = tower.y - balloon.position.y;
      const balloonDistance = Math.sqrt(a * a + b * b);

      if (balloonDistance < 200) {
        dx = a / balloonDistance;
        dy = b / balloonDistance;

        break;
      }
    }

    if (!dx) return;

    state.pikes.push({
      tower,
      progress: 0,
      // maxProgress: 200,
      // speed:
      direction: {
        x: dx,
        y: dy,
      },
    });
  };
}

export default placeTower;
