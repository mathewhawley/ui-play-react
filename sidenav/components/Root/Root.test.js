/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Root from './Root';

describe('<Root />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Root />);
  });

  it('renders correctly', () => {
    const tree = renderer.create(<Root />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should toggle active state when handler is called', () => {
    expect(wrapper.state().active).toBe(false);
    wrapper.instance().toggleNav();
    expect(wrapper.state().active).toBe(true);
    wrapper.instance().toggleNav();
    expect(wrapper.state().active).toBe(false);
  });
});
