import React, { Component } from 'react';
import run from './draw';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    run(this.canvasRef.current);
  }

  render() {
    return (
      <div className="App">
        <canvas ref={this.canvasRef} className="canvas" />
      </div>
    );
  }
}

export default App;
