import React, { Component } from 'react';
import run from './draw';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();

    // this.state = {
    //   activePlaceableTower: 0,
    // };
  }

  componentDidMount() {
    run(this.canvasRef.current);
  }

  // handleTowerClick(n) {
  //   const { activePlaceableTower } = this.state;
  //
  //   if (activePlaceableTower === n) {
  //     this.setState({ activePlaceableTower: 0 });
  //
  //     setActivePlaceableTower(0);
  //   }
  //   else {
  //     this.setState({ activePlaceableTower: n });
  //
  //     setActivePlaceableTower(n, () => this.setState({ activePlaceableTower: 0 }));
  //   }
  // }

  // handleCanvasClick = () => {
  //   const { activePlaceableTower } = this.state;
  //
  //   if (activePlaceableTower) {
  //     this.setState({ activePlaceableTower: 0 });
  //   }
  // }

  render() {
    return (
      <div className="App">
        <canvas
          ref={this.canvasRef}
          className="canvas"
          onClick={this.handleCanvasClick}
        />
      </div>
    );
  }
}

export default App;
