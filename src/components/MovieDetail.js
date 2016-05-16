import React, { Component } from 'react';
import props from '../../config/conf';

const IMG_URL_W185 = props['image.url.w185'];

export default class Right extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classI: ['fa fa-angle-double-down','fa fa-angle-double-up']
    }
  }

  render() {
    const no = 'No information';
    let parse = this.props.list;
    let comments = <p>No review</p>;
    let cast = no;
    let trailer = parse.videos.results[1] || parse.videos.results[0] || '';

    if(trailer) {
      trailer = <iframe src={
        `https://www.youtube.com/embed/${trailer.key}?&modestbranding=1&showinfo=0`
        } allowFullScreen="allowfullscreen" frameBorder="0"/>;
    }

    if(this.props.comment.length) {
      comments = this.props.comment.reverse().map((x)=>
        <div key={x.data}>
          <p>A review by {x.clientId}</p>
          <p>{x.value}</p>
          <p>{x.data}</p>
        </div>)
    }

    if(parse.credits.cast.length) {
      cast = parse.credits.cast.map((x)=> {
        let src = x.profile_path ? `${IMG_URL_W185}${x.profile_path}`
                                 : '/img/no.png';
        return (
          <figure key = {x.id} onClick={this.props.clickPoster.bind(this,{id:x.id, type:'person'})}>
            <img src = {src}/>
              <figcaption>
                <p>{x.name}</p>
                <p>as</p>
                <p>{x.character}</p>
              </figcaption>
            </figure>
          );
      });
    }

    return (
      <div className="right">
        {trailer}
        <h2>
          {parse.title}
          <span id="span">
            {parse.release_date.slice(0, 4)}
          </span>
        </h2>
        <h3>Overview</h3>
        <p>{parse.overview||no}</p>
        <h3>Cast</h3>
        <div className="cast" style={
          {maxHeight: this.state.classI[0]==='fa fa-angle-double-down'?'115px':''}}>
          {cast}
        </div>
        <i className={this.state.classI[0]}
          onClick={::this.onClickCastShow} aria-hidden="true"/>
        <h3>Reviews</h3>
        <div className="comment">
          {comments}
        </div>
    </div>
    );
  }

  onClickCastShow() {
    this.setState({
      classI: this.state.classI.reverse()
    });
  }
}
