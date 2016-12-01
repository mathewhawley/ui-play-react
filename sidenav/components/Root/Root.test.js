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

const mockTouchEvent = (pageX) => ({
  touches: [
    { pageX },
  ],
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
    // Event target
    const panel = wrapper.find('.panel');
    const spy = sinon.spy();

    // Simulate event
    panel.simulate('click', { stopPropagation: spy });

    // Assert spy has been called
    expect(spy.calledOnce).toBe(true);
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
    const expectedState = mockState({
      active: false,
      transitioning: true,
      isDragging: false,
    });
    wrapper.instance().hideSideNav();
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should correctly update the state on `onTransitionEnd()`', () => {
    // Create expected state object
    const expectedState = mockState({
      active: true,
    });

    // Set panel state to 'active'
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();

    // Assert state is as expected
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should reset state on `reset()`', () => {
    const initialState = mockState();
    wrapper.instance().reset();
    expect(wrapper.state()).toEqual(initialState);
  });

  it('should exit early when state is inactive for touch handlers', () => {
    // Create expected state object
    const initialState = mockState();

    // Call methods, assert on the resulting state and return values
    expect(wrapper.instance().onTouchStart()).toBeUndefined();
    expect(wrapper.state()).toEqual(initialState);
    expect(wrapper.instance().onTouchMove()).toBeUndefined();
    expect(wrapper.state()).toEqual(initialState);
    expect(wrapper.instance().onTouchEnd()).toBeUndefined();
    expect(wrapper.state()).toEqual(initialState);
  });

  describe('touch event handlers', () => {
    let base;

    beforeEach(() => {
      base = wrapper.find('.base');
      wrapper.instance().showSideNav();
      wrapper.instance().onTransitionEnd();
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
      // Set up mock events
      const startEvent = mockTouchEvent(50);
      const moveEventRight = mockTouchEvent(400);

      // Simulate events
      base.simulate('touchstart', startEvent);
      base.simulate('touchmove', moveEventRight);

      // Assert
      expect(wrapper.state().translateX).toBe(0);

      // Touch event to left of 'start'
      const moveEventLeft = mockTouchEvent(20);

      // Simulate event with new object
      base.simulate('touchmove', moveEventLeft);

      // Assert
      expect(wrapper.state().translateX).toBe(-30);
    });

    it('should not hide sidenav if `translateX` is below threshold', () => {
      // Set up mock events and expected state
      const startEvent = mockTouchEvent(300);
      const moveEventSmall = mockTouchEvent(280);
      const expectedState = mockState({
        active: true,
        isDragging: false,
        transitioning: true,
      });

      // Simulate events
      base.simulate('touchstart', startEvent);
      base.simulate('touchmove', moveEventSmall);
      base.simulate('touchend');

      // Assert not dismissed
      expect(wrapper.state()).toEqual(expectedState);

      // Set up mock event (move greater than threshold)
      // and expected state
      const moveEventLarge = mockTouchEvent(200);
      const expectedStateDismiss = mockState({
        transitioning: true,
      });

      // Simulate events
      base.simulate('touchstart', startEvent);
      base.simulate('touchmove', moveEventLarge);
      base.simulate('touchend');

      // Assert dismissed
      expect(wrapper.state()).toEqual(expectedStateDismiss);
    });
  });
});
