/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Nav from './Nav';
import Button from '../Button';

describe('<Nav />', () => {
  let wrapper;
  let spy;

  beforeEach(() => {
    spy = jest.fn();
    wrapper = shallow(<Nav active={false} toggle={spy} />);
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <Nav active={false} toggle={spy} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call click handler when close button clicked', () => {
    wrapper.find(Button).simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should call handler on `touchend` event outside the panel', () => {
    const wrapper = mount(<Nav active={true} toggle={spy} />);
    const target = wrapper.instance().navEl;
    wrapper.simulate('touchend', { target });
    expect(spy).toHaveBeenCalled();
  });

  it('should not call handler when panel clicked or tapped', () => {
    const target = wrapper.find('nav');
    wrapper.simulate('click', { target });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should have an `active` class when `this.props.active === true`', () => {
    wrapper.setProps({ active: true });
    expect(wrapper.hasClass('active')).toBe(true);
    wrapper.setProps({ active: false });
    expect(wrapper.hasClass('active')).toBe(false);
  });
});
