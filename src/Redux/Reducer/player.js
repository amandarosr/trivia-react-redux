import { GET_SCORE, PLAYER_LOGIN, RESET_SCORE, SAVE_ASSERT } from '../Actions';

const INICIAL_STATE = {
  name: '',
  assertions: '',
  score: 0,
  gravatarEmail: '',
};

const player = (state = INICIAL_STATE, action) => {
  switch (action.type) {
  case PLAYER_LOGIN:
    return {
      ...state,
      name: action.payload.name,
      gravatarEmail: action.payload.email,
    };
  case GET_SCORE:
    return {
      ...state,
      score: state.score + action.payload,
    };
  case SAVE_ASSERT:
    return {
      ...state,
      assertions: action.payload,
    };
  case RESET_SCORE:
    return {
      ...state,
      score: action.payload,
    };
  default:
    return state;
  }
};

export default player;
