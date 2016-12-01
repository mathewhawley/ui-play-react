import React, { Component } from 'react';
import classnames from 'classnames';
import times from 'lodash/times';
import Button from '../Button';
import Header from '../Header';
import styles from './SideNav.scss';

class SideNav extends Component {
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

    this.showSideNav = this.showSideNav.bind(this);
    this.hideSideNav = this.hideSideNav.bind(this);
    this.reset = this.reset.bind(this);

    // Event handlers
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.blockClicks = this.blockClicks.bind(this);
  }

  showSideNav() {
    this.setState(this.reset({
      active: true,
      transitioning: true,
      isDragging: false,
    }));
  }

  hideSideNav() {
    this.setState(this.reset({
      transitioning: true,
    }));
  }

  reset(overrides) {
    return {
      active: false,
      transitioning: false,
      isDragging: false,
      startX: 0,
      currentX: 0,
      translateX: 0,
      ...overrides,
    };
  }

  onTouchStart(event) {
    if (!this.state.active) {
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
    if (!this.state.active) {
      return;
    }

    const currentX = event.touches[0].pageX;
    const translateX = Math.min(0, currentX - this.state.startX);

    this.setState({
      currentX,
      translateX,
    });
  }

  onTouchEnd() {
    if (!this.state.active) {
      return;
    }

    if (Math.abs(this.state.translateX) > 30) {
      this.hideSideNav();
    } else {
      this.showSideNav();
    }
  }

  onTransitionEnd() {
    this.setState(this.reset({
      active: this.state.active,
    }));
  }

  blockClicks(event) {
    event.stopPropagation();
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

    const translate = {
      transform: this.state.isDragging ? `translateX(${this.state.translateX}px)` : '',
    };

    return (
      <div>

        <Header showSideNav={this.showSideNav} />

        <div
          className={sideNavBaseClasses}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onClick={this.hideSideNav}>

          <aside
            className={sideNavPanelClasses}
            onTransitionEnd={this.onTransitionEnd}
            onClick={this.blockClicks}
            style={translate}>

            <header className={styles.header}>
              <h1 className={styles.title}>Navigation</h1>
              <Button
                icon='close'
                onClick={this.hideSideNav}
                customStyles={styles.close} />
            </header>

            <nav className={styles.body}>
              <ul>
                {times(6, (index) =>
                  <li key={index}>
                    <a className={styles.link} href='#'>
                      Euismod Ornare Elit
                    </a>
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

export default SideNav;
