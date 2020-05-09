package com.skeduler.skeduler.services;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;

import com.skeduler.skeduler.models.Job;
import com.skeduler.skeduler.repositories.JobRepository;

import static javax.transaction.Transactional.TxType.REQUIRED;
import static javax.transaction.Transactional.TxType.SUPPORTS;

import java.util.List;

@ApplicationScoped
@Transactional(REQUIRED)
public class JobService implements CRUDService<Job> {

    @Inject
    JobRepository repository;


    @Transactional(SUPPORTS)
    public List<Job> findAll() {
        return repository.listAll();
    }

    @Transactional(SUPPORTS)
    public Job findById(Long id) {
        return repository.findById(id);
    }

    public Job persist(@Valid Job entity) {
        repository.persist(entity);
        return entity;
    }

    public Job update(@Valid Job entity) {
        Job persisted = repository.findById(entity.id);
        persisted.applyChanges(entity);
        return entity;
    }

    public void delete(Long id) {
        Job entity = repository.findById(id);
        entity.delete();
    }
}
