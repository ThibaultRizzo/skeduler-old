package com.skeduler.skeduler.repositories;

import javax.enterprise.context.ApplicationScoped;

import com.skeduler.skeduler.models.Planning;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class PlanningRepository implements PanacheRepository<Planning> {

}
