import { distance } from '../utils/math';

function drawPlaceableTower(_, state) {
  if (!state.activePlaceableTower || !state.isCanvasHovered) return;

  const { mousePos } = state;

  const whithinForbidenTile = state.levelRouteMapTiles.some(tile => (
    mousePos.x >= tile[0] * state.gridCellSize - 20
    && mousePos.x <= (tile[0] + 1) * state.gridCellSize + 20
    && mousePos.y >= tile[1] * state.gridCellSize - 20
    && mousePos.y <= (tile[1] + 1) * state.gridCellSize + 20
  ));

  const withinAnotherTower = state.towers.some(tower => (
    distance(tower.position, mousePos) <= state.towerTypeToConfiguration[tower.type].towerSize + state.towerTypeToConfiguration[state.activePlaceableTower].towerSize
  ));

  state.activePlaceableTowerIsPlaceable = !(whithinForbidenTile || withinAnotherTower);

  const configuration = state.towerTypeToConfiguration[state.activePlaceableTower];

  _.fillStyle = _.strokeStyle = state.activePlaceableTowerIsPlaceable ? configuration.towerColor : 'Red';
  _.beginPath();
  _.arc(mousePos.x, mousePos.y, configuration.towerSize, 0, 2 * Math.PI);
  _.closePath();
  _.fill();

  _.lineWidth = 1;
  _.beginPath();
  _.arc(mousePos.x, mousePos.y, configuration.pikeMaxDistance, 0, 2 * Math.PI);
  _.closePath();
  _.stroke();
}

export default drawPlaceableTower;
