export default function(state, action) {
  switch (action.type) {
  case 'NEW_LOADING':
    return {... state, loading: true}
  case 'END_LOADING':
    return {... state, loading: false}
  default:
    return state
  }
}
