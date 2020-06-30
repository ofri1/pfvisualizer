import React, { Component, createContext } from "react";
import "./App.css";
import Node from "./components/node";

const strList = ["Pick a start", "Pick an end", "Place obstacles"];
const x = 10;

let mtable = [];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,
      nodes: [],
      start: [-1, -1],
      end: [-1, -1],
    };

    for (let i = 0; i < x; i++) {
      const tcols = [];
      for (let j = 0; j < x; j++) {
        tcols.push({ x: i, y: j, ntype: 0 });
      }
      this.state.nodes.push(tcols);
    }

    this.changeType.bind(this);
  }

  changeType(x, y, value) {
    this.setState((state) => {
      const nodes = state.nodes;
      nodes[x][y].ntype = value;

      return {
        nodes,
      };
    });
  }

  changeStage(x, y) {
    if (this.state.stage === 0) {
      this.setState({ stage: 1, start: [x, y] });
      this.changeType(x, y, 1);
    } else if (this.state.stage === 1) {
      this.setState({ stage: 2, end: [x, y] });
      this.changeType(x, y, 2);
    } else {
      this.changeType(x, y, 3);
    }
  }

  handleStart() {
    /*
    console.log(this.state.start);
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < x; j++) {
        if (this.state.nodes[i][j].ntype === 0) {
          this.changeType(i, j, 3);
        }
      }
    }
    */

    let stack = [this.state.start];
    let count = 0;

    while (stack.length > 0 && count < 100) {
      count++;
      const curNode = stack.shift();
      const curX = curNode[0];
      const curY = curNode[1];

      console.log("comparing", curNode, "to", this.state.end);
      if (curX == this.state.end[0] && curY == this.state.end[1]) {
        console.log("finshed");
        break;
      }

      if (curX > 0) {
        if (curY > 0) {
          if (
            this.state.nodes[curX - 1][curY - 1].ntype === 0 ||
            this.state.nodes[curX - 1][curY - 1].ntype === 2
          ) {
            this.changeType(curX - 1, curY - 1, 4);
            stack.push([curX - 1, curY - 1]);
          }
        }

        if (
          this.state.nodes[curX - 1][curY].ntype === 0 ||
          this.state.nodes[curX - 1][curY].ntype === 2
        ) {
          this.changeType(curX - 1, curY, 4);
          stack.push([curX - 1, curY]);
        }

        if (curY < x - 1) {
          if (
            this.state.nodes[curX - 1][curY + 1].ntype === 0 ||
            this.state.nodes[curX - 1][curY + 1].ntype === 2
          ) {
            this.changeType(curX - 1, curY + 1, 4);
            stack.push([curX - 1, curY + 1]);
          }
        }
      }

      if (curY > 0) {
        if (
          this.state.nodes[curX][curY - 1].ntype === 0 ||
          this.state.nodes[curX][curY - 1].ntype === 2
        ) {
          this.changeType(curX, curY - 1, 4);
          stack.push([curX, curY - 1]);
        }
      }

      if (curY < x - 1) {
        if (
          this.state.nodes[curX][curY + 1].ntype === 0 ||
          this.state.nodes[curX][curY + 1].ntype === 2
        ) {
          this.changeType(curX, curY + 1, 4);
          stack.push([curX, curY + 1]);
        }
      }

      if (curX < x - 1) {
        if (curY > 0) {
          if (
            this.state.nodes[curX + 1][curY - 1].ntype === 0 ||
            this.state.nodes[curX + 1][curY - 1].ntype === 2
          ) {
            this.changeType(curX + 1, curY - 1, 4);
            stack.push([curX + 1, curY - 1]);
          }
        }

        if (
          this.state.nodes[curX + 1][curY].ntype === 0 ||
          this.state.nodes[curX + 1][curY].ntype === 2
        ) {
          this.changeType(curX + 1, curY, 4);
          stack.push([curX + 1, curY]);
        }

        if (curY < x - 1) {
          if (
            this.state.nodes[curX + 1][curY + 1].ntype === 0 ||
            this.state.nodes[curX + 1][curY + 1].ntype === 2
          ) {
            this.changeType(curX + 1, curY + 1, 4);
            stack.push([curX + 1, curY + 1]);
          }
        }
      }
    }
    console.log("finished while");
  }

  render() {
    let button;
    if (this.state.stage == 2) {
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
          <div className="row">
            <p>{strList[this.state.stage]}</p>
            {button}
          </div>
          <div className="container">
            {this.state.nodes.map((col) => (
              <div className="row">
                {col.map((node) => (
                  <div className="col">
                    <Node
                      onChange={this.changeStage.bind(this)}
                      stage={this.state.stage}
                      posx={node.x}
                      posy={node.y}
                      ntype={node.ntype}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </header>
      </div>
    );
  }
}

/*

function drawTable(x) {
  return (
    <div className="container">
      {mtable.map((col) => (
        <div className="row">
          {col.map((node) => (
            <div className="col">{node}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
*/

export default App;
