package com.skeduler.skeduler.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.enterprise.context.ApplicationScoped;

import com.skeduler.skeduler.models.interfaces.Solution;
import com.skeduler.skeduler.models.interfaces.SolutionFactory;

@ApplicationScoped
public class SimulatedAnnealingService<T extends Solution> {

    int THREAD_NB = 10;
    int CYCLE_NB = 10;
    int MAX_CYCLE = 100;

    public T apply(SolutionFactory<T> factory) {
        List<T> solutionList = generateNSolutions(factory, THREAD_NB);
    for (int outerCycle = 0; outerCycle < CYCLE_NB; outerCycle++) {
        // From previous solutions, generate next cycle of solutions and pick the best one
        T bestSolution = solutionList.parallelStream().map(this::generateCycle).max(Comparator.comparing(Solution::getScore)).get();//reduce((prev, curr) => prev.score > curr.score ? prev : curr);

        // Add best solution, and generate N-1 new solutions to generate from.
        solutionList = generateNSolutions(factory, THREAD_NB);
        solutionList.add(bestSolution);
        System.out.print(bestSolution.getScore() + "/" + Collections.max(solutionList, Comparator.comparing(Solution::getScore)).getScore() + " ");
    }
    T finalSolution = Collections.max(solutionList, Comparator.comparing(Solution::getScore));
    System.out.println("Final solution is: " + finalSolution.getScore());
    return finalSolution;
    }

    // Iteratively pick a neighbouring position depending on the temperature and previous score
    private T generateCycle(T solution) {
        T state = solution;
        for (int cycle = 0; cycle < MAX_CYCLE; cycle++) {
            double temperature = getTemperature(cycle);
            T neighbour = (T)solution.getRandomNeighbour();
            double successProba = calculateAnnealingProbability(state.getScore(), neighbour.getScore(), temperature);
            state = successProba >= Math.random() ? neighbour : state;
        }
        return state;
    }

    private List<T> generateNSolutions(SolutionFactory<T> factory, int number) {
        return Stream.generate(factory::generate).limit(number).collect(Collectors.toList());

    }

private double calculateAnnealingProbability(double previousScore, double currentScore, double temperature) {
    return currentScore > previousScore ? 1 : Math.exp(-(previousScore - currentScore) / temperature);
}

private double getTemperature(int iteration) {
    return (iteration + 1) / MAX_CYCLE;
}

}
