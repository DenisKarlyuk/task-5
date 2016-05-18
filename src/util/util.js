export function ratingCount(voteAverage, voteCount, votes) {

  const WIDTH_DIV_RATING = 208;
  const FIX_WIDTH_DIV_RATING = 5;

  let myVoteCount = votes.length;
  let myVoteAverage = votes.reduce((x, y)=> {
    return x+(+y.value)
  },0);

  let sumVoteCount = voteCount+myVoteCount;
  let sumVoteAverage = Math.round((voteAverage*voteCount+myVoteAverage)/sumVoteCount*10)/10;

  if(isNaN(sumVoteAverage)) {
    sumVoteAverage=0;
  }

  let calcWidthRating = WIDTH_DIV_RATING*sumVoteAverage/10+FIX_WIDTH_DIV_RATING;

  return {
    voteCount: sumVoteCount,
    voteAverage: sumVoteAverage,
    widthRating: calcWidthRating
  };
}

export function createUrl(type, id, call, query, url) {

  if(type==='page') {
    let clearUrl = url.replace(/[?|&]page=.+/, '');
    let twoQuery = clearUrl.includes('?') ? '&' : '?';

    return `${clearUrl}${twoQuery}page=${query}`;
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
