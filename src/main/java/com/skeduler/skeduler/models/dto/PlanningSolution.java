package com.skeduler.skeduler.models.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.json.bind.annotation.JsonbTransient;

import com.skeduler.skeduler.models.Employee;
import com.skeduler.skeduler.models.Job;
import com.skeduler.skeduler.models.Planning;
import com.skeduler.skeduler.models.Shift;
import com.skeduler.skeduler.models.WorkingDay;
import com.skeduler.skeduler.models.interfaces.Solution;

import helper.ListHelper;
import helper.MathHelper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class PlanningSolution implements Solution {

    private List<WorkingDay> days;

    private List<Job> jobs;

    private List<Employee> employees;

    private Set<Shift> shifts;

    private double score;

    public PlanningSolution(List<WorkingDay> days, List<Job> jobs, List<Employee> employees) {
        this(days, jobs, employees, null);
    }

    public PlanningSolution(List<WorkingDay> days, List<Job> jobs, List<Employee> employees, Set<Shift> shifts) {
        this.days = days;
        this.jobs = jobs;
        this.employees = employees;
        this.shifts = shifts != null ? shifts : generateShifts();

        this.score = computeScore();
    }

    @JsonbTransient
	public PlanningSolution getRandomNeighbour() {
        Set<Shift> updatedShifts = hasBadEmployeeDistribution()
            ? swapEmployees(this.shifts)
            : swapShifts(this.shifts);

        return new PlanningSolution(days, jobs, employees, updatedShifts);
    }

    @JsonbTransient
    public Planning toPlanning() {
        return new Planning(shifts, " Generated planning");
    }

    /**
     *
     * @return list of employees where number of dups is the minimum number of shifts each employee should do
     */
    @JsonbTransient
    public List<Employee> getEmployeePossibilities() {
        int lowestJobDuration = jobs.stream().min(Comparator.comparing(Job::getDuration)).map(Job::getDuration).orElse(1);
        return this.employees.stream().flatMap((Employee employee) -> {
            long numberOfShifts = Math.round(Math.ceil(1.0 * employee.getContractHours() / lowestJobDuration));
            return Stream.generate(() -> employee).limit(numberOfShifts);
        }).collect(Collectors.toList());
    }

    private Set<Shift> generateShifts() {
        List<Employee> employeePossibilities = getEmployeePossibilities();
        return IntStream
            .range(0, days.size())
            .boxed()
            .flatMap(dayNb -> {
                return IntStream.range(0, jobs.size()).mapToObj(jobNb -> {
                    int randomEmployeeIndex = ThreadLocalRandom.current().nextInt(0, employeePossibilities.size());
                    return new Shift(
                days.get(dayNb),
                jobs.get(jobNb),
                employeePossibilities.remove(randomEmployeeIndex)
            );
        });
        }).collect(Collectors.toSet());
    }

    public boolean hasBadEmployeeDistribution() {
        return getContractScore() < 80;
    }

    public Set<Shift> swapEmployees(Set<Shift> shifts) {
        int randomShiftIndex = ThreadLocalRandom.current().nextInt(0, shifts.size());
        int randomEmployeeIndex = ThreadLocalRandom.current().nextInt(0, jobs.size());
        Shift[] arr = shifts.toArray(new Shift[shifts.size()]);
        arr[randomShiftIndex].setEmployee(employees.get(randomEmployeeIndex));
        return Set.of(arr);
    }

    public Set<Shift> swapShifts(Set<Shift> shifts) {

        Shift[] arr = shifts.toArray(new Shift[shifts.size()]);
        int firstRandomShiftIndex = ThreadLocalRandom.current().nextInt(0, shifts.size());
        int secondRandomShiftIndex = ThreadLocalRandom.current().nextInt(0, shifts.size());

        Shift firstRandomShift = arr[firstRandomShiftIndex];
        Shift secondRandomShift = arr[secondRandomShiftIndex];
        arr[firstRandomShiftIndex] = secondRandomShift;
        arr[secondRandomShiftIndex] = firstRandomShift;

        Shift tmp = new Shift();
        tmp.setEmployee(firstRandomShift.getEmployee());

        firstRandomShift.setEmployee(secondRandomShift.getEmployee());
        secondRandomShift.setEmployee(tmp.getEmployee());


        return Set.of(arr);
    }

    /*******************
     * Score computing *
     *******************/

    private double computeScore() {
        double hardConstraintsCoef = computeHardConstraints();
        double softConstraintsCoef = computeSoftConstraints();
        return hardConstraintsCoef* 1000 + softConstraintsCoef;
    }

    /**
     * @return 1 if all hard constraints are respected, else 0
     */
    private double computeHardConstraints() {
        double res = 1;
        if(hasEmployeesWorkingTwiceOnAWorkingDay()) {
            res = 0;
        }
        return res;
    }

    public boolean hasEmployeesWorkingTwiceOnAWorkingDay() {
        // System.out.println(shifts.stream().map(s -> List.of(s.getEmployee().getName(), s.getDay().day.toString()))).collect(Collectors.toList());
        return shifts.stream().filter(ListHelper.distinctByKey(p -> List.of(p.getEmployee(), p.getDay()))).count() != shifts.size();
    }

    /**
     * @return a positive number, the higher it is, the more constraints it respects
     */
    private double computeSoftConstraints() {
        double res = 0;
        res += getContractScore();
        res += getJobPreferenceScore();
        return res;

    }

    /**
     * Calculates the absolute sum of all differences betweem contract and actual values.
     * @return a positive number up to 100, the higher the sum, the lower the number
     */
    public double getContractScore() {
        Map<String, Integer> hourOffsetMap = employees.stream()
            .collect(Collectors.toConcurrentMap(Employee::getName, Employee::getContractHours));

            shifts.forEach(shift ->
                hourOffsetMap.merge(
                    shift.getEmployee().getName(),
                    - shift.getJob().getDuration(),
                    Integer::sum)
            );
            double score = hourOffsetMap.values().stream().reduce(0, MathHelper::sumabs);
            return Math.round(MathHelper.reverseAbsFn(score));
        }

    /**
     * Calculates the sum of all shift matching employees job preference.
     * @return a positive number up to 100, the higher the sum, the lower the number
     */
    public double getJobPreferenceScore() {
        Integer score = shifts.stream()
            .map(shift -> shift.getEmployee().getJobs().contains(shift.getJob()) ? 0 : 1)
            .reduce(0, Integer::sum);

        return Math.round(MathHelper.reverseAbsFn(score));
    }


}

