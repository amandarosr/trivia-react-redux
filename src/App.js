import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Game from './pages/Game';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import Ranking from './pages/Ranking';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route path="/game" component={ Game } />
          <Route path="/ranking" component={ Ranking } />
          <Route path="/settings" component={ Settings } />
          <Route path="/feedback" component={ Feedback } />
        </Switch>
      </div>
    );
  }
}

export default App;
