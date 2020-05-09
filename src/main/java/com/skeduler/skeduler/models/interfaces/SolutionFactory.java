package com.skeduler.skeduler.models.interfaces;

public interface SolutionFactory<T extends Solution> {
    public T generate();
}
