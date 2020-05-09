package com.skeduler.skeduler.repositories;

import javax.enterprise.context.ApplicationScoped;

import com.skeduler.skeduler.models.WorkingDay;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class WorkingDayRepository implements PanacheRepository<WorkingDay> {

}
