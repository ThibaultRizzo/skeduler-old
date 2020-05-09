package com.skeduler.skeduler.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import helper.ListHelper;
import io.reactivex.annotations.NonNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(callSuper = true, of={"id"})
@NoArgsConstructor
public class Employee extends AbstractPanacheEntity<Employee> {

    public Employee(String name, int contractHours, Set<Job> jobs) {
        this.name = name;
        this.contractHours = contractHours;
        this.jobs = jobs;
    }

    @NotNull
    @Column(unique=true)
    private String name;

    @NonNull
    @PositiveOrZero
    private int contractHours;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Job> jobs = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<WorkingDay> workingDays = new HashSet<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @OrderBy("id asc")
    private Set<Event> events = new HashSet<>() ;

    public void applyChanges(Employee employee) {
        this.name = employee.name;
        this.contractHours = employee.contractHours;
        this.jobs = employee.jobs;
        this.workingDays = employee.workingDays;
        employee.events.forEach(e -> {
            e.setEmployee(employee);
        });
        ListHelper.applyEntityUpdates(this.events, employee.events);
    }
}
