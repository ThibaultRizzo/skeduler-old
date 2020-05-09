package com.skeduler.skeduler.models;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@MappedSuperclass
public abstract class AbstractPanacheEntity<T> extends PanacheEntityBase {
        /**
     * The auto-generated ID field. This field is set by Hibernate ORM when this entity
     * is persisted.
     *
     * @see #persist()
     */
    @Id
    @GeneratedValue
    public Long id;

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "<" + id + ">";
    }

    /**
     * Update all fields with given entity ones
     */
    public abstract void applyChanges(T entity);
}
