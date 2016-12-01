/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import renderer from 'react-test-renderer';
import Root from './Root';

const mockState = (overrides) => ({
  active: false,
  transitioning: false,
  isDragging: false,
  startX: 0,
  currentX: 0,
  translateX: 0,
  ...overrides,
});

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
    const expectedState = mockState({
      active: true,
      transitioning: true,
      isDragging: false,
    });
    wrapper.instance().showSideNav();
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should correctly update the state on `hideSideNav()`', () => {
    const expectedState = mockState({
      active: false,
      transitioning: true,
      isDragging: false,
    });
    wrapper.instance().hideSideNav();
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should correctly update the state on `onTransitionEnd()`', () => {
    const expectedState = mockState({
      active: true,
    });
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should reset state on `reset()`', () => {
    const initialState = mockState();
    wrapper.instance().reset();
    expect(wrapper.state()).toEqual(initialState);
  });

  it('should exit early when state is inactive for touch handlers', () => {
    const initialState = mockState();
    expect(wrapper.instance().onTouchStart()).toBeUndefined();
    expect(wrapper.instance().onTouchMove()).toBeUndefined();
    expect(wrapper.instance().onTouchEnd()).toBeUndefined();
    expect(wrapper.state()).toEqual(initialState);
  });

  it('should update the state correctly on `touchstart`', () => {
    const event = {
      touches: [
        { pageX: 120 },
      ],
    };
    const expectedState = mockState({
      active: true,
      startX: event.touches[0].pageX,
      currentX: event.touches[0].pageX,
      isDragging: true,
      transitioning: false,
    });
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
    wrapper.find('.base').simulate('touchstart', event);
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should update the state correctly on `touchmove`', () => {
    const startEvent = {
      touches: [
        { pageX: 321 },
      ],
    };
    const moveEvent = {
      touches: [
        { pageX: 123 },
      ],
    };
    const expectedState = mockState({
      active: true,
      startX: startEvent.touches[0].pageX,
      currentX: moveEvent.touches[0].pageX,
      translateX: moveEvent.touches[0].pageX - startEvent.touches[0].pageX,
      isDragging: true,
      transitioning: false,
    });
    const base = wrapper.find('.base');
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
    base.simulate('touchstart', startEvent);
    base.simulate('touchmove', moveEvent);
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should not move further than 0 on `touchmove`', () => {
    const base = wrapper.find('.base');
    const startEvent = {
      touches: [
        { pageX: 50 },
      ],
    };
    const moveEventRight = {
      touches: [
        { pageX: 400 },
      ],
    };

    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();

    base.simulate('touchstart', startEvent);
    base.simulate('touchmove', moveEventRight);
    expect(wrapper.state().translateX).toBe(0);

    const moveEventLeft= {
      touches: [
        { pageX: 20 },
      ],
    };

    base.simulate('touchmove', moveEventLeft);
    expect(wrapper.state().translateX).toBe(-30);
  });

  it('should not hide sidenav if `translateX` is below threshold', () => {
    const startEvent = {
      touches: [
        { pageX: 300 },
      ],
    };
    const moveEventSmall = {
      touches: [
        { pageX: 280 },
      ],
    };
    const expectedState = mockState({
      active: true,
      isDragging: false,
      transitioning: true,
    });
    const base = wrapper.find('.base');
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
    base.simulate('touchstart', startEvent);
    base.simulate('touchmove', moveEventSmall);
    base.simulate('touchend');
    expect(wrapper.state()).toEqual(expectedState);

    const moveEventLarge = {
      touches: [
        { pageX: 200 },
      ],
    };
    const expectedStateDismiss = mockState({
      transitioning: true,
    });

    base.simulate('touchstart', startEvent);
    base.simulate('touchmove', moveEventLarge);
    base.simulate('touchend');

    expect(wrapper.state()).toEqual(expectedStateDismiss);
  });
});
