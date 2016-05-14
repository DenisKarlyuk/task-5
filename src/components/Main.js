import React, { Component } from 'react';
import Left from './Left.js';
import Right from './Right.js';
import { parse } from '../util/parse';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputPage: ''
    }
  }

  render() {
    let readyPage;

    if ((/movie\/\d+.+/).test(this.props.url)) {

      readyPage = (
        <div className = "details">
          <Left {...this.props}/>
          <Right {...this.props} clickPoster={this.onClickPoster}/>
        </div>
      );
    }
    else {

      readyPage = parse.call(this, this.props.list);
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
              <input type="text" value={this.state.inputPage}
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

  onClickPoster(arg) {
    let id = arg[0];
    let type = arg[1];

    this.props.request(type, id, 'main');
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
