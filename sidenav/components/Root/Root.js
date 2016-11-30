import React, { Component } from 'react';
import classnames from 'classnames';
import times from 'lodash/times';
import Button from '../Button';
import Header from '../Header';
import styles from './Root.scss';

class Root extends Component {
  constructor() {
    super();

    this.state = {
      active: false,
      transitioning: false,
      isDragging: false,
      startX: 0,
      currentX: 0,
      translateX: 0,
    };

    this.toggleSideNav = this.toggleSideNav.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.reset = this.reset.bind(this);
  }

  toggleSideNav() {
    this.setState({
      active: !this.state.active,
      transitioning: !this.state.transitioning,
    });
  }

  onTouchStart(event) {
    if (!this.state.active || event.target !== this.navEl) {
      return;
    }

    const startX = event.touches[0].pageX;
    const currentX = startX;

    this.setState({
      startX,
      currentX,
      isDragging: true,
    });
  }

  onTouchMove(event) {
    if (!this.state.active || event.target !== this.navEl) {
      return;
    }

    const currentX = event.touches[0].pageX;
    const translateX = Math.min(0, currentX - this.state.startX);

    this.setState({
      currentX,
      translateX,
    });
  }

  onTouchEnd(event) {
    if (!this.state.active || event.target !== this.navEl) {
      return;
    }

    if (Math.abs(this.state.translateX) > 30) {
      this.setState(this.reset());
      this.toggleSideNav();
    } else {
      this.setState({
        isDragging: false,
        transitioning: true,
      });
    }
  }

  reset() {
    return {
      active: false,
      transitioning: false,
      isDragging: false,
      startX: 0,
      currentX: 0,
      translateX: 0,
    };
  }

  onTransitionEnd() {
    this.setState({
      transitioning: false,
      startX: 0,
      currentX: 0,
      translateX: 0,
    });
  }

  render() {
    const sideNavBaseClasses = classnames({
      [styles.base]: true,
      [styles.active]: this.state.active,
    });

    const sideNavPanelClasses = classnames({
      [styles.panel]: true,
      [styles.transitioning]: this.state.transitioning,
    });

    const translate = this.state.isDragging
      ? { transform: `translateX(${this.state.translateX}px)` }
      : { transform: '' };

    return (
      <div>

        <Header toggleSideNav={this.toggleSideNav} />

        <div
          className={sideNavBaseClasses}
          ref={(node) => this.navEl = node}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
        >
          <aside
            className={sideNavPanelClasses}
            onTransitionEnd={this.onTransitionEnd}
            style={translate}
          >
            <header className={styles.header}>
              <h1 className={styles.title}>Navigation</h1>
              <Button
                icon='close'
                onClick={this.toggleSideNav}
                customStyles={styles.close}
              />
            </header>
            <nav className={styles.body}>
              <ul>
                {times(6, (index) =>
                  <li key={index}>
                    <a className={styles.link} href='#'>Euismod Ornare Elit</a>
                  </li>
                )}
              </ul>
            </nav>
          </aside>
        </div>

      </div>
    );
  }
}

export default Root;
