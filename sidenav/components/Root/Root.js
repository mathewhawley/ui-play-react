import React, { Component } from 'react';
import Header from '../Header';
import SideNav from '../SideNav';

class Root extends Component {
  constructor() {
    super();

    this.state = {
      sideNav: {
        active: false,
      },
    };

    this.toggleSideNav = this.toggleSideNav.bind(this);
  }

  toggleSideNav() {
    this.setState({
      sideNav: {
        active: !this.state.sideNav.active,
      },
    });
  }

  render() {
    return (
      <div>
        <Header toggleSideNav={this.toggleSideNav} />
        <SideNav {...this.state.sideNav} toggle={this.toggleSideNav} />
      </div>
    );
  }
}

export default Root;
