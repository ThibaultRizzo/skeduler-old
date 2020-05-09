import React from 'react';
import { LocationDescriptor } from 'history';

interface BaseMenu {
    label: string;
    icon?: React.ReactElement;
    dense?: boolean;
}

export interface LinkMenu extends BaseMenu {
    to: LocationDescriptor;
    exact?: boolean;
    onClick?: React.MouseEventHandler;
    nested?: boolean;
}

const menus: LinkMenu[] = [
    {
        to: '/planning',
        label: 'Planning',
        // icon: < />,
    },
    {
        to: '/employee',
        label: 'Employees',
        // icon: <FileTable />,
    },
    {
        to: '/job',
        label: 'Jobs',
        // icon: <FileAccount />,
    },
    {
        to: '/working-day',
        label: 'Working Days',
        // icon: <FileAccount />,
    },
];

export default menus;
