import React from 'react';
import styles from './master-detail.module.css';
import { NavLink, useParams, useRouteMatch, Switch, Route } from 'react-router-dom';



export default function Directory() {
    const { path, url } = useRouteMatch();
    return (
        <div className={styles.container}>
            <aside>
                <NavLink to={`${url}/about-me`} activeClassName={styles.activeLink}>About Me</NavLink>
                <NavLink to={`${url}/description`} activeClassName={styles.activeLink}>Description</NavLink>
                <NavLink to={`${url}/faq`} activeClassName={styles.activeLink}>FAQ</NavLink>
            </aside>
            <main>
                <Switch>
                    <Route exact path={path}>
                        <h3>Select a section on the left to view information about my app!</h3>
                    </Route>
                    <Route path={`${path}/:name`}>
                        <Detail></Detail>
                    </Route>
                </Switch>
            </main>
        </div>
    )
}

function Detail() {
    const { name } = useParams();
    switch (name) {
        case "about-me":
            return (
                <div>
                    <h2>About me</h2>
                    <p>This is my webapp for my discord bot.</p>
                </div>
            );
        case "description":
            return (
                <div>
                    <h2>Description</h2>
                    <p>This is my webapp for my discord bot.</p>
                    <p>Currently the only features available are reading and sending messages.</p>
                </div>
            );
        case "faq":
            return (
                <div>
                    <h2>FAQ</h2>
                    <div>
                        <h3>How do I use this thing?</h3>
                        <p>Click the Main App button at the top!</p>
                    </div>
                </div>
            );
        default:
            return (
                <div>
                    <h2>ERROR 404</h2>
                    <p>Page not found</p>
                </div>
            );
    }

}