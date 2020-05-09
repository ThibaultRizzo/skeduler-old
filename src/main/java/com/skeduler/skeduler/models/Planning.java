package com.skeduler.skeduler.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.json.bind.annotation.JsonbProperty;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import helper.ListHelper;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.reactivex.annotations.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(of = {"id"})
@AllArgsConstructor
@NoArgsConstructor
public class Planning extends AbstractPanacheEntity<Planning> {


    // @OneToMany(mappedBy = "planning", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    // @Fetch(FetchMode.SELECT)
    @OneToMany(mappedBy = "planning", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @OrderBy("id asc")
    private Set<Shift> shifts = new HashSet<>();

    @NotNull
    @Column(unique=true)
    public String title;

    // @NonNull
    // @PositiveOrZero
    // public int duration;

    public void applyChanges(Planning planning) {
        this.title = planning.title;
        // this.shifts.stream().map(s -> {
        //     s.setName("lol" + s.id);
        //     return s;
        // }).collect(Collectors.toSet());
        // this.shifts.removeIf(o -> o.id == 2L);
        planning.shifts.forEach(s -> {
            s.setPlanning(planning);
        });
        ListHelper.applyEntityUpdates(this.shifts, planning.shifts);
    }
}
