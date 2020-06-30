import React, { Component } from "react";

const classList = [
  "btn btn-secondary",
  "btn btn-success",
  "btn btn btn-danger",
  "btn btn btn-primary",
  "btn btn-warning",
];

export default class Node extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    /*
    if (this.props.stage === 0) {
      this.props.onChange(1);
      this.props.onntypeChange(this.props.posx, this.props.posy, 1);
    } else if (this.props.stage === 1) {
      this.props.onChange(2);
      this.props.onntypeChange(this.props.posx, this.props.posy, 2);
    } else {
      this.props.onntypeChange(this.props.posx, this.props.posy, 3);
    }
    */
    this.props.onChange(this.props.posx, this.props.posy);
  }

  render() {
    return (
      <div>
        <button
          className={classList[this.props.ntype]}
          onClick={this.handleClick.bind(this)}
        >
          {this.props.ntype}
        </button>
      </div>
    );
  }
}
