/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Header from './Header';
import Button from '../Button';

describe('<Header />', () => {
  let wrapper;
  let clickHandler;

  beforeEach(() => {
    clickHandler = jest.fn();
    wrapper = shallow(<Header toggleNav={clickHandler} />);
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <Header toggleNav={clickHandler} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call click handler on click', () => {
    wrapper.find(Button).simulate('click');
    expect(clickHandler).toHaveBeenCalled();
  });
});
