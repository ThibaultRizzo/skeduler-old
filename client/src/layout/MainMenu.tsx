import React, { forwardRef } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListItemProps } from '@material-ui/core';
import menus, { LinkMenu } from '../menus';
import { LocationDescriptor } from 'history';
import { NavLink } from 'react-router-dom';

interface ListItemLinkProps {
    to: LocationDescriptor;
    exact?: boolean;
    onClick?: React.MouseEventHandler;
    children: React.ReactNode;
}

interface ListItemWithLinkProps extends ListItemLinkProps {
    component?: React.ElementType<ListItemProps>;
    className?: string;
    dense?: boolean;
}

const ListItemLink = forwardRef<HTMLAnchorElement, ListItemLinkProps>((props, ref) => (
    <NavLink {...props} innerRef={ref} />
));

const ListItemWithLink = (props: ListItemWithLinkProps) => <ListItem button {...props} />;

const MainMenu = () => (
    <List>
        {menus.map((menu, i) => (
            <MenuLink key={i} {...menu} to={menu.to} />
        ))}
    </List>
);

const MenuLink = ({ label, icon, exact, to, dense, onClick }: LinkMenu) => {
    return (
        <ListItemWithLink component={ListItemLink as any} key={label} to={to}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText inset={false} primary={label} />
        </ListItemWithLink>
    );
};

export default MainMenu;
