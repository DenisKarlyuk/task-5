import React, { Component } from 'react';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: 'multi'
    }
  }

  onClickBut(e) {
    e.preventDefault();
    let value = e.target.search.value;
    if(!value) return;
    let input = `search/${this.state.search}?query=${value}`.trim();
    this.props.request(input);
    e.target.search.value = '';
  }

  onClickSelect(e) {
    if(!e.target.value) return;
    this.setState({
      search: e.target.value
    });
  }

  componentDidMount() {
    let listen = document.getElementById('select');
    listen.addEventListener('click', ::this.onClickSelect);
  }

  componentWillUnmount() {
    let listen = document.getElementById('select');
    listen.removeEventListener('click', ::this.onClickSelect);
  }

  render() {
    return (
      <form onSubmit={::this.onClickBut}>
        <input
          type="text"
          defaultValue=""
          name="search"/>
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
