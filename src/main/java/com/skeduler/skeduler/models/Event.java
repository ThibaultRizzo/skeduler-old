package com.skeduler.skeduler.models;

import java.time.LocalDateTime;
import java.util.Objects;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import com.skeduler.skeduler.models.enums.EventType;

import io.reactivex.annotations.NonNull;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
public class Event extends AbstractPanacheEntity<Event> {

    // @ManyToOne
    // @ToString.Exclude
    // private Agenda agenda;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "employeeid")
    @JsonbTransient
    private Employee employee;

    @NotNull
    private String name;

    // @NonNull
    // private LocalDateTime from;

    // @NonNull
    // private LocalDateTime to;

    @NotNull
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    public void applyChanges(Event event) {
        this.name = event.name;
        // this.from = event.from;
        // this.to = event.to;
        this.eventType = event.eventType;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null || obj.getClass() != this.getClass()) {
            return false;
        }
        Event entity = (Event)obj;
        return id == entity.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
