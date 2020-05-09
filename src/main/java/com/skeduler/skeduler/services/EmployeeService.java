package com.skeduler.skeduler.services;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;

import com.skeduler.skeduler.models.Employee;
import com.skeduler.skeduler.repositories.EmployeeRepository;

import static javax.transaction.Transactional.TxType.REQUIRED;
import static javax.transaction.Transactional.TxType.SUPPORTS;

import java.util.List;

@ApplicationScoped
@Transactional(REQUIRED)
public class EmployeeService implements CRUDService<Employee> {

    @Inject
    EmployeeRepository repository;


    @Transactional(SUPPORTS)
    public List<Employee> findAll() {
        return repository.listAll();
    }

    @Transactional(SUPPORTS)
    public Employee findById(Long id) {
        return repository.findById(id);
    }

    public Employee persist(@Valid Employee entity) {
        entity.getEvents().forEach(e -> e.setEmployee(entity));
        repository.persist(entity);
        return entity;
    }

    public Employee update(@Valid Employee entity) {
        Employee persisted = repository.findById(entity.id);
        persisted.applyChanges(entity);
        return entity;
    }

    public void delete(Long id) {
        Employee entity = repository.findById(id);
        entity.delete();
    }
}
