package com.skeduler.skeduler.helper;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import com.skeduler.skeduler.models.Planning;
import com.skeduler.skeduler.models.Shift;

import org.junit.jupiter.api.Test;

import helper.ListHelper;
import io.quarkus.test.junit.QuarkusTest;

// @QuarkusTest
public class ListHelperTest {

    @Test
    public void applyEntityUpdates() {
        // Given two lists of entities
        // List<Shift> oldList = List.of(createShift(1L, "Hello"), createShift(2L, "Hello2"));
        // List<Shift> newList = List.of(createShift(1L, "Hello updated"), createShift(null, "Hello3"));

        // // When applying updates
        // ListHelper.applyEntityUpdates(oldList, newList);

        // // Then oldList contains updates of newList
        // assertEquals(oldList.get(0).getName(), "Hello updated");
        // assertEquals(oldList.get(0).id, 1L);

        // assertEquals(oldList.get(1).getName(), "Hello3");
        // assertEquals(oldList.get(1).id, null);
    }

    private Shift createShift(Long id, String name) {
        Shift shift = new Shift();
        shift.id = id;
        return shift;
    }
}
