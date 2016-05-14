import React, { Component } from 'react';

export default class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputPage: ''
    }
  }

  render() {

    let listMovie = this.props.list;
    let listContent;

    if (listMovie.length) {

      listContent = listMovie.map((x)=> {
        if(x.media_type==='tv') return x='';

        let poster = x.poster_path || x.profile_path || false;
        let src = poster ? `https://image.tmdb.org/t/p/w300${poster})`
                         : '/img/no.png';

        let type = x.title ? 'movie' : 'person';
        let style = {background: type==='movie'?'':'rgba(0, 137, 0, 0.7)'};

        return (
          <figure key={`${type}${x.id}`} id={`${type}/${x.id}`}
                  onClick={this.props.clickPoster.bind(this, [x.id, type])}>
            <img src={src}/>
              <figcaption>
                <span style={style}>{type}</span>
                <span>{x.name || x.title}</span>
              </figcaption>
          </figure>
        );
      });

    }
    else {

      let text = (
        <span>
          <h1 id="status">{listMovie.status_code}</h1>
          <h4>{listMovie.status_message}</h4>
        </span>) || <h3>'Not found'</h3>;

      listContent = (
        <div className="non">
          {text}
        </div>
      );
    }

    const pages = this.props.pages;
    const page = this.props.page;
    let fillArr = page<5 ? 1 : page+4>pages
                         ? pages-6 : page-3;
//переключение страниц
    let arrPage = new Array(pages<8 ? pages : 7)
     .fill(fillArr).map((x, ind)=> {
      x = x+ind;
      return (
        <li key={`page${ind}`}>
          <a onClick={ ::this.onClickPage }
             style={{color: x===page?'#f97575':''}}>
            { x<1 ? '' : ''+x }
          </a>
        </li>
      )
    });

    return (
      <div>
        <div className="list">
          { listContent }
        </div>
        <div className={ pages<2 ? 'none' : 'page' }>
          <ul>{ arrPage }</ul>
          <div>
            <p>
              Total pages: { pages }
            <span>
              /
            </span>
              Enter page:
            </p>
            <form onSubmit={::this.onClickPage}>
              <input type="text" value={this.state.inputPage}
                     maxLength="4" onChange={::this.onChangeInput }/>
              <button type="submit">
                  <i className="fa fa-refresh" aria-hidden="true"/>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  onClickPage(e) {
    e.preventDefault();

    let numberPage = +e.target.text || +this.state.inputPage;

    this.setState({
      inputPage: ''
    });

    if(!numberPage || numberPage===this.props.page
                   || numberPage>this.props.pages) return;

    this.props.request('page', '', 'main', numberPage);
  }

  onChangeInput(e) {
    if(!isFinite(e.target.value)) return;

    this.setState({
      inputPage: e.target.value
    });
  }
}
