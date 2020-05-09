package com.skeduler.skeduler.models;

import java.util.HashSet;
import java.util.Set;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.CascadeType;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Embeddable
@Data
public class Agenda {

    // @OneToOne(mappedBy = "agenda", fetch = FetchType.LAZY)
    // @JsonbTransient
    // private Employee employee;



    // @ManyToMany(cascade = CascadeType.ALL)
    // private Set<WorkingDay> workingDays = new HashSet<>();

    // @OneToMany(mappedBy = "agenda", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    // @OrderBy("name asc")
    // private Set<Event> events = new HashSet<>() ;

    // public void applyChanges(Agenda agenda) {
    //     // this.employee = agenda.employee;
    //     this.workingDays = agenda.workingDays;
    //     // this.events = agenda.events;
    // }
}
