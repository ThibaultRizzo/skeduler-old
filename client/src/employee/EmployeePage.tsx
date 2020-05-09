import React from 'react';
import CrudPage from '../layout/CrudPage';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';

const EmployeePage = () => <CrudPage TableComponent={EmployeeTable} FormComponent={EmployeeForm} />;

export default EmployeePage;
