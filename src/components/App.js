import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from './Search';
import Main from './Main';
import Load from './Load';
import { apiRequest, apiDb, postDb, updateRankDb } from '../action/action';
import UUID from 'uuid-js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: ''
    }
  }

componentDidMount() {
  if(!document.cookie) {
    document.cookie = `clientId=${UUID.create().toString()};
                       expires=Thu, 01 Jan 9999 00:00:00 GMT`;
  }
  this.setState({
    clientId: document.cookie.replace(/clientId=(.+)/, '$1')
  });
}

  render() {
    return (
      <div className="app">
        <Load loading={ this.props.loading }/>
        <Search genres={ this.props.genres } request={ this.props.request }/>
        <Main {...this.props } clientId={ this.state.clientId }/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.list,
    genres: state.genres,
    error: state.error,
    loading: state.loading,
    url: state.url,
    page: state.page,
    pages: state.pages,
    rank: state.rank,
    comment: state.comment
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(apiRequest, dispatch),
    reqDb: bindActionCreators(apiDb, dispatch),
    postDb: bindActionCreators(postDb, dispatch),
    updateRankDb: bindActionCreators(updateRankDb, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
