import React, { useState } from 'react';
import { Identified } from '../utils/ducks';
import { Grid } from '@material-ui/core';

export interface TableProps<T extends Identified> {
    onEdit: (item: T) => void;
}

export interface BasicFormProps<T extends Identified> {
    initialValues?: T;
    onSubmit: any;
}

export interface ItemFormProps<T extends Identified> extends BasicFormProps<T> {
    item: T | null;
}

export interface CrudPage<T extends Identified> {
    FormComponent: React.FunctionComponent<ItemFormProps<T>> | React.ComponentClass<ItemFormProps<T>>;
    TableComponent: React.FunctionComponent<TableProps<T>> | React.ComponentClass<TableProps<T>>;
}

const CrudPage = <T extends Identified>({ FormComponent, TableComponent }: CrudPage<T>) => {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormComponent item={selectedItem} onSubmit={() => setSelectedItem(null)} />
            </Grid>
            <Grid item xs={12}>
                <TableComponent onEdit={(item: T) => setSelectedItem(item)} />
            </Grid>
        </Grid>
    );
};

export default CrudPage;
