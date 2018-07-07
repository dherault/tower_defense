import buttonClick from './buttonClick';

function towerButtonClick(state, n) {
  const config = state.towerTypeToConfiguration[n].button;

  buttonClick(state, config.x, config.y, config.width, config.height, () => {
    if (state.activePlaceableTower === n) {
      state.activePlaceableTower = 0;
    }
    else {
      state.activePlaceableTower = n;
    }
  });
}

export default towerButtonClick;
