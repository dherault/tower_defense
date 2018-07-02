function drawPikes(_, state) {
  _.fillStyle = 'black';

  state.pikes.forEach(pike => {
    _.beginPath();
    _.arc(pike.position.x, pike.position.y, 3, 0, 2 * Math.PI);
    _.closePath();
    _.fill();
  });
}

export default drawPikes;
