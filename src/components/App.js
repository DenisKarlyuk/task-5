import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from './Search';
import Main from './Main';
import Load from './Load';
import { apiRequest } from '../action/action';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Load loading={ this.props.loading }/>
        <Search genres={ this.props.genres } request={ this.props.request }/>
        <Main {... this.props }/>
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
    pages: state.pages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(apiRequest, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
