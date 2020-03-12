import React from 'react';
import styles from './app.module.css';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import Directory from './directory';
import BotView from './bot-view';

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <header>
          <NavLink to="/home" activeClassName={styles.homeLink}>Main Page</NavLink>
          <nav>
            <NavLink to="/home" activeClassName={styles.activeLink}>About</NavLink>
            <NavLink to="/main-app" activeClassName={styles.activeLink}>Main App</NavLink>
          </nav>
        </header>

        <main>
          <Switch>
            <Route path="/home">
              <Directory></Directory>
            </Route>
            <Route path="/main-app">
              <BotView></BotView>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
