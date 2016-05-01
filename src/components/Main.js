import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { parse, parseMovie } from '../util/reqParse';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPage: '',
      classI: ['none',''],
      comment: '',
      rank: ''
    }
  }

  onClickPoster(arg) {
    this.setState({
      classI: ['none','']
    });
    if(arg[1][0]==='m') {
      this.props.request(`${arg[1]}/${arg[0]}?append_to_response=credits,videos&`);
      this.props.reqDb(`comment?q={"id":"${arg[0]}"}&`);
      this.props.reqDb(`rank?${arg[0]}&`);
    }
    else {
      this.props.request(`${arg[1]}/${arg[0]}/combined_credits?`);
    }
  }

  onClickPage(e) {
    e.preventDefault();
    let events = +e.target.text || +this.state.inputPage;
    if(e.target.tagName==='FORM') {
      this.setState({
        inputPage: ''
      });
    }
    if(!events || events===this.props.page
               || events>this.props.pages) return;
    let url = this.props.url.replace(/page=.+/, '');
    this.props.request(`${url}page=${events}&`);
    document.body.scrollTop = 0;
  }

  onChangeInput(e) {
    if(!isFinite(e.target.value))return;
    this.setState({
      inputPage: e.target.value
    });
  }

  onClickCastShow() {
    this.setState({
      classI: this.state.classI.reverse()
    });
  }

  onClickGenr(e) {
    this.props.request(`genre/${e.target.id}/movies?`);
  }

  onClickComment(e) {
    e.preventDefault();
    let urlDb = 'comment';
    let body = 
    {
      id: e.target.id,
      name: e.target.name.value,
      comment: e.target.comment.value,
      data: new Date().toUTCString()
    };
    fetch(`https://api.mlab.com/api/1/databases/movie/collections/${urlDb}?apiKey=N45LFP8U-avNxijAJ5SIwOx_LOQPhxhT`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({body})
    }).then(res=>console.log(res))
  }

  onClickRating(e) {
    fetch('https://api.mlab.com/api/1/databases/movie/collections/rank?apiKey=N45LFP8U-avNxijAJ5SIwOx_LOQPhxhT', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({
        clientId: this.props.clientId,
        rank: e.target.id
      })
    }).then(res=> console.log(res))
  }

  render() {
    let readyPage = (/movie\/\d+.+/).test(this.props.url)
                    ? parseMovie.call(this, this.props.list)
                    : parse.call(this, this.props.list);
    const pages = this.props.pages,
          page = this.props.page;

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
    return (
      <main>
        <div className="list">
          { readyPage }
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
              <input type="text" value={ this.state.inputPage }
                     maxLength="4" onChange={::this.onChangeInput }/>
              <button type="submit">
                  <i className="fa fa-refresh" aria-hidden="true"/>
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }
}
