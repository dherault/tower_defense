function drawBalloons(_, state) {

  state.balloons.forEach(balloon => {
    const position = balloonsProgressToPosition(balloon.progress, state);

    _.fillStyle = 'Red';
    _.beginPath();
    _.arc(position.x, position.y, 20, 0, 2 * Math.PI);
    _.closePath();
    _.fill();
  });
}

function balloonsProgressToPosition(progress, state) {
  let counter = 0;

  for (let i = 1; i < state.levelRouteMap.length; i++) {
    const tile = state.levelRouteMap[i];
    const previousTile = state.levelRouteMap[i - 1];

    const diffX = (tile[0] - previousTile[0]) * state.gridCellSize;
    const diffY = (tile[1] - previousTile[1]) * state.gridCellSize;
    if (diffX) {
      if (counter + Math.abs(diffX) >= progress) {

        return {
          x: previousTile[0] * state.gridCellSize + (progress - counter) * (diffX > 0 ? 1 : -1),
          y: previousTile[1] * state.gridCellSize,
        };
      }

      counter += Math.abs(diffX);
    }
    else {
      if (counter + Math.abs(diffY) >= progress) {
        return {
          x: previousTile[0] * state.gridCellSize,
          y: previousTile[1] * state.gridCellSize + (progress - counter) * (diffY > 0 ? 1 : -1),
        };
      }

      counter += Math.abs(diffY);
    }
  }
}

export default drawBalloons;