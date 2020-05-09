import React, { useEffect } from 'react';
import { TableProps } from '../layout/CrudPage';
import { Employee } from './employee';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../config/reducers';
import { loadList, deleteItem } from './employeeDucks';
import { LeadPencil, Delete } from 'mdi-material-ui';

const EmployeeTable = ({ onEdit }: TableProps<Employee>) => {
    const dispatch = useDispatch();
    const { loading, list } = useSelector((state: RootState) => state.employee);

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
                    <TableCell>Contract Hours</TableCell>
                    <TableCell>Jobs</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((item: Employee) => (
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
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.contractHours}</TableCell>
                        <TableCell>{item.jobs.map(p => p.title).join('\n')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default EmployeeTable;
