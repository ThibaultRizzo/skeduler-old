import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import RouterLink from '../utils/RouterLink';

const Header = () => (
    <AppBar id="header">
        <Toolbar>
            <RouterLink to="/">
                <Typography variant="h1" color="inherit">
                    Waynes
                </Typography>
            </RouterLink>
        </Toolbar>
    </AppBar>
);

export default Header;
