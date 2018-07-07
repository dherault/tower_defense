function buttonClick(state, x, y, width, height, onClick) {
  if (
    state.mousePos.x >= x
    && state.mousePos.x <= x + width
    && state.mousePos.y >= y
    && state.mousePos.y <= y + height
  ) {
    onClick();
  }
}

export default buttonClick;
