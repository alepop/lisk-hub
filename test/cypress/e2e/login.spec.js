import numeral from 'numeral';
import { fromRawLsk } from '../../../src/utils/lsk';
import accounts from '../../constants/accounts';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';
import chooseNetwork from '../utils/chooseNetwork';
import loginUI from '../utils/loginUI';

const castNumberToBalanceString = number => numeral(fromRawLsk(number)).format('0,0.[0000000000000]');

describe('Login Page', () => {
  /**
   * Login page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Opens by url ${urls.login}`, () => {
    cy.visit(urls.login);
    cy.url().should('include', urls.login);
    cy.get(ss.app).contains('Sign in with a passphrase');
  });
  /**
   * First time app is opened sign in happens to mainnet
   * @expect address matches
   * @expect 0 balance - otherwise you've just found free money
   * @expect network status is not shown
   */
  it('Log in to Mainnet by default ("Switch Network" is not set)', () => {
    cy.visit(urls.login);
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
    cy.get(ss.networkStatus).contains('Connected to:mainnet');
  });

  /**
   * If the switch network is set to false sign in happens to mainnet
   * @expect address matches
   * @expect 0 balance - otherwise you've just found free money
   * @expect network status is not shown
   */
  it('Log in to Mainnet by default ("Switch Network" is false)', () => {
    cy.addObjectToLocalStorage('settings', 'showNetwork', false);
    cy.visit(urls.login);
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
    cy.get(ss.networkStatus).contains('Connected to:mainnet');
  });

  /**
   * If the switch network is set to true and mainnet is chosen sign in happens to mainnet
   * @expect address matches
   * @expect 0 balance - otherwise you've just found free money
   * @expect network status shows mainnet
   */
  it('Log in to Mainnet (Selected network)', () => {
    cy.addObjectToLocalStorage('settings', 'showNetwork', true);
    cy.visit(urls.login);
    chooseNetwork('main');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.networkStatus).contains('Connected to:mainnet');
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
  });

  /**
   * If the switch network is set to true and testnet is chosen sign in happens to testnet
   * @expect address matches
   * @expect balance matches one specified in constants therefore please don't touch it :)
   * @expect network status shows testnet
   */
  it('Log in to Testnet', () => {
    cy.addObjectToLocalStorage('settings', 'showNetwork', true);
    cy.visit(urls.login);
    chooseNetwork('test');
    loginUI(accounts['testnet guy'].passphrase);
    cy.get(ss.networkStatus).contains('Connected to:testnet');
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(accounts['testnet guy'].balance));
  });

  /**
   * If the switch network is set to true, devnet is chosen and custom node is specified,
   * sign in happens to testnet
   * @expect address matches
   * @expect balance's three leading numbers match specified in constants
   * @expect network status shows devnet
   */
  it('Log in to Devnet', () => {
    cy.addObjectToLocalStorage('settings', 'showNetwork', true);
    cy.visit(urls.login);
    chooseNetwork('dev');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.networkStatus).contains('Connected to:devnet');
    cy.get(ss.headerBalance).should('contain', castNumberToBalanceString(accounts.genesis.balance).substring(0, 3));
  });

  /**
   * ?showNetwork URL parameter makes network switcher available
   * @expect network switcher is visible
   */
  it('Network switcher available by url ?showNetwork=true', () => {
    cy.visit(`${urls.login}?showNetwork=true`);
    cy.get(ss.networkDropdown).should('be.visible');
  });

  /**
   * Try to sign in to invalid custom node address
   * @expect error popup is shown
   */
  xit('Log in to invalid address', () => {
    cy.addObjectToLocalStorage('settings', 'showNetwork', true);
    cy.visit(urls.login);
    chooseNetwork('invalid');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.errorPopup).contains('Unable to connect to the node');
  });

  describe('Login with BTC enabled', () => {
    beforeEach(() => {
      const btcSettings = {
        showNetwork: true,
        token: { list: { BTC: true } },
      };
      cy.server();
      cy.route('/account/**').as('btcAccount');
      cy.mergeObjectWithLocalStorage('settings', btcSettings);
    });

    ['main', 'test', 'dev'].forEach((name) => {
      it(`Login to ${name}net with BTC enable`, () => {
        cy.visit(urls.login);
        chooseNetwork(name);
        loginUI(accounts.genesis.passphrase);
        cy.wait('@btcAccount');
        cy.get(ss.coinRow).should('have.length', 2);
      });
    });
  });
});
