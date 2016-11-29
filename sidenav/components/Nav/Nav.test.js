/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Nav from './Nav';
import Button from '../Button';

describe('<Nav />', () => {
  let wrapper;
  let clickHandler;

  beforeEach(() => {
    clickHandler = jest.fn();
    wrapper = shallow(<Nav active={false} toggle={clickHandler} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeDefined();
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <Nav active={false} toggle={clickHandler} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call click handler when close button clicked', () => {
    wrapper.find(Button).simulate('click');
    expect(clickHandler).toHaveBeenCalled();
  });

  it('should call click handler when click event is outside the panel', () => {
    const wrapper = mount(<Nav active={true} toggle={clickHandler} />);
    const target = wrapper.instance().navEl;
    wrapper.simulate('click', { target });
    expect(clickHandler).toHaveBeenCalled();
  });

  it('should not call click handler when panel clicked', () => {
    const target = wrapper.find('nav');
    wrapper.simulate('click', { target });
    expect(clickHandler).not.toHaveBeenCalled();
  });
});
