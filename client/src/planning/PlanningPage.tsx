import React, { useEffect } from 'react';
import {
    Grid,
    Card,
    CardHeader,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { loadLatest, generate } from './planningDucks';
import { RootState } from '../config/reducers';
import {
    Shift,
    Planning,
    getEmployeeStats,
    PlanningConfig,
    DEFAULT_CROSSOVER_RATE,
    DEFAULT_MUTATION_RATE,
    ScheduleSolution,
    PlanningSolution,
} from '../planning/planning';
import { Formik } from 'formik';
import { Day } from '../workingDays/workingDay';

const PlanningPage = () => (
    <Grid container>
        <Grid item>
            <PlanningList />
        </Grid>
        <Grid item xs={12}>
            <PlanningControls />
        </Grid>
        <Grid item>
            <PlanningTable />
        </Grid>
    </Grid>
);

const PlanningList = () => {
    const { item, loading }: { item: ScheduleSolution; loading: boolean } = useSelector(
        (state: RootState) => state.planning,
    );
    if (loading || !Boolean(item) || !Boolean(item.value)) {
        return <div>Loading...</div>;
    }
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Total Time</TableCell>
                    <TableCell>Objective</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {[...(getEmployeeStats(item.value) as any)].map(([name, stats]) => (
                    <TableRow key={'stats-' + name}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{stats.totalHours}</TableCell>
                        <TableCell>{stats.objective}</TableCell>
                        <TableCell>{stats.mismatchedJobs.join(' - ')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const PlanningControls = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.planning);
    const defaultConfig: PlanningConfig = {
        crossoverRate: DEFAULT_CROSSOVER_RATE,
        mutationRate: DEFAULT_MUTATION_RATE,
    };
    return (
        <Formik
            enableReinitialize
            initialValues={defaultConfig}
            onSubmit={(config: PlanningConfig, { setSubmitting }) => {
                setSubmitting(false);
                dispatch(generate(config));
            }}
        >
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* <Grid item>
                            <TextField
                                label="Crossover rate"
                                type="number"
                                name="crossoverRate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.crossoverRate}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Mutation rate"
                                type="number"
                                name="mutationRate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.mutationRate}
                            />
                        </Grid> */}
                        <Grid item>
                            <Button color="primary" type="submit" disabled={isSubmitting || loading}>
                                Generate planning
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    );
};

const PlanningTable = () => {
    const dispatch = useDispatch();

    const { item, loading }: { item: PlanningSolution; loading: boolean } = useSelector(
        (state: RootState) => state.planning,
    );
    useEffect(() => {
        dispatch(loadLatest());
    }, [dispatch]);

    if (loading || !Boolean(item) || !Boolean(item.shifts)) {
        return <div>Loading...</div>;
    }
    const shifts: Map<Day, Shift[]> = item.shifts.reduce((map, shift) => {
        if (map.has(shift.day.day)) {
            map.get(shift.day.day).push(shift);
        } else {
            map.set(shift.day.day, [shift]);
        }
        return map;
    }, new Map());
    shifts.forEach(s => s.sort((a, b) => a.job.id - b.job.id));

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                Fitness: {item.score}
            </Grid>
            {[...(shifts.entries() as any)].map(([day, s]) => (
                <Grid item key={day}>
                    <DayPlanning day={day} shifts={s} />
                </Grid>
            ))}
        </Grid>
    );
};

interface DayPlanning {
    day: string;
    shifts: Shift[];
}

const DayPlanning = ({ day, shifts }: DayPlanning) => (
    <Grid container direction="column" alignItems="stretch" justify="space-between" spacing={2}>
        <Grid item>
            <Typography variant="h1">{day}</Typography>
        </Grid>
        {shifts.map((shift, i) => (
            <Grid item key={i}>
                <ShiftCard shift={shift} />
            </Grid>
        ))}
    </Grid>
);

const ShiftCard = ({ shift }: { shift: Shift }) => (
    <Card>
        {shift.employee && (
            <CardHeader
                title={<Typography variant="h1">{shift.employee.name}</Typography>}
                subheader={<Typography variant="h6">{shift.job.title}</Typography>}
            />
        )}
    </Card>
);

export default PlanningPage;
