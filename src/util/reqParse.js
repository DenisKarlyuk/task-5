import React from 'react';

export function parseMovie(parse) {
  const no = <p>No information</p>;
  let src = parse.poster_path ? 'https://image.tmdb.org/t/p/w300' + parse.poster_path
                              : 'img/no.png';
  let cast = parse.credits.cast.length
    ? parse.credits.cast.map((x)=> {
      let src = x.profile_path ? 'https://image.tmdb.org/t/p/w185' + x.profile_path
                               : 'img/no.png';
      return (
        <figure key = {x.id} onClick={this.onClickPoster.bind(this, [x.id, 'person'])}>
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

  let comment = comments(this.props.comment);

  let countries = parse.production_countries.length
    ? parse.production_countries.map((x)=>
      <img src={`gif/${x.iso_3166_1.toLowerCase()}.gif`}
        key={x.iso_3166_1} title={x.name}/>)
    : no;

  let iframe = parse.videos.results.length
    ? <iframe src={
        `http://www.youtube.com/embed/${(parse.videos.results[1]
        || parse.videos.results[0]).key}?&modestbranding=1&showinfo=0`
      }
      allowFullScreen="allowfullscreen" frameBorder="0"/>
    :'';

  let budget = ''+parse.budget;
  //вычисление длинны блока рейтинга, (5)- корректировка длинны
  let rating = (208/100)*(parse.vote_average*10)+5;

  let star = new Array(10).fill(10).map((x, ind)=> {
    x = x-ind;
    return (
      <i className="fa fa-star-o" key={`star${ind}`}
        id={x} aria-hidden="true"/>
    );
  });
  let fullStar = new Array(10).fill(1).map((x, ind)=>
      <i className="fa fa-star" key={`full${ind}`}
        id={x} aria-hidden="true"/>
  );

  return (
    <div className = "details">
        <div className = "left">
          <img src = {src}/>
          <div className="rating empty" onClick={::this.onClickReqDb}>
            {star}
          </div>
          <div className="rating full" style={{width: rating}}>
            {fullStar}
          </div>
          <p>{parse.vote_average}/10 ({parse.vote_count} votes)</p>
          <p>Countries: {countries}</p>
          <p>Genres:
            {
            parse.genres.length
            ? parse.genres.map((x)=>
              <a href="#" onClick={::this.onClickGenr}
                id={x.id} key={`det${x.id}`}>
                {x.name}
              </a>)
            : no
            }
          </p>
          <p>Runtime: {parse.runtime||'-'} min.</p>
          <p>Budget: {`${budget.replace(/(\d)(?=(\d\d\d)+($))/g, '$1 ')}$`}</p>
            <form id={parse.id} onSubmit={::this.onClickReqDb}>
              <p style={{color:'#52db52'}}>WRITE A REWIEW:</p>
              <p>Name:</p>
              <input type="text" defaultValue="" name="name" required/>
              <p>Rewiew:</p>
              <textarea name="comment" required/>
              <input type="submit" value="Submit"/>
            </form>
        </div>
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
            {
              maxHeight: this.state.classI[0]==='none'
                      ? '50px'
                      : ''
            }}>
            {cast}
          </div>
          <i className={`${this.state.classI[0]} fa fa-angle-double-up`}
            onClick={::this.onClickCastShow} aria-hidden="true"/>
          <i className={`${this.state.classI[1]} fa fa-angle-double-down`}
            onClick={::this.onClickCastShow} aria-hidden="true"/>
          <h3>Reviews</h3>
          <div className="comment">
            {comment}
          </div>
      </div>
    </div>
  );
}

export function parse(parse) {
  if (parse.length) {
    return parse.map((x)=> {
      if(x.media_type==='tv') return x='';
      let src = x.poster_path || x.profile_path
             ? `https://image.tmdb.org/t/p/w300${x.poster_path || x.profile_path})`
             : 'img/no.png',
          type = x.title ? 'movie' : 'person',
          style = {background: type==='movie'?'':'rgba(0, 137, 0, 0.7)'};
      return (
        <figure key={`${type}${x.id}`} id={`${type}/${x.id}`}
                onClick={this.onClickPoster.bind(this, [x.id, type])}>
          <img src={src}/>
            <figcaption>
              <span style={style}>{type}</span>
              <span>{x.name || x.title}</span>
            </figcaption>
        </figure>
      );
    });
  }
  return (<div className="non"><h3>Total results: 0</h3></div>);
}

function comments(rewiew) {
  return rewiew.length
    ? rewiew.reverse().map((x)=>
      <div key={x.data}>
        <p>A review by {x.name}</p>
        <p>{x.comment}</p>
        <p>{x.data}</p>
      </div>)
    : <p>No review</p>;
}
