export default function(state, action) {
  switch (action.type) {
  case 'NEW_LOADING':
    return {... state, error: ''};
  case 'LOADING_ERROR':
    return {... state, error: action.text};
  default:
    return state;
  }
}
