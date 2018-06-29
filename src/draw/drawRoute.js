import constants from './constants';

function drawRoute(_, levelRouteMap) {
  /* Route */

  const routeBorderRadiusRatio = 0.7;

  _.strokeStyle = 'LightBlue';
  _.lineWidth = constants.gridCellSize;

  _.beginPath();
  _.moveTo(levelRouteMap[0][0] * constants.gridCellSize, levelRouteMap[0][1] * constants.gridCellSize);

  for (let i = 1; i < levelRouteMap.length; i++) {
    const point = levelRouteMap[i];

    _.lineTo(point[0] * constants.gridCellSize, point[1] * constants.gridCellSize);
  }

  _.stroke();

  _.strokeStyle = 'red';
  _.lineWidth = 3;

  let diffX = levelRouteMap[1][0] - levelRouteMap[0][0];
  let diffY = levelRouteMap[1][1] - levelRouteMap[0][1];

  let dX = diffY ? -routeBorderRadiusRatio : 0;
  let dY = diffX ? -routeBorderRadiusRatio : 0;

  _.beginPath();
  _.moveTo((levelRouteMap[0][0] + dX) * constants.gridCellSize, (levelRouteMap[0][1] + dY) * constants.gridCellSize);

  let nextDiffX, nextDiffY, aX, aY, aStart, aEnd, aAntiClockWise;

  for (let i = 1; i < levelRouteMap.length - 1; i++) {
    const point = levelRouteMap[i];
    const nextPoint = levelRouteMap[i + 1];

    nextDiffX = nextPoint[0] - point[0];
    nextDiffY = nextPoint[1] - point[1];

    // elbow right-up
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
    // elbow up-left
    else if (diffY < 0 && nextDiffX < 0) {
      dX = -routeBorderRadiusRatio;
      dY = 1;
      aX = -1;
      aY = 1;
      aStart = 0;
      aEnd = -Math.PI / 2;
      aAntiClockWise = true;
    }
    // elbow left-down
    else if (diffX < 0 && nextDiffY > 0) {
      dX = 1;
      dY = routeBorderRadiusRatio;
      aX = 1;
      aY = 1;
      aStart = -Math.PI / 2;
      aEnd = Math.PI;
      aAntiClockWise = true;
    }
    // elbow down-right
    else if (diffY > 0 && nextDiffX > 0) {
      dX = routeBorderRadiusRatio;
      dY = -1;
      aX = 1;
      aY = -1;
      aStart = Math.PI;
      aEnd = Math.PI / 2;
      aAntiClockWise = true;
    }

    _.lineTo((point[0] + dX) * constants.gridCellSize, (point[1] + dY) * constants.gridCellSize);
    _.arc((point[0] + aX) * constants.gridCellSize, (point[1] + aY) * constants.gridCellSize, (1 - routeBorderRadiusRatio) * constants.gridCellSize, aStart, aEnd, aAntiClockWise);

    diffX = nextDiffX;
    diffY = nextDiffY;
  }

  _.stroke();
}

export default drawRoute;
