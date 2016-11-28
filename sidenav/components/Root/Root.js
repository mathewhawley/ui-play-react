import React, { Component } from 'react';
import Header from '../Header';
import Nav from '../Nav';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
    };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    this.setState({ active: !this.state.active });
  }

  render() {
    return (
      <div>
        <Header toggleNav={this.toggleNav} />
        <Nav {...this.state} toggle={this.toggleNav} />
      </div>
    );
  }
}

export default Root;
