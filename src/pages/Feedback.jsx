import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import './Feedback.css';

class Feedback extends Component {
  reset = () => {
    const { history } = this.props;

    history.push('/');
  };

  render() {
    const { history, assertions, score } = this.props;
    const minimumScore = 3;
    const message = assertions < minimumScore ? 'Could be better...' : 'Well Done!';
    return (
      <div className="feed-container">
        <Header />
        <span data-testid="feedback-text">{message}</span>
        <p data-testid="feedback-total-score">{score}</p>
        <p data-testid="feedback-total-question">{assertions}</p>
        <div className="btn-container">
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ this.reset }
          >
            Play again
          </button>
          <button
            type="button"
            data-testid="btn-ranking"
            onClick={ () => history.push('/ranking') }
          >
            Ranking
          </button>
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

export default connect(mapStateToProps)(Feedback);
