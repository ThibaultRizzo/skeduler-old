import React, { useEffect } from 'react';
import { TableProps } from '../layout/CrudPage';
import { Job } from './job';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../config/reducers';
import { loadList, deleteItem } from './jobDucks';
import { LeadPencil, Delete } from 'mdi-material-ui';

const JobTable = ({ onEdit }: TableProps<Job>) => {
    const dispatch = useDispatch();
    const { loading, list } = useSelector((state: RootState) => state.job);

    useEffect(() => {
        dispatch(loadList());
    }, [dispatch]);
    if (loading && !list) {
        return <div>Loading...</div>;
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Durée</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map(item => (
                    <TableRow>
                        <TableCell>
                            <IconButton onClick={() => onEdit(item)}>
                                <LeadPencil />
                            </IconButton>
                            <IconButton onClick={() => dispatch(deleteItem(item.id))}>
                                <Delete />
                            </IconButton>
                        </TableCell>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default JobTable;
