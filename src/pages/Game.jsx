import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { getScore, saveAssertions, resetScore } from '../Redux/Actions';
import './Game.css';

class Game extends React.Component {
  state = {
    results: '',
    qIndex: 0,
    answers: '',
    ativar: false,
    timeLeft: 30,
    disabled: false,
    assertions: 0,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch(resetScore(0));
    const token = localStorage.getItem('token');
    const { qIndex } = this.state;
    this.startCounter();

    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
      const data = await response.json();
      const num = 3;
      if (data.response_code === num) {
        const { history } = this.props;
        localStorage.removeItem('token');
        history.push('/');
      }
      const entities = {
        '&#039;': '\'',
        '&quot;': '"',
        '&ntilde;': 'ñ',
        '&eacute;': 'é',
        '&amp;': '&',
        '&uuml;': 'ü',
      };
      const replaced = data.results.map((element) => {
        const question = element.question.replace(/&#?\w+;/g, (match) => entities[match] || match);
        const correct = element.correct_answer.replace(/&#?\w+;/g, (match) => entities[match] || match);
        const incorrect = element.incorrect_answers.map((elementTwo) => elementTwo.replace(/&#?\w+;/g, (match) => entities[match] || match));
        return { ...element, question, correct, incorrect };
      });
      const answersArray = [{ correct: replaced[qIndex].correct_answer },
        ...replaced[qIndex].incorrect_answers];
      const randomizedAnswers = this.shuffleArray(answersArray);
      this.setState({
        results: replaced,
        answers: randomizedAnswers,
      });
    } catch (err) {
      console.log('Um erro foi capturado.', err);
    }
  }

  componentDidUpdate() {
    const { timeLeft, disabled } = this.state;

    if (timeLeft === 0 && !disabled) {
      clearInterval(this.countdown);
      console.log('parou');
      this.setState({
        disabled: true,
        ativar: true,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  startCounter = () => {
    const oneSecond = 1000;
    this.countdown = setInterval(() => {
      this.setState((prevState) => ({
        timeLeft: prevState.timeLeft - 1,
      }));
    }, oneSecond);
  };

  clickOn = () => {
    clearInterval(this.countdown);
    this.setState({
      ativar: true,
      disabled: true,
    });
  };

  shuffleArray = (array) => { // código do stackoverflow (Knuth Shuffle)
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  updateAnswers = () => {
    const { qIndex, results } = this.state;
    const answersArray = [{ correct: results[qIndex].correct_answer },
      ...results[qIndex].incorrect_answers];
    const randomizedAnswers = this.shuffleArray(answersArray);
    this.setState({
      answers: randomizedAnswers,
    });
  };

  nextBtnClick = () => {
    const { qIndex, assertions } = this.state;
    const { history, dispatch } = this.props;
    const maxIndex = 4;
    if (qIndex === maxIndex) {
      dispatch(saveAssertions(assertions));
      history.push('/feedback');
    }
    this.startCounter();
    this.setState((prevState) => ({
      ativar: !prevState.ativar,
      qIndex: prevState.qIndex + 1,
      timeLeft: 30,
      disabled: false,
    }), this.updateAnswers);
  };

  correctAnswers = () => {
    this.setState((prevState) => ({
      assertions: prevState.assertions + 1,
    }));
  };

  getPoints = () => {
    const { qIndex, results, timeLeft } = this.state;
    const { dispatch } = this.props;
    const standartPoints = 10;
    const multiplierTwo = 2;
    const multiplierThree = 3;

    switch (results[qIndex].difficulty) {
    case 'easy':
      dispatch(getScore(timeLeft + standartPoints));
      break;
    case 'medium':
      dispatch(getScore(standartPoints + (timeLeft * multiplierTwo)));
      break;
    case 'hard':
      dispatch(getScore(standartPoints + (timeLeft * multiplierThree)));
      break;
    default:
      return true;
    }
    this.clickOn();
    this.correctAnswers();
  };

  render() {
    const { results, qIndex, answers, ativar, timeLeft, disabled } = this.state;
    return (
      <div className="game-container">
        <div className="header">
          <Header />
          { results.length ? <h1>{ timeLeft }</h1> : <h3>Loading...</h3> }
        </div>
        { results.length ? (
          <div className="qa-container">
            <h2
              data-testid="question-category"
              className="game-category"
            >
              { results[qIndex].category }
            </h2>
            <h3
              data-testid="question-text"
              className="game-question"
            >
              { results[qIndex].question }
            </h3>
            <div data-testid="answer-options" className="answers-container">
              { answers.map((a, i) => {
                if (typeof (a) === 'object') {
                  return (
                    <button
                      data-testid="correct-answer"
                      onClick={ this.getPoints }
                      className={ ativar ? 'correto' : '' }
                      key={ i }
                      disabled={ disabled }
                    >
                      {a.correct}
                    </button>
                  );
                }
                return (
                  <button
                    key={ i }
                    onClick={ this.clickOn }
                    className={ ativar ? 'errado' : '' }
                    data-testid={ `wrong-answer-${i}` }
                    disabled={ disabled }
                  >
                    {a}
                  </button>
                );
              }) }
            </div>
            { ativar ? (
              <button
                data-testid="btn-next"
                onClick={ this.nextBtnClick }
                className="next"
              >
                Next
              </button>
            ) : null }
          </div>
        ) : null }
      </div>
    );
  }
}

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Game);
