function drawTowers(_, state) {


  state.towers.forEach(tower => {
    const configuration = state.towerTypeToConfiguration[tower.type];

    _.fillStyle = configuration.towerColor;
    _.beginPath();
    _.arc(tower.position.x, tower.position.y, configuration.towerSize, 0, 2 * Math.PI);
    _.closePath();
    _.fill();
  });
}

export default drawTowers;
