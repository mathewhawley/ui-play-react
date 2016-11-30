/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import renderer from 'react-test-renderer';
import Root from './Root';

const mockState = (overrides) => {
  return {
    active: false,
    transitioning: false,
    isDragging: false,
    startX: 0,
    currentX: 0,
    translateX: 0,
    ...overrides,
  };
};

describe('<Root />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Root />);
  });

  it('renders correctly', () => {
    const tree = renderer.create(<Root />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should stop click event propagation when panel is clicked', () => {
    const panel = wrapper.find('.panel');
    const spy = sinon.spy();
    panel.simulate('click', { stopPropagation: spy });
    expect(spy.calledOnce).toBe(true);
  });

  it('should correctly update the state on `showSideNav()`', () => {
    const stateAfter = mockState({
      active: true,
      transitioning: true,
      isDragging: false,
    });
    wrapper.instance().showSideNav();
    expect(wrapper.state()).toEqual(stateAfter);
  });

  it('should correctly update the state on `hideSideNav()`', () => {
    const stateAfter = mockState({
      active: false,
      transitioning: true,
      isDragging: false,
    });
    wrapper.instance().hideSideNav();
    expect(wrapper.state()).toEqual(stateAfter);
  });

  it('should correctly update the state on `onTransitionEnd()`', () => {
    const stateAfter = mockState({
      active: true,
    });
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
    expect(wrapper.state()).toEqual(stateAfter);
  });
});
