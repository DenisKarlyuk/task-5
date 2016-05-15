import React, { Component } from 'react';
import MovieInfo from './MovieInfo';
import MovieDetail from './MovieDetail';
import List from './List';

export default class Main extends Component {

  render() {
    let readyPage;

    if ((/movie\/\d+.+/).test(this.props.url)) {

      readyPage = (
        <div className = "details">
          <MovieInfo {...this.props}/>
          <MovieDetail {...this.props} clickPoster={this.onClickPoster}/>
        </div>
      );
    }
    else {

      readyPage = <List {...this.props} clickPoster={this.onClickPoster}/>;
    }

    return (
      <main>
        {readyPage}
      </main>
    );
  }

  onClickPoster(arg) {
    let id = arg[0];
    let type = arg[1];

    this.props.request(type, id, 'main');
  }
}
