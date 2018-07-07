import drawCommands from './drawCommands';
import drawRoute from './drawRoute';
import drawTowers from './drawTowers';
import drawPlaceableTower from './drawPlaceableTower';
import drawBalloons from './drawBalloons';
import drawPikes from './drawPikes';
import placeTowerClick from '../events/placeTowerClick';
import towerButtonClick from '../events/towerButtonClick';
import { distance } from '../utils/math';

/* State */

const gridCellSize = 30;
const gridWidth = 35;
const gridHeight = 30;
const commandsSize = 180;
const commandsHeight = gridHeight * gridCellSize - commandsSize;
const state = {
  // Main
  iteration: 0,
  score: 0,
  outBalloonsCount: 0,
  // Events
  mousePos: { x: 0, y: 0 },
  isCanvasHovered: false,
  activePlaceableTower: 0,
  // Dimensions
  gridCellSize,
  gridWidth,
  gridHeight,
  commandsSize,
  commandsHeight,
  balloonSize: 20,
  // Items
  balloons: [],
  towers: [],
  pikes: [],
  // Config
  towerTypeToConfiguration: {
    1: {
      towerSize: 25,
      towerColor: 'DarkGrey',
      pikeFrequency: 50, // How often does a pike appear
      pikeSpeed: 2.2,
      pikeMaxDistance: 200,
      pikeStrength: 1,
      button: {
        x: 30,
        y: commandsHeight + 30,
        width: 120,
        height: 120,
        text: 'Shooter',
        textX: 48,
        textY: commandsHeight + 95,
      },
    },
  },
  levelRouteMap: [
    [0, 7],
    [10, 7],
    [10, 3],
    [25, 3],
    [25, 15],
    [17, 15],
    [17, 12],
    [10, 12],
    [10, 20],
    [gridWidth, 20],
  ],
  backgroundColor: '#8ce866',
};

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

  /* Events */

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
    placeTowerClick(state);

    Object.keys(state.towerTypeToConfiguration).forEach(key => {
      towerButtonClick(state, key);
    });
  });

  /* Draw */

  function draw() {
    _.clearRect(0, 0, state.width, state.height);

    /* Commands */

    drawCommands(_, state);

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
        state.outBalloonsCount += 1;
        state.score -= balloon.strength * 15;
      }

      for (let k = 0; k < state.pikes.length; k++) {
        const pike = state.pikes[k];

        if (distance(pike.position, balloon.position) < state.balloonSize) {
          balloon.strength -= state.towerTypeToConfiguration[pike.tower.type].pikeStrength;
          pikesToDelete.push(k);
          state.score += 10;

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

export default run;
