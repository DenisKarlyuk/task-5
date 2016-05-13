import React from 'react';

export function parse(parse) {

  if (parse.length) {

    return parse.map((x)=> {
      if(x.media_type==='tv') return x='';

      let poster = x.poster_path || x.profile_path || false;
      let src = poster ? `https://image.tmdb.org/t/p/w300${poster})`
                       : '/img/no.png';

      let type = x.title ? 'movie' : 'person';
      let style = {background: type==='movie'?'':'rgba(0, 137, 0, 0.7)'};

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

  return (<div className="non"><h3>Not found</h3></div>);
}

export function ratingCount(voteAverage, voteCount, votes) {
  let myVoteCount = votes.length;
  let myVoteAverage = votes.reduce((x, y)=> {
    return x+(+y.value)
  },0);

  let sumVoteCount = voteCount+myVoteCount;
  let sumVoteAverage = Math.round((voteAverage*voteCount+myVoteAverage)/sumVoteCount*10);

  sumVoteAverage = sumVoteAverage/10;

  if(isNaN(sumVoteAverage)) {
    sumVoteAverage=0;
  }

  //вычисление ширины блока рейтинга, (5)- корректировка ширины
  let calcWidthRating = (208/100)*((sumVoteAverage||0)*10)+5;

  return {
    voteCount: sumVoteCount,
    voteAverage: sumVoteAverage,
    widthRating: calcWidthRating
  };
}

export function createUrl(type, id, call, query, url) {

  if(type==='page') {
    let clearUrl = url.replace(/\?page=.+/, '');

    return `${clearUrl}?page=${query}`;
  }

  let option = {
    movie_main: `?append_to_response=credits,videos`,
    movie_search: '',
    person_main: `/combined_credits`,
    genre_search: `/movies`,
    search_form: `?query=${query}`
  }

  return `${type}/${id}${option[type+'_'+call]}`;
}
