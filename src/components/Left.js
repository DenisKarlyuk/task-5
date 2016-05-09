import React, { Component } from 'react';
import { ratingCount } from '../util/reqParse';

export default class Left extends Component {
  constructor(props) {
    super(props);
    this.updateRank = this.updateRank.bind(this)
    this.state = {
      idRank: '',
      clientRank: 'none'
    }
  }

  componentWillMount() {
    this.updateRank(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.rank===this.props.rank) return;
    this.updateRank(nextProps);
  }

  updateRank(rank) {
    let newRank = rank.rank.find((x)=>
      (x.clientId===this.props.clientId)
    );
    if(this.state.clientRank) {
      this.setState({
        idRank: '',
        clientRank: 'none'
      });
    }
    if(!newRank) return;
    this.setState({
      clientRank: newRank.rank,
      idRank: newRank
    });
  }

  onClickGenr(e) {
    this.props.request(`genre/${e.target.id}/movies?`);
  }

  onClickPostDbRank(e) {
    e.preventDefault();
    const id = this.props.list.id;
    if(this.state.clientRank==='none') {
      let reqArg = ['rank', {
        id: id,
        clientId: this.props.clientId,
        rank: e.target.id
      }];
      this.props.postDb(reqArg[0], reqArg[1]);
    }
    else {
      let updateRank = {
        'rank': ''+e.target.id
      };
      let query = `q={"_id":{"$oid": "${this.state.idRank._id.$oid}"}}`
      this.props.updateRankDb(query, updateRank, id);
    }
  }

  onClickPostDbComment(e) {
    e.preventDefault();
    let reqArg = ['comment', {
      id: e.target.id,
      name: e.target.name.value,
      comment: e.target.comment.value,
      data: new Date().toUTCString()
    }];
    e.target.name.value = '';
    e.target.comment.value = '';
    this.props.postDb(reqArg[0], reqArg[1]);
  }

  render() {
    let parse = this.props.list;
    const no = <p>No information</p>;
    let src = parse.poster_path
      ? 'https://image.tmdb.org/t/p/w300' + parse.poster_path
      : '/img/no.png';

    let genres = parse.genres.length
      ? parse.genres.map((x)=>
        <a onClick={::this.onClickGenr}
          id={x.id} key={`det${x.id}`}>
          {x.name}
        </a>)
      : no;
    let rank = ratingCount(parse.vote_average, parse.vote_count, this.props.rank);
    let star = new Array(10).fill(10).map((x, ind)=> {
      x = x-ind;
      return (
        <i className="fa fa-star-o" key={`${ind}`}
          id={x} aria-hidden="true"/>
      );
    });
    let fullStar = new Array(10).fill(1).map((x, ind)=>
      <i className="fa fa-star" key={`full${ind}`}
        id={x} aria-hidden="true"/>
    );
    let countries = parse.production_countries.length
      ? parse.production_countries.map((x)=>
          <img src={`/gif/${x.iso_3166_1.toLowerCase()}.gif`}
            key={x.iso_3166_1} title={x.name}/>)
      : no;
      let budget = ''+parse.budget;

    return (
      <div className = "left">
        <img src = {src}/>
        <div className="rating empty"
          onClick={::this.onClickPostDbRank}>
          {star}
        </div>
        <div className="rating full" style={{width: rank[2]}}>
          {fullStar}
        </div>
        <p>
          <span id="vote">
            {rank[1]}/10 ({rank[0]} votes)
          </span>
          <span className={this.state.clientRank}>
            You voted: {this.state.clientRank}
          </span>
        </p>
        <p>Countries: {countries}</p>
        <p>Genres: {genres}</p>
        <p>Runtime: {parse.runtime||'-'} min.</p>
        <p>Budget: {`${budget.replace(/(\d)(?=(\d\d\d)+($))/g, '$1 ')}$`}</p>
          <form id={parse.id} onSubmit={::this.onClickPostDbComment}>
            <p style={{color:'#52db52'}}>WRITE A REWIEW:</p>
            <p>Name:</p>
            <input type="text" defaultValue="" name="name" required/>
            <p>Rewiew:</p>
            <textarea name="comment" required/>
            <input type="submit" value="Submit"/>
          </form>
      </div>
    );
  }
}
