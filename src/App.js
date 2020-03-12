import React from 'react';
import styles from './app.module.css';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import Directory from './directory';
import BotView from './bot-view';

function App() {
  return (
    <Router exact path ='/ReactInariBot'>
      <div className={styles.container}>
        <header>
          <NavLink to="/ReactInariBot/home" activeClassName={styles.homeLink}>Main Page</NavLink>
          <nav>
            <NavLink to="/ReactInariBot/home" activeClassName={styles.activeLink}>About</NavLink>
            <NavLink to="/ReactInariBot/main-app" activeClassName={styles.activeLink}>Main App</NavLink>
          </nav>
        </header>

        <main>
          <Switch>
            <Route path="/ReactInariBot/home">
              <Directory></Directory>
            </Route>
            <Route path="/ReactInariBot/main-app">
              <BotView></BotView>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
