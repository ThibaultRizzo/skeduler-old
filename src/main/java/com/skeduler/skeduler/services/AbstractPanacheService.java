package com.skeduler.skeduler.services;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;

import com.skeduler.skeduler.models.AbstractPanacheEntity;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

import static javax.transaction.Transactional.TxType.REQUIRED;
import static javax.transaction.Transactional.TxType.SUPPORTS;

import java.util.List;

// @ApplicationScoped
@Transactional(REQUIRED)
public class AbstractPanacheService<T extends AbstractPanacheEntity<T>> {

    // protected final R repository;

    // public AbstractPanacheService(R repository, Class<T> clazz) {
    //     this.repository = repository;
    // }


    // @Transactional(SUPPORTS)
    // public List<T> findAll() {
    //     return repository.listAll();
    // }

    // @Transactional(SUPPORTS)
    // public T findById(Long id) {
    //     return repository.findById(id);
    // }

    // public T persist(@Valid T entity) {
    //     repository.persist(entity);
    //     return entity;
    // }

    // public T update(@Valid T entity) {
    //     T persisted = repository.findById(entity.id);
    //     persisted.applyChanges(entity);
    //     return entity;
    // }

    // public void delete(Long id) {
    //     T entity = repository.findById(id);
    //     entity.delete();
    // }
}
