package com.skeduler.skeduler.services;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;

import com.skeduler.skeduler.models.Planning;
import com.skeduler.skeduler.models.WorkingDay;
import com.skeduler.skeduler.models.dto.PlanningSolution;
import com.skeduler.skeduler.models.dto.PlanningSolutionFactory;
import com.skeduler.skeduler.repositories.PlanningRepository;

import static javax.transaction.Transactional.TxType.REQUIRED;
import static javax.transaction.Transactional.TxType.SUPPORTS;

import java.util.List;

@ApplicationScoped
@Transactional(REQUIRED)
public class PlanningService implements CRUDService<Planning> {

    @Inject
    PlanningRepository repository;

    @Inject
    SimulatedAnnealingService<PlanningSolution> simAnnService;

    @Inject
    JobService jobService;

    @Inject
    WorkingDayService dayService;

    @Inject
    EmployeeService employeeService;


    @Transactional(SUPPORTS)
    public List<Planning> findAll() {
        return repository.listAll();
    }

    @Transactional(SUPPORTS)
    public Planning findById(Long id) {
        return repository.findById(id);
    }

    public Planning persist(@Valid Planning planning) {
        planning.getShifts().forEach(s -> s.setPlanning(planning));
        repository.persist(planning);
        return planning;
    }

    public Planning update(@Valid Planning entity) {
        Planning persisted = repository.findById(entity.id);
        persisted.applyChanges(entity);
        return entity;
    }

    public void delete(Long id) {
        Planning entity = repository.findById(id);
        entity.delete();
    }

    public PlanningSolution generatePlanning() {

        return simAnnService.apply(new PlanningSolutionFactory(
            dayService.findAll(),
            jobService.findAll(),
            employeeService.findAll()
        ));
    }
}
