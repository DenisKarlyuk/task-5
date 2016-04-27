import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: 'multi'
    }
  }

  onClickBut(e) {
    e.preventDefault();
    let value = ReactDOM.findDOMNode(this.refs.search).value;
    if(!value) return;
    let input = `search/${this.state.search}?query=${value}&`.trim();
    this.props.request(input);
    ReactDOM.findDOMNode(this.refs.search).value = '';
  }

  onClickSelect(e) {
    let inspection = ['movie', 'person', 'multi'];
    if(inspection.indexOf(e.target.innerText)<0) return;
    this.setState({
      search: e.target.innerText
    });
  }

  componentDidMount() {
    let listen = document.getElementById('select');
    listen.addEventListener('click', ::this.onClickSelect);
  }

  render() {
    return (
      <form onSubmit={::this.onClickBut}>
        <input
          type="text"
          defaultValue=""
          placeholder={`Search for a ${this.state.search}`}
          ref="search"/>
        <button type="submit">
          <i className="fa fa-search" aria-hidden="true"/>
        </button>
        <p id="select">Select: search for a
          &nbsp;<span>movie</span>,
          &nbsp;<span>person</span>
          &nbsp;and <span>multi</span> search
        </p>
      </form>
    );
  }
}
