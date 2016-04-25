import React from 'react';

export function parse(parse) {
  if(!parse.length & !parse.id) {
    return (<div className="non"><h3>Total results: 0</h3></div>);
  }
  if(!parse.length) {
    let src = parse.poster_path ? 'https://image.tmdb.org/t/p/w300' + parse.poster_path
                                : 'img/no.png'
    let cast = parse.credits.cast.map((x)=> {
      let src = x.profile_path ? 'https://image.tmdb.org/t/p/w185' + x.profile_path
                               : 'img/no.png';
      return (
        <figure key = {x.id} onClick={this.onClickPoster.bind(this, [x.id, 'person'])}>
          <img src = {src}/>
            <figcaption>
              <span>{x.name}</span>
            </figcaption>
        </figure>
      );
    });
    let videoUrl = `http://www.youtube.com/embed/${parse.videos.results[0].key}?fautoplay=0`;
    return (
      <div className = "details">
        <div className = "left">
          <img src = {src}/>
          <p>{parse.vote_average}</p>
          <p>{parse.vote_count}</p>
          <p>{parse.budget}</p>
          <p>{parse.overview}</p>
        </div>
        <div className="right">
          <h3>
            {parse.title}
            <span>
              ({parse.release_date.slice(0, 4)})
            </span>
          </h3>
          <iframe width="100%" height="auto" src={ videoUrl }
            allowFullScreen="allowfullscreen" frameBorder="0"/>
          <p>{parse.production_countries.map((x, ind)=>
              <span key={`cou${ind}`}>{ x.name }</span>)}</p>
          <div className="cast">{cast}</div>
          <div className="comment"></div>
        </div>
      </div>
    );
  }
  return parse.map((x)=> {
    if(x.media_type==='tv') return x='';
    let src = x.poster_path || x.profile_path
           ? `https://image.tmdb.org/t/p/w300${x.poster_path || x.profile_path})`
           : 'img/no.png',
        type = x.media_type || 'movie',
        style = {background: type==='movie'?'':'rgba(0, 137, 0, 0.7)'};
    return (
      <figure key={`${type[0]}${x.id}`} id={`${type}/${x.id}`}
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
