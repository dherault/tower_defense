function placeTower(state) {
  if (state.activePlaceableTower && state.activePlaceableTowerIsPlaceable) {
    const tower = {
      type: state.activePlaceableTower,
      position: {
        x: state.mousePos.x,
        y: state.mousePos.y,
      },
    };

    tower.launchPikes = launchPikesFactory(tower);

    state.towers.push(tower);

    state.activePlaceableTower = 0;
    state.activePlaceableTowerIsPlaceable = false;

    if (typeof state.activePlaceableTowerEndFn === 'function') {
      state.activePlaceableTowerEndFn();
    }
  }
}

function launchPikesFactory(tower) {

  return function launchPikes(state) {
    const towerConfiguration = state.towerTypeToConfiguration[tower.type];

    if (!state.balloons.length || state.iteration % towerConfiguration.pikeFrequency) return;

    let dx;
    let dy;

    for (let i = 0; i < state.balloons.length; i++) {
      const balloon = state.balloons[i];
      const a = balloon.position.x - tower.position.x;
      const b = balloon.position.y - tower.position.y;
      const balloonDistance = Math.sqrt(a * a + b * b);

      if (balloonDistance < towerConfiguration.pikeMaxDistance) {
        dx = a / balloonDistance;
        dy = b / balloonDistance;

        break;
      }
    }

    if (!dx) return;

    state.pikes.push({
      tower,
      position: {
        x: tower.position.x,
        y: tower.position.y,
      },
      direction: {
        x: dx,
        y: dy,
      },
    });
  };
}

export default placeTower;
