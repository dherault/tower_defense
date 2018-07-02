function drawTowers(_, state) {

  _.fillStyle = 'Grey';

  state.towers.forEach(tower => {
    _.beginPath();
    _.arc(tower.position.x, tower.position.y, 20, 0, 2 * Math.PI);
    _.closePath();
    _.fill();
  });
}

export default drawTowers;
