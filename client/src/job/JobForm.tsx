import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { ItemFormProps } from '../layout/CrudPage';
import { Job } from './job';
import { saveItem } from './jobDucks';
import { RootState } from '../config/reducers';

const JobForm = ({ item, onSubmit }: ItemFormProps<Job>) => {
    const dispatch = useDispatch();
    const creationMode = item === null;
    const title = creationMode ? 'Create new job' : 'Update job: ' + item?.id;
    const { loading } = useSelector((state: RootState) => state.job);
    const defaultItem = {} as Job;
    return (
        <Formik
            enableReinitialize
            initialValues={creationMode ? defaultItem : (item as Job)}
            onSubmit={(values: Job, { setSubmitting }) => {
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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">{title}</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Name"
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Duration"
                                type="number"
                                name="duration"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.duration}
                            />
                        </Grid>
                        {errors.title && touched.title && errors.title}
                        <Grid item xs={12}>
                            <Button color="primary" type="submit" disabled={isSubmitting || loading}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    );
};

export default JobForm;
