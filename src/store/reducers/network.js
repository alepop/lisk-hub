import actionTypes from '../../constants/actions';

/**
 * The reducer for maintaining connected networks
 *
 * @param {Array} state - the current state object
 * @param {Object} action - The action containing type and data
 *
 * @returns {Object} - Next state object
 */
const network = (state = { status: {}, networks: {} }, action) => {
  switch (action.type) {
    case actionTypes.networkSet:
      return {
        ...state,
        name: action.data.name,
        networks: {
          ...state.networks,
          [action.data.token]: action.data.network || {},
        },
      };
    case actionTypes.networkStatusUpdated:
      return {
        ...state,
        status: action.data,
      };
    /* istanbul ignore next */
    default:
      return state;
  }
};

export default network;
