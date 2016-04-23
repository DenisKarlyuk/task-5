import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Form extends Component {

  onClickBut(e) {
    console.log(e);
    let value = ReactDOM.findDOMNode(this.refs.search).value;
    if(value) {
      let input = `search/multi?query=${value}&`.trim();
      this.props.request(input);
      ReactDOM.findDOMNode(this.refs.search).value = '';
    }
    e.preventDefault();
  }

  render() {
    return (
      <form submit={::this.onClickBut}>
        <input
          type="text"
          defaultValue=""
          placeholder="Search for a movie, person..."
          ref="search"
        />
        <button onClick={::this.onClickBut}>
          <i className="fa fa-search" aria-hidden="true"/>
        </button>
      </form>
    );
  }
}
