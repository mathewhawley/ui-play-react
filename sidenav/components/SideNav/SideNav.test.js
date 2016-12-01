/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import renderer from 'react-test-renderer';
import SideNav from './SideNav';

const mockState = (overrides) => ({
  active: false,
  transitioning: false,
  isDragging: false,
  startX: 0,
  currentX: 0,
  translateX: 0,
  ...overrides,
});

const mockTouchEvent = (pageX) => ({
  touches: [
    { pageX },
  ],
});

describe('<SideNav />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SideNav />);
  });

  it('renders correctly', () => {
    const tree = renderer.create(<SideNav />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should correctly update the state on `showSideNav()`', () => {
    // Create expected state object
    const expectedState = mockState({
      active: true,
      transitioning: true,
      isDragging: false,
    });

    // Call method
    wrapper.instance().showSideNav();
    // Assert
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should correctly update the state on `hideSideNav()`', () => {
    // Create expected state object
    const expectedState = mockState({
      active: false,
      transitioning: true,
      isDragging: false,
    });

    // Call method
    wrapper.instance().hideSideNav();
    // Assert
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should return initial state on `reset()`', () => {
    expect(wrapper.state()).toEqual(wrapper.instance().reset());
  });

  it('should correctly update the state on `onTransitionEnd()`', () => {
    // Create expected state objects
    const expectedActiveState = mockState({ active: true });
    const expectedInactiveState = mockState();

    // Set to 'active'
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
    // Assert state is as expected
    expect(wrapper.state()).toEqual(expectedActiveState);

    // Set to 'inactive'
    wrapper.instance().hideSideNav();
    wrapper.instance().onTransitionEnd();
    // Assert state is as expected
    expect(wrapper.state()).toEqual(expectedInactiveState);
  });

  it('should stop event propagation when panel is clicked', () => {
    // Event target
    const panel = wrapper.find('.panel');
    const spy = sinon.spy();

    // Simulate event
    panel.simulate('click', { stopPropagation: spy });
    // Assert spy has been called
    expect(spy.calledOnce).toBe(true);
  });

  describe('touch event handlers', () => {
    let base;

    beforeEach(() => {
      base = wrapper.find('.base');
      wrapper.instance().showSideNav();
      wrapper.instance().onTransitionEnd();
    });

    afterEach(() => {
      wrapper.instance().hideSideNav();
      wrapper.instance().onTransitionEnd();
    });

    it('should exit early when state is inactive for touch handlers', () => {
      // Use local component wrapper
      const wrapper = shallow(<SideNav />);
      // Create expected state object
      const initialState = mockState();
      const event = mockTouchEvent(1);

      // Call methods, assert on the resulting state and return values
      expect(wrapper.instance().onTouchStart(event)).toBeUndefined();
      expect(wrapper.state()).toEqual(initialState);
      expect(wrapper.instance().onTouchMove(event)).toBeUndefined();
      expect(wrapper.state()).toEqual(initialState);
      expect(wrapper.instance().onTouchEnd()).toBeUndefined();
      expect(wrapper.state()).toEqual(initialState);
    });

    it('should update the state correctly on `touchstart`', () => {
      // Set up mock events and expected state
      const event = mockTouchEvent(120);
      const expectedState = mockState({
        active: true,
        startX: event.touches[0].pageX,
        currentX: event.touches[0].pageX,
        isDragging: true,
        transitioning: false,
      });

      // Simulate event
      base.simulate('touchstart', event);
      // Assert
      expect(wrapper.state()).toEqual(expectedState);
    });

    it('should update the state correctly on `touchmove`', () => {
      // Set up mock events and expected state
      const startEvent = mockTouchEvent(321);
      const moveEvent = mockTouchEvent(123);
      const expectedState = mockState({
        active: true,
        startX: startEvent.touches[0].pageX,
        currentX: moveEvent.touches[0].pageX,
        translateX: moveEvent.touches[0].pageX - startEvent.touches[0].pageX,
        isDragging: true,
        transitioning: false,
      });

      // Simulate events
      base.simulate('touchstart', startEvent);
      base.simulate('touchmove', moveEvent);
      // Assert
      expect(wrapper.state()).toEqual(expectedState);
    });

    it('should not move further than 0 on `touchmove`', () => {
      // Movement values
      const start = 100;
      const move = 1;
      // Set up mock events
      const startEvent = mockTouchEvent(start);
      const moveEventRight = mockTouchEvent(start + move);
      const moveEventLeft = mockTouchEvent(start - move);

      // Simulate move right event
      base.simulate('touchstart', startEvent);
      base.simulate('touchmove', moveEventRight);
      // Assert
      expect(wrapper.state().translateX).toBe(0);

      // Simulate move left event
      base.simulate('touchmove', moveEventLeft);
      // Assert
      expect(wrapper.state().translateX).toBe(-1);
    });

    it('should not hide sidenav if `translateX` is below threshold', () => {
      const threshold = 30;
      const start = 100;
      const move = start - threshold;

      // Set up mock events and expected state
      const startEvent = mockTouchEvent(start);
      const moveEventLessThan = mockTouchEvent(move);
      const moveEventGreaterThan = mockTouchEvent(move - 1);
      const expectedState = mockState({
        active: true,
        isDragging: false,
        transitioning: true,
      });
      const expectedStateDismiss = mockState({
        transitioning: true,
      });

      // Simulate events
      base.simulate('touchstart', startEvent);
      base.simulate('touchmove', moveEventLessThan);
      base.simulate('touchend');
      // Assert not dismissed
      expect(wrapper.state()).toEqual(expectedState);

      // Simulate events
      base.simulate('touchstart', startEvent);
      base.simulate('touchmove', moveEventGreaterThan);
      base.simulate('touchend');
      // Assert dismissed
      expect(wrapper.state()).toEqual(expectedStateDismiss);
    });
  });
});
