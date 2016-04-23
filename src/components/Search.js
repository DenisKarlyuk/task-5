import React, { Component } from 'react';
import Form from './Form';

export default class Search extends Component {

  onClickGenr(e) {
    this.props.request(`genre/${e.target.id}/movies?`);
  }

  render() {
    let gen = this.props.genres
    gen = gen.map((x)=>
      <li key={ x.id } id={ x.id }
          onClick={ ::this.onClickGenr }>
        { x.name }
      </li>);

    return (
      <div className="search">
        <img src="/img/logo.png"/>
        <Form request={ this.props.request }/>
        <div className="popular">
          <ul>{ gen }</ul>
        </div>
      </div>
    );
  }
}
