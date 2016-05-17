import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createUrl } from '../util/util';
import Search from './Search';
import Main from './Main';
import Load from './Load';
import { apiRequest, apiDb, postDb, updateRankDb } from '../action/action';

class App extends Component {

componentDidMount() {
  history.replaceState({url: this.props.url}, null, `/${this.props.url}`);
  window.onpopstate = (e)=> this.props.requestApi(e.state.url);
}

  render() {
    return (
      <div className="app">
        <Load loading={this.props.loading}/>
        <Search genres={this.props.genres} request={::this.request}/>
        <Main {...this.props} request={::this.request} clientId={this.props.clientId}/>
      </div>
    );
  }

  request (type, id, call, query) {

    let url = createUrl(type, id, call, query, this.props.url);

    if(url===this.props.url) return;

    if(type==='movie' && call==='main') {
      this.props.reqDb('rank', id);
      this.props.reqDb('comment', id);
    }

    history.pushState({url: url}, null, `/${url}`);
    this.props.requestApi(url);
    document.body.scrollTop = 0;
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
    rank: state.rank||[],
    comment: state.comment||[],
    clientId: state.clientId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestApi: bindActionCreators(apiRequest, dispatch),
    reqDb: bindActionCreators(apiDb, dispatch),
    postDb: bindActionCreators(postDb, dispatch),
    updateRankDb: bindActionCreators(updateRankDb, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
