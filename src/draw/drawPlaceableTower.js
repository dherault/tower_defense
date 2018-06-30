function drawPlaceableTower(_, state) {
  if (!state.activePlaceableTower || !state.isCanvasHovered) return;

  const { mousePos } = state;

  _.fillStyle = 'Grey';
  _.beginPath();
  _.arc(mousePos.x, mousePos.y, 20, 0, 2 * Math.PI);
  _.closePath();
  _.fill();

}

export default drawPlaceableTower;
