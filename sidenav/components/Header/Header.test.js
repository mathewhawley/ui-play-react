/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';
import Button from '../Button';

describe('<Header />', () => {
  let wrapper;
  let clickHandler;

  beforeEach(() => {
    clickHandler = jest.fn();
    wrapper = shallow(<Header toggleNav={clickHandler} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeDefined();
  });

  it('should call click handler on click', () => {
    wrapper.find(Button).simulate('click');
    expect(clickHandler).toHaveBeenCalled();
  });
});
