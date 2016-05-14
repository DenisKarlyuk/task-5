import React, { Component } from 'react';
import Left from './Left';
import Right from './Right';
import List from './List';

export default class Main extends Component {

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
