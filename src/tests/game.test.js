import React from 'react';
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { act } from 'react-dom/test-utils';
import { resultAPI } from './helpers/mockData';
import App from '../App';
import Game from '../pages/Game';

describe('Testes para a tela de game', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(resultAPI),
    });
  });
  
  afterEach(jest.restoreAllMocks);

  it('Verifica se todos os elementos estão presentes na página', async() => {
    renderWithRouterAndRedux(<App />);
    const nameRigth = 'teste teste'
    const emailRigtht = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    act(() => userEvent.type(screen.getByTestId('input-player-name'), nameRigth));
    act(() => userEvent.type(screen.getByTestId('input-gravatar-email'), emailRigtht));
    userEvent.click(btnPlay);

    // await waitForElementToBeRemoved(() => screen.getByText(/loading/i), { timeout: 10000 });

    screen.getByRole('img');
    screen.getAllByRole('button');
  });

  it('Verifica se API foi chamada', async () => {
    renderWithRouterAndRedux(<App />);
    // usar o jest.fn() para mockar a funcao
    const nameRigth = 'teste teste'
    const emailRigtht = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    act(() => userEvent.type(screen.getByTestId('input-player-name'), nameRigth));
    act(() => userEvent.type(screen.getByTestId('input-gravatar-email'), emailRigtht));
    userEvent.click(btnPlay);

    expect(global.fetch).toHaveBeenCalled();

  });

  it('Verifica se ao clicar no botao next, o usuario e redirecionado para uma proxima pergunta', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => {
      history.push('/game');
    });

    const btnNext = screen.getByTestId('btn-next');

    expect(resultAPI[0]).toBeInTheDocument();

    userEvent.click(btnNext);

    


  });

  // it('Verifica se apos responder 5 perguntas o usuario e redirecionado para a tela de feedback', () => {});

  // it('Verifica se ao selecionar a resposta correta o botao assume a cor verde e as incorretas vermelho', () => {});
})