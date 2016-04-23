import React, { Component } from 'react';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transform: true
    }
  }

  onClickPoster(arg) {
    let url = `${arg[1]}/${arg[0]}${arg[1][0]==='m'
            ? '?append_to_response=credits,videos&'
            : '/combined_credits?'}`;
    this.props.request(url);
  }

  onClickPage(e) {
    this.props.request(`${this.props.url}page=${e.target.value}&`)
  }

  render() {
    let parse = this.props.list;
    let pages = this.props.pages;
    let page = this.props.page;
    if(!parse.length) {
        return (<div className="non"><h3>Total results: 0</h3></div>);
    }

    let arrPage = new Array(11).fill(page<7 ? 1 : page-5)
                 .map((x, ind)=> {
      x = x+ind;
      return (
        <li key={`page${ind}`}>
          <a href="#" onClick={ ::this.onClickPage } style={{color: x===page?'#fb9292':''}}>
            { x<1 ? '' : x }
          </a>
        </li>
      )
    });

    parse = parse.map((x)=> {
      if(x.media_type==='tv') return x='';
      let src = x.poster_path || x.profile_path
             ? `https://image.tmdb.org/t/p/w300${x.poster_path || x.profile_path})`
             : 'img/no.png',
          type = x.media_type || 'movie',
          style = {background: type==='movie'?'':'rgba(0, 137, 0, 0.7)'};
      return (
        <figure key={`${type[0]}${x.id}`} id={`${type}/${x.id}`}
                onClick={this.onClickPoster.bind(this, [x.id, type])}>
          <img src={src}/>
            <figcaption>
              <span style={style}>{type}</span>
              <span>{x.name || x.title}</span>
            </figcaption>
        </figure>
      );
    });
    return (
      <main>
        <div className="list">
          { parse }
        </div>
        <div className="page">
          <ul>
            { arrPage }
          </ul>
          <span>
            Total pages: { pages }
          </span>
        </div>
      </main>
    );
  }
}
