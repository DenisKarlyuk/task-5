import React, { Component } from 'react';

export default class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: 'multi'
    }
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

  onClickBut(e) {
    e.preventDefault();

    if(!e.target.search.value) return;

    let value = e.target.search.value.trim();

    this.props.request('search', this.state.search, 'form', value);
    e.target.search.value = '';
  }

  onClickSelect(e) {
    if(!e.target.value) return;
    
    this.setState({
      search: e.target.value
    });
  }
}
