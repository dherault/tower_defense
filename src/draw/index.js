import contants from './constants';
import drawRoute from './drawRoute';
import drawPlaceableTower from './drawPlaceableTower';

const levelRouteMap = [
  [0, 8],
  [10, 8],
  [10, 5],
  [20, 5],
  [20, 15],
  [15, 15],
  [15, 10],
  [10, 10],
  [10, 20],
  [contants.gridWidth, 20],
];

const state = {
  mousePos: { x: 0, y: 0 },
  activePlaceableTower: 0,
};

function run(canvas) {
  const _ = canvas.getContext('2d');

  canvas.width = state.width = contants.gridWidth * contants.gridCellSize;
  canvas.height = state.height = contants.gridHeight * contants.gridCellSize;

  canvas.addEventListener('mousemove', e => {
    state.mousePos = {
      x: e.clientX,
      y: e.clientY,
    };
  });

  function draw() {
    _.clearRect(0, 0, state.width, state.height);

    /* Grid */

    _.strokeStyle = 'LightGrey';
    _.lineWidth = 1;

    for (let i = 0; i < state.width + 1; i += contants.gridCellSize) {
      _.beginPath();
      _.moveTo(i, 0);
      _.lineTo(i, state.height);
      _.stroke()
    }

    for (let j = 0; j < state.height + 1; j += contants.gridCellSize) {
      _.beginPath();
      _.moveTo(0, j);
      _.lineTo(state.width, j);
      _.stroke()
    }

    /* Route */

    drawRoute(_, levelRouteMap);

    /* Placeable tower */

    drawPlaceableTower(_, state);
  }

  draw()
}

function setActivePlaceableTower(n) {
  state.activePlaceableTower = n;
}

export { run, setActivePlaceableTower };
