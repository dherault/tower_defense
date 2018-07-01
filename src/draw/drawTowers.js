function drawTowers(_, state) {

  _.fillStyle = 'Grey';

  state.towers.forEach(tower => {
    _.beginPath();
    _.arc(tower.x, tower.y, 20, 0, 2 * Math.PI);
    _.closePath();
    _.fill();
  });
}

export default drawTowers;
