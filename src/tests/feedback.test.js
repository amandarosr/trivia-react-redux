import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';


describe('Testes na página Feedback', () => {

  it('Renderiza botão "Play Again" e redireciona para página correta quando clicado.', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback')
    })
    const button = screen.getByTestId('btn-play-again');
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    
    const{ pathname } = history.location;
    expect(pathname).toBe('/');
  });

  it('Renderiza botão "Ranking" e redireciona para página correta quando clicado.', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback')
    });

    const button = screen.getByTestId('btn-ranking');
    expect(button).toBeInTheDocument();

    userEvent.click(button);

    const{ pathname } = history.location;
    expect(pathname).toBe('/ranking');
  });

  it('Renderiza "Could be better..." se assertions for < 3', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/feedback')
    });
    const message = screen.getByText('Could be better...');
    expect(message).toBeInTheDocument();
  });

  it('Renderiza "Well Done!" se assertions for >= 3', () => {
    const initialState = {
      player: {
        assertions: 3,
        score: 20,
      }
    };

      const { history } = renderWithRouterAndRedux(<App />, initialState );
      act(() => {
        history.push('/feedback')
      });

    const message = screen.getByText('Well Done!');
    expect(message).toBeInTheDocument();
  });
});