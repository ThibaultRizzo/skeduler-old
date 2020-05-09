package com.skeduler.skeduler.models.dto;

import java.util.List;

import com.skeduler.skeduler.models.Employee;
import com.skeduler.skeduler.models.Job;
import com.skeduler.skeduler.models.WorkingDay;
import com.skeduler.skeduler.models.interfaces.SolutionFactory;

import lombok.Data;

@Data
public class PlanningSolutionFactory implements SolutionFactory<PlanningSolution> {
    private List<WorkingDay> days;
    private List<Job> jobs;
    private List<Employee> employees;

    public PlanningSolutionFactory(List<WorkingDay> days, List<Job> jobs, List<Employee> employees) {
        this.days = days;
        this.jobs = jobs;
        this.employees = employees;
    }

    public PlanningSolution generate() {
		return new PlanningSolution(days, jobs, employees);
    }
}
