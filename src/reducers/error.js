export default function(state, action) {
 switch (action.type) {
  case 'RESET_ERROR':
    return {... state, error: ''};
  case 'LOADING_ERROR':
    return {... state, error: action.text};
  default:
    return state;

    }
}
