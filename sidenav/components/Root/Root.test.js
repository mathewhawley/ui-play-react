/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';
import Root from './Root';

describe('<Root />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Root />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should toggle active state when handler is called', () => {
    // expect(wrapper.state().active).toBe(false);
    // wrapper.instance().toggleSideNav();
    // expect(wrapper.state().active).toBe(true);
    // wrapper.instance().toggleSideNav();
    // expect(wrapper.state().active).toBe(false);
  });
});
