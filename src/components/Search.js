import React, { Component } from 'react';
import Form from './Form';

export default class Search extends Component {

  onClickGenr(e) {
    if(+e.target.id) {
      this.props.request(`genre/${e.target.id}/movies?`);
    }
    else {
      this.props.request(`movie/${e.target.id}?`);
    }
  }

  render() {
    let gen = this.props.genres
    gen = gen.map((x)=> {
      if(x.name==='TV Movie') return x='';
      return (
        <li key={ x.id }>
          <a id={ x.id }
             onClick={ ::this.onClickGenr }>
              { x.name }
          </a>
        </li>);
    });

    return (
      <div className="search">
        <img id="top_rated" onClick={ ::this.onClickGenr } src="/img/logo.png"/>
        <Form request={ this.props.request }/>
          <ul className="rated">
            <li>
              <a>
                Genres
              </a>
              <ul id="genre">{ gen }</ul>
            </li>
            <li>
              <a id="popular"
                 onClick={ ::this.onClickGenr }>
                 Popular
               </a>
            </li>
            <li>
              <a id="top_rated"
                 onClick={ ::this.onClickGenr }>
                 Top rated
               </a>
            </li>
          </ul>
      </div>
    );
  }
}
