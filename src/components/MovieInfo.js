import React, { Component } from 'react';
import { ratingCount } from '../util/util';
import props from '../../config/conf';

const IMG_URL_W300 = props['image.url.w300'];

export default class Left extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idRank: '',
      clientRank: 'none'
    }
  }

  componentWillMount() {
    this.searhRatingClient(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.rank===this.props.rank) return;
    this.searhRatingClient(nextProps);
  }

  render() {
    const no = 'No information';
    let parse = this.props.list;
    let genres = no;
    let countries = no;
    let budget = ''+parse.budget;
    let rank = ratingCount(parse.vote_average, parse.vote_count, this.props.rank);

    let src = parse.poster_path
      ? `${IMG_URL_W300}${parse.poster_path}`
      : '/img/no.png';

    let stars = new Array(10).fill(10).map((x, ind)=>
      <i className="fa fa-star-o" key={`${ind}`}
        id={x-ind} aria-hidden="true"/>
    );

    let fullStars = new Array(10).fill(1).map((x, ind)=>
      <i className="fa fa-star" key={`full${ind}`} aria-hidden="true"/>
    );

    if(parse.production_countries.length) {
      countries = parse.production_countries.map((x)=>
        <img src={`/gif/${x.iso_3166_1.toLowerCase()}.gif`}
          key={x.iso_3166_1} title={x.name}/>
      );
    }

    if(parse.genres.length) {
      genres = parse.genres.map((x)=>
        <a onClick={::this.onClickGenre}
          id={x.id} key={`det${x.id}`}>
          {x.name}
        </a>
      );
    }

    return (
      <div className = "left">
        <img src = {src}/>
        <div className="rating empty"
          onClick={this.state.clientRank==='none' ? ::this.onClickPostDbRank
                                                  : ::this.onClickUpdateRank}>
          {stars}
        </div>
        <div className="rating full" style={{width: rank.widthRating}}>
          {fullStars}
        </div>
        <p>
          <span id="vote">
            {rank.voteAverage}/10 ({rank.voteCount} votes)
          </span>
          <span className={this.state.clientRank}>
            You voted: {this.state.clientRank}
          </span>
        </p>
        <p>Countries: {countries}</p>
        <p>Genres: {genres}</p>
        <p>Runtime: {parse.runtime||'-'} min.</p>
        <p>Budget: {`${budget.replace(/(\d)(?=(\d\d\d)+($))/g, '$1 ')}$`}</p>
          <form onSubmit={::this.onClickPostDbComment}>
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

  searhRatingClient(ranks) {
    if(this.state.clientRank) {
      this.setState({
        idRank: '',
        clientRank: 'none'
      });
    }

    let newRank = ranks.rank.find((x)=>
      (x.clientId===this.props.clientId)
    );

    if(!newRank) return;

    this.setState({
      clientRank: newRank.value,
      idRank: newRank
    });
  }

  onClickGenre(e) {
    this.props.request('genre', e.target.id, 'search');
  }

  onClickUpdateRank(e) {
    e.preventDefault();

    if(this.state.clientRank===e.target.id) {
      return;
    }

    let idMovie = this.props.list.id;
    let rank = ''+e.target.id;
    let idDb = this.state.idRank._id.$oid;

    this.props.updateRankDb(idDb, rank, idMovie);
  }

  onClickPostDbRank(e) {
    e.preventDefault();

    let idMovie = this.props.list.id;
    let collection ='rank';
    let clientId = this.props.clientId;
    let comment = e.target.id

    this.props.postDb(collection, idMovie, clientId, comment);
  }

  onClickPostDbComment(e) {
    e.preventDefault();

    let idMovie = this.props.list.id;
    let collection = 'comment';
    let name = e.target.name.value;
    let comment = e.target.comment.value;

    this.props.postDb(collection, idMovie, name, comment);

    e.target.name.value = '';
    e.target.comment.value = '';
  }
}
