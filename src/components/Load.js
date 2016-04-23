import React, { Component } from 'react';

export default class Load extends Component {
  render() {
    return (
      <div className={this.props.loading}>
          <img src="/img/load.gif"/>
      </div>
    );
  }
}
