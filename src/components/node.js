import React, { Component } from "react";

const classList = [
  "btn btn-secondary", // 0
  "btn btn-success", // 1 - Start
  "btn btn btn-danger", // 2 - End
  "btn btn btn-primary", // 3 - Obstacle
  "btn btn-secondary", // 4 - checked
  "btn btn-warning", // 5 - visited
  "btn btn-info", // 6 - part of route
];

export default class Node extends Component {
  handleClick() {
    this.props.onChange(this.props.posx, this.props.posy);
  }

  render() {
    return (
      <div>
        <button
          className={classList[this.props.color]}
          onClick={this.handleClick.bind(this)}
        >
          {/*this.props.ntype*/}
        </button>
      </div>
    );
  }
}
