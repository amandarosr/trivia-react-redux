import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../Redux/Actions';
import './Login.css';
import img from '../trivia.png';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
    playDisabled: true,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, this.inputValidation);
  };

  inputValidation = () => {
    const { name, email } = this.state;
    const emailCorreto = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
    const validations = [name.length, email.length, emailCorreto];
    const validInputs = validations.every((v) => v);
    this.setState({
      playDisabled: !validInputs,
    });
  };

  fetchToken = async () => {
    const { history, dispatch } = this.props;
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await response.json();
    const { token } = data;
    localStorage.setItem('token', token);
    dispatch(login({ ...this.state }));
    history.push('/game');
  };

  btnConfig = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  render() {
    const { name, email, playDisabled } = this.state;
    /* const { history } = this.props; */
    return (
      <div className="paginaLogin">
        <img className="logo" src={ img } alt="trivia" />
        <div className="login">
          <input
            id="input-name"
            className=""
            name="name"
            type="text"
            data-testid="input-player-name"
            value={ name }
            onChange={ this.handleChange }
            placeholder="Insert your name"
          />
          <input
            id="input-email"
            name="email"
            type="email"
            data-testid="input-gravatar-email"
            value={ email }
            onChange={ this.handleChange }
            placeholder="Insert your email"
          />
          <button
            data-testid="btn-play"
            disabled={ playDisabled }
            onClick={ this.fetchToken }
            className={ playDisabled ? 'grey' : 'white' }
          >
            Play
          </button>
          <button
            type="button"
            data-testid="btn-settings"
            onClick={ this.btnConfig }
            className="white"
          >
            Settings

          </button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  savedName: state.player.name,
  savedEmail: state.player.gravatarEmail,
});

export default connect(mapStateToProps)(Login);
