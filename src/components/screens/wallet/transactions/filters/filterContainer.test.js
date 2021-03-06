import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { PrimaryButton } from '../../../../toolbox/buttons/button';
import FilterContainer from './filterContainer';
import i18n from '../../../../../i18n';
import keyCodes from '../../../../../constants/keyCodes';

describe('filterContainer', () => {
  let wrapper;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    saveFilters: jest.fn(),
    t: v => v,
    customFilters: {},
    updateCustomFilters: jest.fn(),
    shouldCloseDropdown: true,
  };

  beforeEach(() => {
    wrapper = mount(<FilterContainer {...props} />, options);
  });

  it('should call saveFilters', () => {
    wrapper.find('.message-field textarea').simulate('change', { target: { name: 'message', value: 'test' } });
    expect(props.updateCustomFilters).toBeCalledWith({ message: 'test' });
    wrapper.find(PrimaryButton).simulate('click');
    expect(props.saveFilters).toBeCalled();
  });

  it('should call saveFilters on enter pressed', () => {
    wrapper.find('.message-field textarea').simulate('change', { event: { target: { value: 'testing' } } });
    wrapper.find('.message-field textarea').simulate('keyDown', { keyCode: keyCodes.enter });
    expect(props.saveFilters).toBeCalled();
  });

  it('should call saveFilters on enter pressed with empty values', () => {
    wrapper.find('.message-field textarea').simulate('keyDown', { keyCode: keyCodes.enter });
    expect(props.saveFilters).toBeCalled();
  });
});
