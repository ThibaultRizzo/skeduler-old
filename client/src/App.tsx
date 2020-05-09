import React from 'react';
import './App.css';
import moment from 'moment';
import { Provider } from 'react-redux';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import store from './config/store';
import theme from './config/theme';
import Main from './layout/Main';
import { BrowserRouter } from 'react-router-dom';

moment.locale('fr');

moment.fn.toJSON = function() {
    return this.format('YYYY-MM-DD');
};

const App = () => {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>
    );
};

export default App;
