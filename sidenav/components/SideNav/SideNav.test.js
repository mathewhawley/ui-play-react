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
  it('renders correctly', () => {
    const tree = renderer.create(<SideNav />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('showSideNav', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SideNav />);
    wrapper.instance().showSideNav();
  });

  it('should correctly update the state', () => {
    const expectedState = mockState({
      active: true,
      transitioning: true,
      isDragging: false,
    });
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should add an `active` class to root element', () => {
    expect(
      wrapper.find('.base').hasClass('active')
    ).toBe(true);
  });

  it('should add a `transitioning` class to panel element', () => {
    expect(
      wrapper.find('.panel').hasClass('transitioning')
    ).toBe(true);
  });
});

describe('hideSideNav', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SideNav />);
    wrapper.instance().hideSideNav();
  });

  it('should correctly update the state', () => {
    const expectedState = mockState({
      transitioning: true,
    });

    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should remove `active` class from root element', () => {
    expect(
      wrapper.find('.base').hasClass('active')
    ).toBe(false);
  });

  it('should add a `transitioning` class to panel element', () => {
    expect(
      wrapper.find('.panel').hasClass('transitioning')
    ).toBe(true);
  });
});

describe('reset', () => {
  it('should return initial state on `reset()`', () => {
    const wrapper = shallow(<SideNav />);

    expect(wrapper.state()).toEqual(wrapper.instance().reset());
  });
});

describe('onTransitionEnd', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SideNav />);
  });

  it('should correctly update the state after `show` transition', () => {
    const expectedActiveState = mockState({ active: true });

    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();

    expect(wrapper.state()).toEqual(expectedActiveState);
  });

  it('should correctly update the state after `hide` transition', () => {
    const expectedInactiveState = mockState();

    wrapper.instance().hideSideNav();
    wrapper.instance().onTransitionEnd();

    expect(wrapper.state()).toEqual(expectedInactiveState);
  });

  it('should remove `transitioning` class from panel on end', () => {
    const instance = wrapper.instance();

    instance.showSideNav();

    expect(
      wrapper.find('.panel').hasClass('transitioning')
    ).toBe(true);

    instance.onTransitionEnd();

    expect(
      wrapper.find('.panel').hasClass('transitioning')
    ).toBe(false);

    instance.hideSideNav();

    expect(
      wrapper.find('.panel').hasClass('transitioning')
    ).toBe(true);

    instance.onTransitionEnd();

    expect(
      wrapper.find('.panel').hasClass('transitioning')
    ).toBe(false);
  });
});

describe('blockClicks', () => {
  it('should stop event propagation when panel is clicked', () => {
    const wrapper = shallow(<SideNav />);
    const spy = sinon.spy();

    wrapper.find('.panel').simulate('click', { stopPropagation: spy });

    expect(spy.calledOnce).toBe(true);
  });
});

describe('onTouchStart', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SideNav />);
  });

  it('should return early if `active === false`', () => {
    const expectedState = mockState();

    expect(wrapper.instance().onTouchStart()).toBeUndefined();
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should correctly update the state', () => {
    const sideNavEl = wrapper.find('.base');
    const event = mockTouchEvent(120);
    const expectedState = mockState({
      active: true,
      startX: event.touches[0].pageX,
      currentX: event.touches[0].pageX,
      isDragging: true,
      transitioning: false,
    });

    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();

    sideNavEl.simulate('touchstart', event);

    expect(wrapper.state()).toEqual(expectedState);
  });
});

describe('onTouchMove', () => {
  let wrapper;
  let sideNavEl;

  beforeEach(() => {
    wrapper = shallow(<SideNav />);
    sideNavEl = wrapper.find('.base');
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
  });

  it('should return early if `active === false`', () => {
    const wrapper = shallow(<SideNav />);
    const expectedState = mockState();

    expect(wrapper.instance().onTouchMove()).toBeUndefined();
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should correctly update the state', () => {
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

    sideNavEl.simulate('touchstart', startEvent);
    sideNavEl.simulate('touchmove', moveEvent);

    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should not set `translateX` higher than 0', () => {
    const start = 100;
    const move = 1;

    const startEvent = mockTouchEvent(start);
    const moveEventRight = mockTouchEvent(start + move);
    const moveEventLeft = mockTouchEvent(start - move);

    sideNavEl.simulate('touchstart', startEvent);
    sideNavEl.simulate('touchmove', moveEventRight);

    expect(wrapper.state().translateX).toBe(0);

    sideNavEl.simulate('touchmove', moveEventLeft);

    expect(wrapper.state().translateX).toBe(move * -1);
  });
});

describe('onTouchEnd', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SideNav />);
    wrapper.instance().showSideNav();
    wrapper.instance().onTransitionEnd();
  });

  it('should return early if `active === false`', () => {
    const wrapper = shallow(<SideNav />);
    const expectedState = mockState();

    expect(wrapper.instance().onTouchEnd()).toBeUndefined();
    expect(wrapper.state()).toEqual(expectedState);
  });

  it('should not hide sidenav if `translateX` is below threshold', () => {
    const sideNavEl = wrapper.find('.base');
    const threshold = 30;
    const start = 100;
    const move = start - threshold;

    const showSideNav = sinon.spy(wrapper.instance(), 'showSideNav');
    const hideSideNav = sinon.spy(wrapper.instance(), 'hideSideNav');

    const startEvent = mockTouchEvent(start);
    const moveEventLessThan = mockTouchEvent(move);
    const moveEventGreaterThan = mockTouchEvent(move - 1);

    sideNavEl.simulate('touchstart', startEvent);
    sideNavEl.simulate('touchmove', moveEventLessThan);
    sideNavEl.simulate('touchend');

    expect(showSideNav.calledOnce).toBe(true);

    sideNavEl.simulate('touchstart', startEvent);
    sideNavEl.simulate('touchmove', moveEventGreaterThan);
    sideNavEl.simulate('touchend');

    expect(hideSideNav.calledOnce).toBe(true);
  });
});
