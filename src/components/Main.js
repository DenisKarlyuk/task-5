import React, { Component } from 'react';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPage: ''
    }
  }

  onClickPoster(arg) {
    let url = `${arg[1]}/${arg[0]}${arg[1][0]==='m'
            ? '?append_to_response=credits,videos&'
            : '/combined_credits?'}`;
    this.props.request(url);
  }

  onClickPage(e) {
    let events = +e.target.text || +this.state.inputPage;
    if(e.target.tagName==='BUTTON') {
      this.setState({
        inputPage: ''
      })
    }
    if(!events || events===this.props.page
               || events>this.props.pages) return;
    let url = this.props.url.replace(/page=.+/, '');
    this.props.request(`${url}page=${events}&`);
  }

  onChangeInput(e) {
    if(!isFinite(e.target.value))return;
    this.setState({
      inputPage: e.target.value
    });
  }

  render() {
    let parse = this.props.list;
    const pages = this.props.pages,
          page = this.props.page;
    if(!parse.length) {
        return (<div className="non"><h3>Total results: 0</h3></div>);
    }
//переключение страниц
    let arrPage = new Array(pages<8 ? pages : 7)
                 .fill(page<5 ? 1 : page+7>pages
                                  ? pages-6
                                  : page-3).map((x, ind)=> {
      x = x+ind;
      return (
        <li key={`page${ind}`}>
          <a href="#" onClick={ ::this.onClickPage }
             style={{color: x===page?'#f97575':''}}>
            { x<1 ? '' : ''+x }
          </a>
        </li>
      )
    });
//список фильмов
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
          <div>
            <p>
              Total pages: { pages }
            <span>
              /
            </span>
              Enter page
            </p>
            <form>
              <input type="text" value={ this.state.inputPage }
                     onChange={::this.onChangeInput }/>
                  <button onClick={::this.onClickPage }>
                    <i className="fa fa-refresh" aria-hidden="true"/>
                  </button>
            </form>
          </div>
        </div>
      </main>
    );
  }
}
