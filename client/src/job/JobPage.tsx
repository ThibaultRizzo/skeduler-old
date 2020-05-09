import React from 'react';
import CrudPage from '../layout/CrudPage';
import JobForm from './JobForm';
import JobTable from './JobTable';

const JobPage = () => <CrudPage TableComponent={JobTable} FormComponent={JobForm} />;

export default JobPage;
