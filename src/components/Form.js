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
    if(!e.target.value) return;
    this.setState({
      search: e.target.value
    });
    console.log(this.state.search);
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
          ref="search"/>
        <button type="submit">
          <i className="fa fa-search" aria-hidden="true"/>
        </button>
        <div id="select">
          <label><input type="radio" name="option" value="movie"/>Movie</label>
          <label><input type="radio" name="option" value="person"/>Person</label>
          <label><input type="radio" defaultChecked="checked" name="option" value="multi"/>Multi</label>
        </div>
      </form>
    );
  }
}
