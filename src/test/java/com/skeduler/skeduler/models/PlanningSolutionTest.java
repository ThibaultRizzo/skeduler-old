package com.skeduler.skeduler.models;

import static org.junit.Assert.assertThat;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.skeduler.skeduler.models.dto.PlanningSolution;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class PlanningSolutionTest {

    @Test
    public void shouldGetEmployeePossibilities() {
        // Given a set of employees
        PlanningSolution solution = getStandardSolution();

        // When retrieving the list of possibilities
        List<Employee> employeePossibilities = solution.getEmployeePossibilities();

        // Then possibilites match each employee contract hours
        assertEquals(18, employeePossibilities.size());
    }

    @Test
    public void shouldGenerateShifts() {
        // Given a solution
        PlanningSolution solution = getStandardSolution();

        // When instantiating it, then the right number of shifts is generated
        assertEquals(12, solution.getShifts().size());
    }

    @Test
    public void hasTwiceEmployeeWorkingInSameDay() {
        // Given a solution with the same employee twice in the same day
        List<WorkingDay> days = List.of(
            new WorkingDay(DayOfWeek.MONDAY, true),
            new WorkingDay(DayOfWeek.TUESDAY, true)
        );

        List<Job> jobs = List.of(
            new Job("Manager", 9),
            new Job("Waiter1", 4)
            );
            List<Employee> employees = List.of(
                new Employee("Thibault", 13, Set.of(jobs.get(0), jobs.get(1))),
                new Employee("Shanel", 13, Set.of(jobs.get(0), jobs.get(1)))
                );
        PlanningSolution badSolution = new PlanningSolution(days, jobs, employees, Set.of(
            new Shift(days.get(0), jobs.get(0), employees.get(0)),
            new Shift(days.get(0), jobs.get(1), employees.get(0))
        ));
        PlanningSolution goodSolution = new PlanningSolution(days, jobs, employees, Set.of(
            new Shift(days.get(0), jobs.get(0), employees.get(0)),
            new Shift(days.get(0), jobs.get(1), employees.get(1)),
            new Shift(days.get(1), jobs.get(0), employees.get(0)),
            new Shift(days.get(1), jobs.get(1), employees.get(1))
        ));

        // When instantiating it, then the right number of shifts is generated
        assertTrue(badSolution.hasEmployeesWorkingTwiceOnAWorkingDay());
        assertFalse(goodSolution.hasEmployeesWorkingTwiceOnAWorkingDay());
    }

    @Test
    public void hasBadEmployeeDistribution() {
        List<WorkingDay> days = List.of(
            new WorkingDay(DayOfWeek.MONDAY, true),
            new WorkingDay(DayOfWeek.TUESDAY, true)
        );

        List<Job> jobs = List.of(
            new Job("Manager", 9),
            new Job("Waiter1", 4)
            );
            List<Employee> employees = List.of(
                new Employee("Thibault", 18, Set.of(jobs.get(0), jobs.get(1))),
                new Employee("Shanel", 8, Set.of(jobs.get(0), jobs.get(1)))
                );

                Set<Shift> shifts= Set.of(
                    new Shift(days.get(0), jobs.get(0), employees.get(0)),
                    new Shift(days.get(0), jobs.get(1), employees.get(1)),
                    new Shift(days.get(1), jobs.get(0), employees.get(0)),
                    new Shift(days.get(1), jobs.get(1), employees.get(1))
                );
        PlanningSolution solution = new PlanningSolution(days, jobs, employees, shifts);

        assertEquals(100, solution.getContractScore());
        assertEquals(100, solution.getJobPreferenceScore());
        assertFalse(solution.hasBadEmployeeDistribution());
    }


    private PlanningSolution getStandardSolution() {
        List<WorkingDay> days = List.of(
            new WorkingDay(DayOfWeek.MONDAY, true),
            new WorkingDay(DayOfWeek.TUESDAY, true),
            new WorkingDay(DayOfWeek.WEDNESDAY, true)
        );

        List<Job> jobs = List.of(
            new Job("Manager", 9),
            new Job("Waiter1", 4),
            new Job("Waiter2", 4),
            new Job("Bartender", 5)
            );
            List<Employee> employees = List.of(
                new Employee("Thibault", 23, Set.of(jobs.get(0), jobs.get(3))),
                new Employee("Shanel", 17, Set.of(jobs.get(0), jobs.get(1), jobs.get(2))),
                new Employee("Paul", 12, Set.of(jobs.get(1), jobs.get(2))),
                new Employee("Sixtine", 14, Set.of(jobs.get(1), jobs.get(3)))
                );
        return new PlanningSolution(days, jobs, employees);
    }
}
