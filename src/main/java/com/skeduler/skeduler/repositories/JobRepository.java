package com.skeduler.skeduler.repositories;

import javax.enterprise.context.ApplicationScoped;

import com.skeduler.skeduler.models.Job;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class JobRepository implements PanacheRepository<Job> {

}
