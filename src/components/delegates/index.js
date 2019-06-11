/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Delegates from './delegates';
import {
  voteToggled,
  loadVotes,
  loadDelegates,
  clearVotes,
} from '../../actions/voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  delegates: state.voting.delegates,
});

const mapDispatchToProps = {
  clearVotes,
  voteToggled,
  loadVotes,
  loadDelegates,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Delegates));