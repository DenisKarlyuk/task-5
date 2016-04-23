export default function (state, action) {
  switch (action.type) {
  case 'LOADED_GENRES':
    return {...state,
      genres: action.genres
    };
  case 'LOADING_LIST':
    return {...state,
      loading: 'request',
      error: ''
    };
  case 'LOADED_LIST':
    return {...state,
      list: action.list,
      loading: 'none',
      url: action.url,
      page: action.page,
      pages: action.pages
    };
  case 'LOADING_ERROR':
    return {...state,
      error: action.text,
      loading: 'none'
    };
  default:
    return state;
  }
}
