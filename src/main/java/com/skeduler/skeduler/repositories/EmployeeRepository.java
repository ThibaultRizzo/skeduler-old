package com.skeduler.skeduler.repositories;

import javax.enterprise.context.ApplicationScoped;

import com.skeduler.skeduler.models.Employee;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class EmployeeRepository implements PanacheRepository<Employee> {

}
