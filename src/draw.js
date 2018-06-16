const gridCellSize = 35;
const gridWidth = 30;
const gridHeight = 25;
const routeBorderRadiusRatio = 0.7;

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
  [gridWidth, 20],
];

function run(canvas) {
  const _ = canvas.getContext('2d');


  let width, height;

  canvas.width = width = gridWidth * gridCellSize;
  canvas.height = height = gridHeight * gridCellSize;

  /* State */

  const state = {
    width,
    height,
    mousePos: { x: 0, y: 0 },
  };

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

    for (let i = 0; i < state.width + 1; i += gridCellSize) {
      _.beginPath();
      _.moveTo(i, 0);
      _.lineTo(i, state.height);
      _.stroke()
    }

    for (let j = 0; j < state.height + 1; j += gridCellSize) {
      _.beginPath();
      _.moveTo(0, j);
      _.lineTo(state.width, j);
      _.stroke()
    }

    /* Route */

    _.strokeStyle = 'LightBlue';
    _.lineWidth = gridCellSize;

    _.beginPath();
    _.moveTo(levelRouteMap[0][0] * gridCellSize, levelRouteMap[0][1] * gridCellSize);

    for (let i = 1; i < levelRouteMap.length; i++) {
      const point = levelRouteMap[i];

      _.lineTo(point[0] * gridCellSize, point[1] * gridCellSize);
    }

    _.stroke();

    _.strokeStyle = 'red';
    _.lineWidth = 3;

    let diffX = levelRouteMap[1][0] - levelRouteMap[0][0];
    let diffY = levelRouteMap[1][1] - levelRouteMap[0][1];

    let dX = diffY ? -routeBorderRadiusRatio : 0;
    let dY = diffX ? -routeBorderRadiusRatio : 0;

    _.beginPath();
    _.moveTo((levelRouteMap[0][0] + dX) * gridCellSize, (levelRouteMap[0][1] + dY) * gridCellSize);

    let nextDiffX, nextDiffY, aX, aY, aStart, aEnd, aAntiClockWise;

    for (let i = 1; i < levelRouteMap.length - 1; i++) {
      const point = levelRouteMap[i];
      const nextPoint = levelRouteMap[i + 1];

      nextDiffX = nextPoint[0] - point[0];
      nextDiffY = nextPoint[1] - point[1];

      // elbow left-up
      if (diffX > 0 && nextDiffY < 0) {
        dX = -1;
        dY = -routeBorderRadiusRatio;
        aX = -1;
        aY = -1;
        aStart = Math.PI / 2;
        aEnd = 0;
        aAntiClockWise = true;
      }
      // elbow up-right
      else if (diffY < 0 && nextDiffX > 0) {
        dX = -routeBorderRadiusRatio;
        dY = 1 - 2 * routeBorderRadiusRatio;
        aX = 1 - 2 * routeBorderRadiusRatio;
        aY = 1 - 2 * routeBorderRadiusRatio;
        aStart = -Math.PI;
        aEnd = -Math.PI / 2;
        aAntiClockWise = false;
      }
      // elbow right-down
      else if (diffX > 0 && nextDiffY > 0) {
        dX = 2 * routeBorderRadiusRatio - 1;
        dY = -routeBorderRadiusRatio;
        aX = 2 * routeBorderRadiusRatio - 1;
        aY = 1 - 2 * routeBorderRadiusRatio;
        aStart = -Math.PI / 2;
        aEnd = 0;
        aAntiClockWise = false;
      }
      // elbow down-left
      else if (diffY > 0 && nextDiffX < 0) {
        dX = routeBorderRadiusRatio;
        dY = 2 * routeBorderRadiusRatio - 1;
        aX = 2 * routeBorderRadiusRatio - 1;
        aY = 2 * routeBorderRadiusRatio - 1;
        aStart = 0;
        aEnd = Math.PI / 2;
        aAntiClockWise = false;
      }
      // elbow left-up
      else if (diffX < 0 && nextDiffY < 0) {
        dX = 1 - 2 * routeBorderRadiusRatio;
        dY = routeBorderRadiusRatio;  
        aX = 1 - 2 * routeBorderRadiusRatio;
        aY = 2 * routeBorderRadiusRatio - 1;
        aStart = Math.PI / 2;
        aEnd = Math.PI;
        aAntiClockWise = false;
      }
      _.lineTo((point[0] + dX) * gridCellSize, (point[1] + dY) * gridCellSize);
      _.arc((point[0] + aX) * gridCellSize, (point[1] + aY) * gridCellSize, (1 - routeBorderRadiusRatio) * gridCellSize, aStart, aEnd, aAntiClockWise);

      diffX = nextDiffX;
      diffY = nextDiffY;
    }
    _.stroke();
  }

  draw()
}

export default run;
