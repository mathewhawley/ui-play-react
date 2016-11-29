/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import Root from './Root';

describe('<Root />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Root />);
  });

  it('should exist', () => {
    expect(wrapper).toBeDefined();
  });

  it('should toggle active state when handler is called', () => {
    expect(wrapper.state().active).toBe(false);
    wrapper.instance().toggleNav();
    expect(wrapper.state().active).toBe(true);
    wrapper.instance().toggleNav();
    expect(wrapper.state().active).toBe(false);
  });
});
