package com.skeduler.skeduler.models;

import java.util.Objects;

import javax.json.bind.annotation.JsonbCreator;
import javax.json.bind.annotation.JsonbProperty;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.reactivex.annotations.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
public class Shift extends AbstractPanacheEntity<Shift> {

    public Shift(WorkingDay day, Job job, Employee employee) {
        super();
        this.day = day;
        this.job = job;
        this.employee = employee;
    }

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "planningid")
    @JsonbTransient
    private Planning planning;

    // @Id
    // @ManyToOne
    // @ToString.Exclude
    // private Planning planning;

    // TODO: Add a composite key with employee + job + day
    @ManyToOne(fetch = FetchType.EAGER)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    private WorkingDay day;


    // @NonNull
    // @PositiveOrZero
    // public int duration;

    @JsonbTransient
    public Planning getPlanning() {
        return this.planning;
    }
    public void applyChanges(Shift shift) {
        this.employee = shift.employee;
        this.job = shift.job;
        this.day = shift.day;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null || obj.getClass() != this.getClass()) {
            return false;
        }
        Shift entity = (Shift)obj;
        return id == entity.id && day == entity.day && job == entity.job && employee == entity.employee;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
