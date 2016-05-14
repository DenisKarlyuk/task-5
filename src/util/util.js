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
