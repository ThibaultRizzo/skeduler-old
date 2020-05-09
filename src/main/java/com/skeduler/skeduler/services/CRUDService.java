package com.skeduler.skeduler.services;

import java.util.List;

import javax.validation.Valid;

public interface CRUDService<T> {

    public List<T> findAll();

    public T findById(Long id);

    public T persist(@Valid T entity);

    public T update(@Valid T entity);

    public void delete(Long id);
}
