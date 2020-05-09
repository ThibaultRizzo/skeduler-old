package com.skeduler.skeduler.services;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;

import com.skeduler.skeduler.models.WorkingDay;
import com.skeduler.skeduler.repositories.WorkingDayRepository;

import static javax.transaction.Transactional.TxType.REQUIRED;
import static javax.transaction.Transactional.TxType.SUPPORTS;

import java.util.List;

@ApplicationScoped
@Transactional(REQUIRED)
public class WorkingDayService implements CRUDService<WorkingDay> {

    @Inject
    WorkingDayRepository repository;


    @Transactional(SUPPORTS)
    public List<WorkingDay> findAll() {
        return repository.listAll();
    }

    @Transactional(SUPPORTS)
    public WorkingDay findById(Long id) {
        return repository.findById(id);
    }

    public WorkingDay persist(@Valid WorkingDay entity) {
        repository.persist(entity);
        return entity;
    }

    public WorkingDay update(@Valid WorkingDay entity) {
        WorkingDay persisted = repository.findById(entity.id);
        persisted.applyChanges(entity);
        return entity;
    }

    public void delete(Long id) {
        WorkingDay entity = repository.findById(id);
        entity.delete();
    }
}
