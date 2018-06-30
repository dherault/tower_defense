import drawRoute from './drawRoute';
import drawPlaceableTower from './drawPlaceableTower';
import drawBalloons from './drawBalloons';

const state = {
  mousePos: { x: 0, y: 0 },
  isCanvasHovered: false,
  gridCellSize: 35,
  gridWidth: 30,
  gridHeight: 25,
  activePlaceableTower: 0,
  levelRouteMap: [
    [0, 8],
    [10, 8],
    [10, 5],
    [20, 5],
    [20, 15],
    [15, 15],
    [15, 10],
    [10, 10],
    [10, 20],
  ],
  balloons: [
    {
      strength: 1,
      progress: 0,
    },
  ],
};

state.levelRouteMap.push([state.gridWidth, 20]);

/* levelRouteMapTiles */

const levelRouteMapTiles = [];

for (let i = 1; i < state.levelRouteMap.length; i++) {

  const tile = state.levelRouteMap[i];
  const previousTile = state.levelRouteMap[i - 1];
  const diffX = tile[0] - previousTile[0];

  if (diffX) {
    const direction = diffX > 0 ? 1 : -1;

    for (let k = previousTile[0]; k !== tile[0] + direction; k += direction) {
      levelRouteMapTiles.push([k, tile[1]]);
      levelRouteMapTiles.push([k, tile[1] - 1]);
    }

    const lefterTile = tile[0] < previousTile[0] ? tile : previousTile;

    levelRouteMapTiles.push([lefterTile[0] - 1, lefterTile[1]]);
    levelRouteMapTiles.push([lefterTile[0] - 1, lefterTile[1] - 1]);
  }
  else {
    const direction = tile[1] - previousTile[1] > 0 ? 1 : -1;

    for (let k = previousTile[1]; k !== tile[1] + direction; k += direction) {
      levelRouteMapTiles.push([tile[0], k]);
      levelRouteMapTiles.push([tile[0] - 1, k]);
    }

    const upperTile = tile[1] < previousTile[1] ? tile : previousTile;

    levelRouteMapTiles.push([upperTile[0], upperTile[1] - 1]);
    levelRouteMapTiles.push([upperTile[0] - 1, upperTile[1] - 1]);
  }
}

state.levelRouteMapTiles = levelRouteMapTiles;

/* levelRouteMapProgress */

for (let i = 1; i < state.levelRouteMap.length; i++) {
  const tile = state.levelRouteMap[i];
  const previousTile = state.levelRouteMap[i - 1];

}

/* Run */

function run(canvas) {
  const _ = canvas.getContext('2d');

  canvas.width = state.width = state.gridWidth * state.gridCellSize;
  canvas.height = state.height = state.gridHeight * state.gridCellSize;

  canvas.addEventListener('mousemove', e => {
    state.mousePos = {
      x: e.layerX,
      y: e.layerY,
    };
  });

  canvas.addEventListener('mouseenter', () => {
    state.isCanvasHovered = true;
  });

  canvas.addEventListener('mouseleave', () => {
    state.isCanvasHovered = false;
  });

  function draw() {
    _.clearRect(0, 0, state.width, state.height);

    /* Grid */

    _.strokeStyle = 'LightGrey';
    _.lineWidth = 1;

    for (let i = 0; i < state.width + 1; i += state.gridCellSize) {
      _.beginPath();
      _.moveTo(i, 0);
      _.lineTo(i, state.height);
      _.stroke();
    }

    for (let j = 0; j < state.height + 1; j += state.gridCellSize) {
      _.beginPath();
      _.moveTo(0, j);
      _.lineTo(state.width, j);
      _.stroke();
    }

    /* Route */

    drawRoute(_, state);

    /* Placeable tower */

    drawPlaceableTower(_, state);

    /* Balloons */

    drawBalloons(_, state);
  }

  function iterate() {
    state.balloons.forEach(balloon => {
      balloon.progress += 1;
    });

    draw();
  }

  draw();
  const frameRate = 60;
  setInterval(iterate, 1000 / frameRate);
}

function setActivePlaceableTower(n) {
  state.activePlaceableTower = n;
}

export { run, setActivePlaceableTower };
