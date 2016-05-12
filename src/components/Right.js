import React, { Component } from 'react';

export default class Right extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classI: ['fa fa-angle-double-down','fa fa-angle-double-up']
    }
  }

  onClickCastShow() {
    this.setState({
      classI: this.state.classI.reverse()
    });
  }

  render() {
    let parse = this.props.list;
    const no = <p>No information</p>;
    let trailer =  parse.videos.results[1] || parse.videos.results[0] || false;
    let iframe = trailer
      ? <iframe src={
          `https://www.youtube.com/embed/${trailer.key}?&modestbranding=1&showinfo=0`
        }
        allowFullScreen="allowfullscreen" frameBorder="0"/>
      :'';
    let comments = this.props.comment.length
      ? this.props.comment.reverse().map((x)=>
          <div key={x.data}>
            <p>A review by {x.name}</p>
            <p>{x.comment}</p>
            <p>{x.data}</p>
          </div>)
      : (<p>No review</p>);
    let cast = parse.credits.cast.length
      ? parse.credits.cast.map((x)=> {
        let src = x.profile_path ? 'https://image.tmdb.org/t/p/w185' + x.profile_path
      : '/img/no.png';

      return (
        <figure key = {x.id} onClick={this.props.clickPoster.bind(this, [x.id, 'person'])}>
          <img src = {src}/>
            <figcaption>
              <p>{x.name}</p>
              <p>as</p>
              <p>{x.character}</p>
            </figcaption>
          </figure>
        );
      })
    : no;

    return (
      <div className="right">
        {iframe}
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
          {maxHeight: this.state.classI[0]==='fa fa-angle-double-down'
                    ? '115px'
                    : ''
          }}>
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
}
