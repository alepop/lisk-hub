import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import networks from '../constants/networks';

const getNetwork = (networkName) => {
  let network;
  Object.keys(networks).forEach((key) => {
    if (networks[key].name === networkName) {
      network = networks[key];
    }
  }, this);
  return network;
};

export default getNetwork;

/**
 * If Mainnet or Testnet returns the name, if custom node returns the nethash
 * @param {Object} network - network object from store, with options.code or options.nethash set.
 */
export const getNetworkIdentifier = (network) => {
  const networkName = network.name;
  const selectedNetwork = (Lisk.constants.MAINNET_NETHASH === network.networks.LSK.nethash
    && networks.mainnet)
    || (Lisk.constants.TESTNET_NETHASH === network.networks.LSK.nethash && networks.testnet)
    || getNetwork(networkName);
  return !selectedNetwork.custom
    ? selectedNetwork.name.toLowerCase()
    : network.networks.LSK.nethash;
};

export const getNetworksList = () =>
  Object.keys(networks)
    .filter(network => network !== 'default')
    .map((network, index) => ({
      label: i18next.t(networks[network].name),
      name: networks[network].name,
      value: index,
    }));


export const getNetworkNameBasedOnNethash = (network, token = 'LSK') => {
  let activeNetwork = network.name;
  if (network.name === networks.customNode.name && token !== 'BTC') {
    activeNetwork = network.networks[token].nethash === Lisk.constants.MAINNET_NETHASH
      ? networks.mainnet.name
      : network.name;
    activeNetwork = network.networks[token].nethash === Lisk.constants.TESTNET_NETHASH
      ? networks.testnet.name
      : network.name;
  }

  if (network.name === networks.customNode.name && token === 'BTC') {
    activeNetwork = token === 'BTC' ? networks.testnet.name : network.name;
  }
  return activeNetwork;
};
