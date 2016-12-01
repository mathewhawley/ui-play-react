import React, { PropTypes } from 'react';
import Button from '../Button';
import styles from './Header.scss';

const Header = ({ showSideNav }) => (
  <div className={styles.base}>
    <Button
      icon='menu'
      onClick={showSideNav}
      customStyles={styles.button} />
  </div>
);

Header.propTypes = {
  showSideNav: PropTypes.func.isRequired,
};

export default Header;
