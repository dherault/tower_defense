import drawRoute from './drawRoute';
import drawTowers from './drawTowers';
import drawPlaceableTower from './drawPlaceableTower';
import drawBalloons from './drawBalloons';
import drawPikes from './drawPikes';
import placeTower from '../events/placeTower';
import { distance } from '../utils/math';

/* State */

const state = {
  iteration: 0,
  mousePos: { x: 0, y: 0 },
  isCanvasHovered: false,
  gridCellSize: 35,
  gridWidth: 30,
  gridHeight: 25,
  balloonSize: 20,
  activePlaceableTower: 0,
  balloons: [],
  towers: [],
  pikes: [],
  towerTypeToConfiguration: {
    1: {
      pikeFrequency: 50, // How often does a pike appear
      pikeSpeed: 2.2,
      pikeMaxDistance: 200,
      pikeStrength: 1,
    },
  },
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
};

state.levelRouteMap.push([state.gridWidth, 20]);

state.firstPosition = {
  x: state.levelRouteMap[0][0] * state.gridCellSize,
  y: state.levelRouteMap[0][1] * state.gridCellSize,
};

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

let levelRouteMapProgress = 0;

for (let i = 1; i < state.levelRouteMap.length; i++) {
  const tile = state.levelRouteMap[i];
  const previousTile = state.levelRouteMap[i - 1];

  const absDiffX = Math.abs(tile[0] - previousTile[0]) * state.gridCellSize;
  const absDiffY = Math.abs(tile[1] - previousTile[1]) * state.gridCellSize;

  levelRouteMapProgress += absDiffX + absDiffY;
}

state.levelRouteMapProgress = levelRouteMapProgress;

/* Balloons generation */

let currentBalloons = 0;
const maxBalloons = 10;
const frequency = 100;

function generateBalloons(state) {
  if (currentBalloons >= maxBalloons || state.iteration % frequency) return;

  currentBalloons++;

  state.balloons.push({
    progress: 0,
    strength: 3,
    position: state.firstPosition,
  });
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

  canvas.addEventListener('click', () => {
    placeTower(state);
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

    /* Towers */

    drawTowers(_, state);

    /* Balloons */

    drawBalloons(_, state);

    /* Pikes */

    drawPikes(_, state);
  }

  function iterate() {
    // Generate balloons
    generateBalloons(state);

    // Launch pikes
    state.towers.forEach(tower => tower.launchPikes(state));

    // Advance and recycle pikes
    const pikesToDelete = [];

    state.pikes.forEach((pike, i) => {
      const towerConfiguration = state.towerTypeToConfiguration[pike.tower.type];

      pike.position.x += pike.direction.x * towerConfiguration.pikeSpeed;
      pike.position.y += pike.direction.y * towerConfiguration.pikeSpeed;

      if (distance(pike.position, pike.tower.position) >= towerConfiguration.pikeMaxDistance) {
        pikesToDelete.push(i);
      }
    });

    // Advance and recycle balloons
    // Explode balloons
    const balloonsToDelete = [];

    state.balloons.forEach((balloon, i) => {
      balloon.progress += 1;

      if (balloon.progress >= state.levelRouteMapProgress) {
        balloonsToDelete.unshift(i);
      }

      for (let k = 0; k < state.pikes.length; k++) {
        const pike = state.pikes[k];

        if (distance(pike.position, balloon.position) < state.balloonSize) {
          balloon.strength -= state.towerTypeToConfiguration[pike.tower.type].pikeStrength;
          pikesToDelete.push(k);

          if (balloon.strength <= 0) {
            balloonsToDelete.unshift(i);
            break;
          }
        }
      }
    });

    balloonsToDelete.forEach(balloonIndex => {
      state.balloons.splice(balloonIndex, 1);
    });

    pikesToDelete.sort().reverse().forEach(pikeIndex => {
      state.pikes.splice(pikeIndex, 1);
    });

    draw();

    state.iteration++;

    if (state.iteration === 100000) state.iteration = 0;
  }

  draw();
  const frameRate = 60;
  setInterval(iterate, 1000 / frameRate);
}

function setActivePlaceableTower(n, fn) {
  state.activePlaceableTower = n;
  state.activePlaceableTowerEndFn = fn;
}

export { run, setActivePlaceableTower };
