import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Form extends Component {

  onClickBut(e) {
    e.preventDefault();
    let value = ReactDOM.findDOMNode(this.refs.search).value;
    if(!value) return;
    let input = `search/multi?query=${value}&`.trim();
    this.props.request(input);
    ReactDOM.findDOMNode(this.refs.search).value = '';
  }

  render() {
    return (
      <form onSubmit={::this.onClickBut }>
        <input
          type="text"
          defaultValue=""
          placeholder="Search for a movie, person..."
          ref="search"/>
        <button type="submit">
          <i className="fa fa-search" aria-hidden="true"/>
        </button>
      </form>
    );
  }
}
