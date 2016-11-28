import React, { PropTypes } from 'react';
import Button from '../Button';
import styles from './Header.scss';

const Header = ({ toggleNav }) => (
  <div className={styles.base}>
    <Button
      icon='menu'
      onClick={toggleNav}
      customStyles={styles.button}
    />
  </div>
);

Header.propTypes = {
  toggleNav: PropTypes.func.isRequired,
};

export default Header;
