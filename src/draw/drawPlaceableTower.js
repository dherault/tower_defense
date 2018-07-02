function drawPlaceableTower(_, state) {
  if (!state.activePlaceableTower || !state.isCanvasHovered) return;

  const { mousePos } = state;

  const whithinForbidenTile = state.levelRouteMapTiles.some(tile => (
    mousePos.x >= tile[0] * state.gridCellSize - 20
    && mousePos.x <= (tile[0] + 1) * state.gridCellSize + 20
    && mousePos.y >= tile[1] * state.gridCellSize - 20
    && mousePos.y <= (tile[1] + 1) * state.gridCellSize + 20
  ));

  state.activePlaceableTowerIsPlaceable = !whithinForbidenTile;

  _.fillStyle = _.strokeStyle = whithinForbidenTile ? 'Red' : 'Grey';
  _.beginPath();
  _.arc(mousePos.x, mousePos.y, 20, 0, 2 * Math.PI);
  _.closePath();
  _.fill();

  _.lineWidth = 1;
  _.beginPath();
  _.arc(mousePos.x, mousePos.y, 200, 0, 2 * Math.PI);
  _.closePath();
  _.stroke();
}

export default drawPlaceableTower;
