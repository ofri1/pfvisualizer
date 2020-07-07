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
    };

    for (let i = 0; i < size; i++) {
      const tcols = [];
      for (let j = 0; j < size; j++) {
        tcols.push({ x: i, y: j, ntype: 0, color: 0 });
      }
      this.state.nodes.push(tcols);
    }

    this.changeType.bind(this);
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

  colorNodes() {
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

    let routeOrder = [];

    let node = this.state.nodes[this.state.end.x][this.state.end.y].prev;
    while (!(node.x === this.state.start.x && node.y === this.state.start.y)) {
      routeOrder.unshift(node);
      node = this.state.nodes[node.x][node.y].prev;
    }

    for (let i = 0; i < routeOrder.length; i++) {
      let node = routeOrder[i];
      setTimeout(() => {
        this.changeColor(routeOrder[i].x, routeOrder[i].y, 6);
      }, (i + this.state.order.length) * 200);
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

      if (curNode.x === this.state.end.x && curNode.y === this.state.end.y) {
        this.colorNodes();
        return;
      }

      if (
        curX > 0 &&
        (this.state.nodes[curX - 1][curY].ntype === 0 ||
          this.state.nodes[curX - 1][curY].ntype === 2)
      ) {
        this.changeType(curX - 1, curY, 4);
        this.changePrev(curX - 1, curY, curX, curY);
        stack.push({ x: curX - 1, y: curY });
      }

      if (
        curY > 0 &&
        (this.state.nodes[curX][curY - 1].ntype === 0 ||
          this.state.nodes[curX][curY - 1].ntype === 2)
      ) {
        this.changeType(curX, curY - 1, 4);
        this.changePrev(curX, curY - 1, curX, curY);
        stack.push({ x: curX, y: curY - 1 });
      }

      if (
        curY < size - 1 &&
        (this.state.nodes[curX][curY + 1].ntype === 0 ||
          this.state.nodes[curX][curY + 1].ntype === 2)
      ) {
        this.changeType(curX, curY + 1, 4);
        this.changePrev(curX, curY + 1, curX, curY);
        stack.push({ x: curX, y: curY + 1 });
      }

      if (
        curX < size - 1 &&
        (this.state.nodes[curX + 1][curY].ntype === 0 ||
          this.state.nodes[curX + 1][curY].ntype === 2)
      ) {
        this.changeType(curX + 1, curY, 4);
        this.changePrev(curX + 1, curY, curX, curY);
        stack.push({ x: curX + 1, y: curY });
      }
    }
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
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1>BFS Visualizer</h1>
          <div className="row">
            <p>{strList[this.state.stage]}</p>
            {button}
          </div>
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
