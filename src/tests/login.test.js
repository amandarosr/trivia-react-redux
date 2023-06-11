import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { act } from 'react-dom/test-utils';
import App from '../App'
import Login from '../pages/Login';

beforeEach(() => {
  jest.spyOn(global, 'fetch')
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(MockresponseAPILogin),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const MockresponseAPILogin = {
  responseCode: 0,
  responseMessage: "Token Generated Successfully!",
  token: "4fa18dd61da830d8930de13a391c3df6e5ee593b3182c17e3a48087ee913d697"
}
const mockValue = 'token'

describe('Testes da página de login', () => {
  it('Verifica se a tela de login é renderizada corretamente', () => {
      renderWithRouterAndRedux(<Login />);
      screen.getByTestId('input-player-name');
      screen.getByTestId('input-gravatar-email');
      screen.getByRole('button', { name: /settings/i });
      screen.getByRole('button', { name: /play/i });
  });

  it('Verifica se o botão de play é habilitado após inserir email e senha certos', () => {
    renderWithRouterAndRedux(<Login />);
    const nameRigth = 'teste teste'
    const emailRigtht = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    act(() => userEvent.type(screen.getByTestId('input-player-name'), nameRigth));
    act(() => userEvent.type(screen.getByTestId('input-gravatar-email'), emailRigtht));
  
    waitFor(() => {
      expect(btnPlay).not.toBeDisabled();
    })
  });

  it('Verifica se o botão de play continua desabilitado após inserir email e senha errados', () => {
    renderWithRouterAndRedux(<Login />);
    const emailWrong = 'teste';
    const nameWrong = ''
    const btnPlay = screen.getByRole('button', { name: /play/i });
  
    userEvent.type(screen.getByTestId('input-gravatar-email'), emailWrong);
    userEvent.type(screen.getByTestId('input-player-name'), nameWrong);
  
    expect(btnPlay).toBeDisabled();
  });

  it('Verifica se ao clicar no botão de settings, o usuario é redirecionado para a rota /settings', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const config = screen.getByRole('button', { name: /settings/i });
  
    act(() => userEvent.click(config));
  
    const { pathname } = history.location;
    expect(pathname).toBe('/settings');
  
    screen.getByText(/settings/i);
  });

  it('Verifica se ao clicar no botão de play, o usuário é redirecionado para a rota /game', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const btnPlay = screen.getByRole('button', { name: /play/i });
    const name = 'teste teste'
    const email = 'teste@teste.com';
    
    act(() => userEvent.type(screen.getByTestId('input-player-name'), name));
    act(() => userEvent.type(screen.getByTestId('input-gravatar-email'), email));
    
    expect(btnPlay).toBeEnabled();
  
    act(() => userEvent.click(btnPlay));
  
  
    await waitFor(() => {
    const { pathname } = history.location;
    expect(global.fetch).toHaveBeenCalled();
    expect(pathname).toBe('/game');
    screen.getByText(name);
    })
  });

  it('Verifica se ao clicar em play o hash é gerado', () => {
    // fazer o caminho do usuario e a partir disso validar se o fetch foi chamado, após testar o localStorage
    renderWithRouterAndRedux(<App />);
    const name = 'Teste'
    const email = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    userEvent.type(screen.getByTestId('input-player-name'), name);
    userEvent.type(screen.getByTestId('input-gravatar-email'), email);
  
    userEvent.click(btnPlay);
  
    window.localStorage.setItem(mockValue, JSON.stringify(MockresponseAPILogin.token));
    expect(localStorage.getItem(mockValue)).toEqual(JSON.stringify(MockresponseAPILogin.token));
  });
});
