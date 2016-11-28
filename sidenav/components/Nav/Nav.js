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

  onOutsideClick({ target }) {
    const { active, toggle } = this.props;
    if (!active || target !== this.navEl) {
      return;
    }
    toggle();
  }

  render() {
    const { active, toggle } = this.props;
    const classes = classnames({
      [styles.base]: true,
      [styles.active]: active,
    });

    return (
      <div className={classes} ref={(node) => this.navEl = node} onClick={this.onOutsideClick}>
        <nav className={styles.panel}>
          <Button icon='close' onClick={toggle} />
        </nav>
      </div>
    );
  }
}

Nav.propTypes = {
  toggle: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

export default Nav;
