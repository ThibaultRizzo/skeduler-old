import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Grid, Typography } from '@material-ui/core';
import { ItemFormProps } from '../layout/CrudPage';
import { Employee } from './employee';
import { saveItem } from './employeeDucks';
import { RootState } from '../config/reducers';
import FormMultiSelect from '../layout/FormMultiSelect';
import { loadList as loadJobList } from '../job/jobDucks';

const EmployeeForm = ({ item, onSubmit }: ItemFormProps<Employee>) => {
    const dispatch = useDispatch();
    const creationMode = item === null;
    const title = creationMode ? 'Create new employee' : 'Update employee: ' + item?.id;
    const { loading } = useSelector((state: RootState) => state.employee);
    const { list: jobs } = useSelector((state: RootState) => state.job);
    const defaultItem = {} as Employee;

    useEffect(() => {
        dispatch(loadJobList());
    }, [dispatch]);

    return (
        <Grid container>
            <Grid item>
                <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item>
                <Formik
                    enableReinitialize
                    initialValues={creationMode ? defaultItem : (item as Employee)}
                    onSubmit={(values: Employee, { setSubmitting }) => {
                        setSubmitting(false);
                        dispatch(saveItem({ item: values, creationMode }));
                        onSubmit();
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                            />
                            <input
                                type="number"
                                name="contractHours"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.contractHours}
                            />
                            {jobs && jobs.length > 0 && (
                                <FormMultiSelect
                                    name="jobs"
                                    options={jobs}
                                    getKey={(p: any) => {
                                        return p.id;
                                    }}
                                    getValue={(p: any) => {
                                        return p.name;
                                    }}
                                />
                            )}
                            {errors.name && touched.name && errors.name}
                            <button type="submit" disabled={isSubmitting || loading}>
                                Submit
                            </button>
                        </form>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};

export default EmployeeForm;
