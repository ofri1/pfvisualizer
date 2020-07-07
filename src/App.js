import React, { Component } from "react";
import "./App.css";
import Node from "./components/node";

const strList = ["Pick a start", "Pick an end", "Place obstacles"];
const size = 10;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,
      nodes: [],
      start: { x: -1, y: -1 },
      end: { x: -1, y: -1 },
      order: [],
      result: { str: "", color: "" },
    };

    for (let i = 0; i < size; i++) {
      const tcols = [];
      for (let j = 0; j < size; j++) {
        tcols.push({ x: i, y: j, ntype: 0, color: 0 });
      }
      this.state.nodes.push(tcols);
    }
  }

  changeType(x, y, value) {
    const newNodes = this.state.nodes;
    const node = newNodes[x][y];
    const newNode = {
      ...node,
      ntype: value,
    };
    newNodes[x][y] = newNode;

    this.setState({ nodes: newNodes });
  }

  changePrev(x, y, prevx, prevy) {
    const newNodes = this.state.nodes;
    const nodePrev = newNodes[x][y].prev;
    const newPrev = {
      ...nodePrev,
      x: prevx,
      y: prevy,
    };
    newNodes[x][y].prev = newPrev;

    this.setState({ nodes: newNodes });
  }

  changeColor(x, y, value) {
    const newNodes = this.state.nodes;
    const node = newNodes[x][y];
    const newNode = {
      ...node,
      color: value,
    };
    newNodes[x][y] = newNode;

    this.setState({ nodes: newNodes });
  }

  changeStage(x, y) {
    if (this.state.stage === 0) {
      this.setState({ stage: 1, start: { x: x, y: y } });
      this.changeType(x, y, 1);
      this.changeColor(x, y, 1);
    } else if (this.state.stage === 1) {
      this.setState({ stage: 2, end: { x: x, y: y } });
      this.changeType(x, y, 2);
      this.changeColor(x, y, 2);
    } else if (this.state.stage === 2) {
      this.changeType(x, y, 3);
      this.changeColor(x, y, 3);
    }
  }

  colorNodes(finished = true) {
    for (let i = 0; i < this.state.order.length; i++) {
      let node = this.state.order[i];
      setTimeout(() => {
        if (
          !(node.x === this.state.end.x && node.y === this.state.end.y) &&
          !(node.x === this.state.start.x && node.y === this.state.start.y)
        ) {
          this.changeColor(this.state.order[i].x, this.state.order[i].y, 5);
        }
      }, i * 200);
    }

    if (!finished) {
      setTimeout(() => {
        this.setState({ result: { str: "Failure!", color: "Failure-h1" } });
        this.setState({ stage: 4 });
      }, this.state.order.length * 200);
    } else {
      let routeOrder = [];

      let node = this.state.nodes[this.state.end.x][this.state.end.y].prev;
      while (
        !(node.x === this.state.start.x && node.y === this.state.start.y)
      ) {
        routeOrder.unshift(node);
        node = this.state.nodes[node.x][node.y].prev;
      }

      for (let i = 0; i < routeOrder.length; i++) {
        setTimeout(() => {
          this.changeColor(routeOrder[i].x, routeOrder[i].y, 6);
        }, (i + this.state.order.length) * 200);
      }

      setTimeout(() => {
        this.setState({ result: { str: "Success!", color: "Success-h1" } });
        this.setState({ stage: 4 });
      }, (this.state.order.length + routeOrder.length) * 200);
    }
  }

  handleStart() {
    let stack = [this.state.start];
    let count = 1;
    this.setState({ stage: 3 });
    while (stack.length > 0 && count < 500) {
      count++;
      const curNode = stack.shift();
      const curX = curNode.x;
      const curY = curNode.y;

      this.changeType(curX, curY, 5);
      this.state.order.push(curNode);

      if (curX === this.state.end.x && curY === this.state.end.y) {
        this.colorNodes();
        return;
      }

      let delta = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ];

      delta.map((d) => {
        const newX = curX + d[0];
        const newY = curY + d[1];

        if (
          newX >= 0 &&
          newX < size &&
          newY >= 0 &&
          newY < size &&
          (this.state.nodes[newX][newY].ntype === 0 ||
            this.state.nodes[newX][newY].ntype === 2)
        ) {
          this.changeType(newX, newY, 4);
          this.changePrev(newX, newY, curX, curY);
          stack.push({ x: newX, y: newY });
        }
      });
    }
    this.colorNodes(false);
  }

  handleReset() {
    this.setState({
      stage: 0,
      start: { x: -1, y: -1 },
      end: { x: -1, y: -1 },
      order: [],
      result: { str: "", color: "" },
    });

    let newNodes = [];

    for (let i = 0; i < size; i++) {
      const tcols = [];
      for (let j = 0; j < size; j++) {
        tcols.push({ x: i, y: j, ntype: 0, color: 0 });
      }
      newNodes.push(tcols);
    }

    this.setState({ nodes: newNodes });
  }

  render() {
    let button;
    if (this.state.stage === 2) {
      button = (
        <button
          className="btn btn-success m-2"
          onClick={this.handleStart.bind(this)}
        >
          Start
        </button>
      );
    } else if (this.state.stage === 4) {
      button = (
        <button
          className="btn btn-success m-2"
          onClick={this.handleReset.bind(this)}
        >
          Reset
        </button>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1>BFS Visualizer</h1>
          <div className="row">
            <p>{strList[this.state.stage]}</p>
            {button}
          </div>
          <h3 className={this.state.result.color}>{this.state.result.str}</h3>
          <div className="container">
            {this.state.nodes.map((col, colIDX) => (
              <div className="row" key={colIDX}>
                {col.map((node, nodeIDX) => (
                  <div className="col" key={(colIDX, nodeIDX)}>
                    <Node
                      onChange={this.changeStage.bind(this)}
                      posx={node.x}
                      posy={node.y}
                      color={node.color}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <h6>
            Green = start, Red = end, Blue = obstacle, Yellow = visited, Cyan =
            optimal route
          </h6>
        </header>
      </div>
    );
  }
}

export default App;
