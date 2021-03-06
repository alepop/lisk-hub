import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import Settings from './settings';
import accounts from '../../../../test/constants/accounts';
import i18n from '../../../i18n';
import settingsConst from '../../../constants/settings';

describe('Setting', () => {
  const settings = {
    autoLog: true,
    showNetwork: false,
    currency: undefined,
    statistics: false,
    discreetMode: false,
    token: {
      list: {
        BTC: true,
        LSK: true,
      },
      active: 'LSK',
    },
  };

  const account = {
    info: {
      LSK: {
        ...accounts.genesis,
        isDelegate: false,
        username: 'lisk-hub',
      },
    },
  };
  const store = configureMockStore([])({
    account,
    liskAPIClientSet: jest.fn(),
    settings,
  });

  const options = {
    context: { store },
    childContextTypes: {
      store: PropTypes.object.isRequired,
    },
  };

  const t = key => key;
  let wrapper;

  const props = {
    transactions: { pending: [] },
    account: {},
    settingsUpdated: jest.fn(),
    accountUpdated: jest.fn(),
    settings,
    t,
    isAuthenticated: true,
    location: {
      pathname: '/settings',
    },
    toastDisplayed: jest.fn(),
  };

  beforeEach(() => {
    localStorage.setItem('feature-flag-language', true); // TODO: Remove when i18n epic #2301 is finished
    localStorage.setItem('discreet', true); // TODO: Remove when discreet mode is concluded
    wrapper = mount(<Router>
      <Settings {...props} store={store} />
    </Router>, options);
  });

  it('should disable 2nd passphrase when hardwareWallet', () => {
    const newProps = { ...props, account: { hwInfo: { deviceId: '123' } } };
    wrapper = mount(<Router>
      <Settings {...newProps} store={store} />
    </Router>, options);
    expect(wrapper).toContainMatchingElements(1, '.disabled');
  });

  it('should show 2nd passphrase as processing', () => {
    const newProps = { ...props, transactions: { pending: [{ type: 1 }] } };
    wrapper = mount(<Router><Settings {...newProps} /></Router>, options);
    expect(wrapper.find('.second-passphrase')).toContainMatchingElement('.loading');
  });

  it('should render 2nd passphrase as active', () => {
    const account2ndPassphrase = { info: { LSK: accounts.second_passphrase_account } };
    const newProps = { ...props, account: account2ndPassphrase, hasSecondPassphrase: true };
    wrapper = mount(<Router>
      <Settings {...newProps} />
    </Router>, options);
    expect(wrapper.find('.second-passphrase')).not.toContainMatchingElement('.link');
    expect(wrapper.find('.second-passphrase')).toContainMatchingElement('.second-passphrase-registered');
  });

  it('should change autolog setting when clicking on checkbox', () => {
    wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });
    const expectedCallToSettingsUpdated = {
      autoLog: !settings.autoLog,
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });

  it('should change discreet mode setting when clicking on checkbox', () => {
    wrapper.find('.discreetMode input').at(0).simulate('change', { target: { name: 'discreetMode' } });
    const expectedCallToSettingsUpdated = {
      discreetMode: !settings.discreetMode,
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });

  it('should change showNetwork setting when clicking on checkbox', () => {
    wrapper.find('.showNetwork input').at(0).simulate('change', { target: { name: 'showNetwork' } });
    const expectedCallToSettingsUpdated = {
      showNetwork: !settings.showNetwork,
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });

  it('should change usage statistics when clicking on checkbox', () => {
    wrapper.find('.statistics input').at(0).simulate('change', { target: { name: 'statistics' } });
    const expectedCallToSettingsUpdated = {
      statistics: !settings.statistics,
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });

  it('should change active currency setting to EUR', () => {
    wrapper.find('.currency input').simulate('focus');
    wrapper.find('.currency .options span').at(1).simulate('click', { target: { dataset: { index: 1 } } });
    const expectedCallToSettingsUpdated = {
      currency: settingsConst.currencies[1],
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });

  it('should allow to change active language setting to German', () => {
    wrapper.find('.language input').simulate('focus');
    wrapper.find('.language .options span').at(1).simulate('click', { target: { dataset: { index: 1 } } });
    expect(i18n.changeLanguage).toBeCalledWith('de');
  });

  it('should update expireTime when updating autolog', () => {
    const accountToExpireTime = { ...account };
    const settingsToExpireTime = { ...settings };
    settingsToExpireTime.autoLog = false;
    accountToExpireTime.passphrase = accounts.genesis.passphrase;
    wrapper = mount(<Router>
      <Settings
        {...props}
        store={store}
        account={accountToExpireTime}
        settings={settingsToExpireTime}
      />
    </Router>, options);

    wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });

    const timeNow = Date.now();
    const expectedCallToAccountUpdated = {
      expireTime: timeNow,
    };
    expect(props.accountUpdated).toBeCalled();
    expect(props.accountUpdated.mock.calls[0][0].expireTime)
      .toBeGreaterThan(expectedCallToAccountUpdated.expireTime);
  });

  it('should enable and disable BTC token', () => {
    localStorage.setItem('btc', true);
    wrapper.find('.enableBTC input').at(0).simulate('change', { target: { name: 'BTC' } });
    const expectedCallToSettingsUpdated = {
      token: { list: { BTC: !settings.token.list.BTC } },
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });
});
