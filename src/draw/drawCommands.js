function drawCommands(_, state) {
  _.lineWidth = 4;
  _.strokeStyle = state.backgroundColor;
  _.strokeRect(0, state.commandsHeight, state.width, state.commandsSize);

  _.font = '22px sans-serif';
  _.fillText(`Score: ${state.score}`, state.width - 130, state.commandsHeight + 40);
  _.fillText(`Out: ${state.outBalloonsCount}`, state.width - 130, state.commandsHeight + 70);

  drawFirstTowerButton(_, state);
}

function drawFirstTowerButton(_, state) {
  _.lineWidth = 2;
  _.fillStyle = state.backgroundColor;

  const config = state.towerTypeToConfiguration[1].button;

  const firstTowerActive = state.activePlaceableTower === 1;
  _[firstTowerActive ? 'fillRect' : 'strokeRect'](config.x, config.y, config.width, config.height);

  _.font = 'bold 22px sans-serif';
  _.fillStyle = firstTowerActive ? 'white' : state.backgroundColor;
  _.fillText(config.text, config.textX, config.textY);
}

export default drawCommands;
