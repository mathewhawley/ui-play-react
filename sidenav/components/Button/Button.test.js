/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Button from './Button';

describe('<Button />', () => {
  let wrapper;
  let clickHandler;

  beforeEach(() => {
    clickHandler = jest.fn();
    wrapper = shallow(
      <Button onClick={clickHandler} icon='menu' />
    );
  });

  it('should exist', () => {
    expect(wrapper).toBeDefined();
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <Button onClick={clickHandler} icon='menu' />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call handler on click event', () => {
    wrapper.simulate('click');
    expect(clickHandler).toHaveBeenCalled();
  });
});
