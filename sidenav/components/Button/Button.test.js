/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import renderer from 'react-test-renderer';
import Button from './Button';

describe('<Button />', () => {
  let wrapper;
  let spy;

  beforeEach(() => {
    spy = sinon.spy();
    wrapper = shallow(
      <Button onClick={spy} icon='menu' />
    );
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <Button onClick={spy} icon='menu' />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call handler on click event', () => {
    wrapper.simulate('click');
    expect(spy.calledOnce).toBe(true);
  });
});
