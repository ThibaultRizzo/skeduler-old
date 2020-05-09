package com.skeduler.skeduler.models.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EventType {

    SPECIAL("Special"),
    HOLIDAY("Holiday");

    private String label;
}
