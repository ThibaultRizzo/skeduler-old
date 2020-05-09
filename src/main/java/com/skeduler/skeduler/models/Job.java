package com.skeduler.skeduler.models;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import io.reactivex.annotations.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class Job extends AbstractPanacheEntity<Job> {

    @NotNull
    @Column(unique=true)
    private String title;

    @NonNull
    @PositiveOrZero
    private int duration;

    public void applyChanges(Job job) {
        this.title = job.title;
        this.duration = job.duration;
    }
}
