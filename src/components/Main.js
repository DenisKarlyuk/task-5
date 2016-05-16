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

  onClickPoster(data) {

    this.props.request(data.type, data.id, 'main');
  }
}
