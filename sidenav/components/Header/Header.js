import React, { PropTypes } from 'react';
import Button from '../Button';
import styles from './Header.scss';

const Header = ({ toggleSideNav }) => (
  <div className={styles.base}>
    <Button
      icon='menu'
      onClick={toggleSideNav}
      customStyles={styles.button}
    />
  </div>
);

Header.propTypes = {
  toggleSideNav: PropTypes.func.isRequired,
};

export default Header;
