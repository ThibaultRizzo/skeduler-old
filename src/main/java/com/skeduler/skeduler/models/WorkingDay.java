package com.skeduler.skeduler.models;

import java.time.DayOfWeek;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class WorkingDay extends AbstractPanacheEntity<WorkingDay> {

    @NotNull
    @Column(unique=true)
    @Enumerated(EnumType.STRING)
    public DayOfWeek day;

    /**
     * Flag wether this day is counted as a business day
     */
    public boolean isActive;

    public void applyChanges(WorkingDay workingDay) {
        this.day = workingDay.day;
        this.isActive = workingDay.isActive;
    }
}
