function drawCommands(_, state) {
  _.strokeStyle = state.backgroundColor;
  _.lineWidth = 3;
  _.strokeRect(0, state.height - state.commandsSize, state.width, state.commandsSize);

}

export default drawCommands;
