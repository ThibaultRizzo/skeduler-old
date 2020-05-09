import React from 'react';
import { Link as NavLink } from 'react-router-dom';
import { Link as MUILink } from '@material-ui/core';
import { LinkProps } from '@material-ui/core/Link';

interface Props extends LinkProps {
    to: string;
    replace?: boolean;
}

const RouterLink = (props: Props) => <MUILink {...props} component={NavLink as any} />;

export default RouterLink;
