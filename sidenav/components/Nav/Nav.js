import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Button from '../Button';
import styles from './Nav.scss';

class Nav extends Component {
  constructor() {
    super();
    this.navEl = null;
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  onOutsideClick(event) {
    if (!this.props.active || event.target !== this.navEl) {
      return;
    }
    this.props.toggle();
  }

  render() {
    const classes = classnames({
      [styles.base]: true,
      [styles.active]: this.props.active,
    });

    return (
      <div
        className={classes}
        ref={(node) => this.navEl = node}
        onClick={this.onOutsideClick}
      >
        <aside className={styles.panel}>
          <header className={styles.header}>
            <h1 className={styles.title}>Navigation</h1>
            <Button
              icon='close'
              onClick={this.props.toggle}
              customStyles={styles.close}
            />
          </header>
          <nav className={styles.body}></nav>
        </aside>
      </div>
    );
  }
}

Nav.propTypes = {
  toggle: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

export default Nav;
