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
      error: action.error,
      loading: 'none'
    };
  case 'LOADED_RANK':
    return {...state,
      rank: action.rank
    };
  case 'LOADED_COMMENT':
    return {...state,
      comment: action.comment
    };
  case 'POST_COMMENT':
    return {...state,
      comment: state.comment.concat([action.comment])
    };
  case 'SET_COOKIE':
      return {...state,
      clientId: action.clientId
    }
  default:
    return state;
  }
}
