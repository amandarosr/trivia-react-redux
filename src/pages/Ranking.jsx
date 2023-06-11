import React, { Component } from 'react';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import { getSaved, savePlayer } from '../helpers/storage';
import './Ranking.css';

class Ranking extends Component {
  state = {
    ranking: [],
  };

  async componentDidMount() {
    this.salvarP();
    const players = await getSaved();
    this.setState({
      ranking: players,
    });
  }

  /*   componentDidUpdate(prevProps) {
    const { gravatarEmail, name, score } = this.props;
    if (gravatarEmail !== prevProps.gravatarEmail
      || name !== prevProps.name || score !== prevProps.score) {
      this.salvarP();
    }
  } */

  salvarP = () => {
    const { gravatarEmail, name, score } = this.props;
    const hash = md5(gravatarEmail).toString();
    const endPoint = `https://www.gravatar.com/avatar/${hash}`;

    if (gravatarEmail.length > 0) {
      const dataR = {
        nome: name,
        ponto: score,
        img: endPoint,
      };

      savePlayer(dataR);
    }
  };

  render() {
    const { history } = this.props;
    const { ranking } = this.state;
    const players = ranking.sort((player1, player2) => {
      if (player1.ponto === player2.ponto) {
        return player2.nome.localeCompare(player1.nome);
      }
      return player2.ponto - player1.ponto;
    });

    return (
      <div className="rank-container">
        <h1 data-testid="ranking-title">Ranking</h1>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((playe, index) => (
              <tr key={ index }>
                <td>{ index + 1 }</td>
                <td>
                  <div className="nameRow">
                    <img
                      src={ playe.img }
                      alt="Profile"
                    />
                    <span data-testid={ `player-name-${index}` }>{playe.nome}</span>

                  </div>
                </td>
                <td>
                  <p data-testid={ `player-score-${index}` }>{playe.ponto}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ () => history.push('/') }
        >
          Inicio
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {

  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (globalState) => ({
  ...globalState.player,
});

export default connect(mapStateToProps)(Ranking);
