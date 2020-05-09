import React from 'react';
import { Grid } from '@material-ui/core';
import Header from './Header';
import MainMenu from './MainMenu';
import { Switch, Route } from 'react-router-dom';
import routes from '../routes';

const Main = () => {
    return (
        <Grid container wrap="wrap" id="main-grid">
            <Grid item xs={12} id="header">
                <Header />
            </Grid>
            <Grid item id="#side-menu">
                <MainMenu />
            </Grid>
            <Grid item id="main">
                <Routing />
            </Grid>
        </Grid>
    );
};

const Routing = () => (
    <div id="main">
        <Switch>
            {routes.map(route =>
                'key' in route ? (
                    <Route exact component={route.component} key={route.key} />
                ) : (
                    <Route
                        exact
                        component={route.component}
                        key={Array.isArray(route.path) ? route.path[0] : route.path}
                        path={route.path}
                    />
                ),
            )}
        </Switch>
    </div>
);

export default Main;
