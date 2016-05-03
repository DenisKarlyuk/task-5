import React from 'react';

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

export function ratingCount(voteAverage, voteCount, votes) {
  let myVoteCount = votes.length,
      myVoteAverage = votes.reduce((x, y)=> {
        return x+(+y.rank)
      },0),
      sumVoteCount = voteCount+myVoteCount,
      sumVoteAverage = Math.round((voteAverage*voteCount+myVoteAverage)/sumVoteCount*10);
  sumVoteAverage = sumVoteAverage/10;
  //вычисление длинны блока рейтинга, (5)- корректировка длинны
  if(isNaN(sumVoteAverage)) sumVoteAverage=0;
  let widthRating = (208/100)*((sumVoteAverage||0)*10)+5;
  return [sumVoteCount, sumVoteAverage, widthRating];
}
