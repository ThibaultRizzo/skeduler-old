package helper;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;

import com.skeduler.skeduler.models.AbstractPanacheEntity;

public class ListHelper {
    /**
     * Update first entity list with add/remove/updates of second list
     */
    public static <T extends AbstractPanacheEntity<T>> void applyEntityUpdates(Collection<T> oldCollection, Collection<T> newCollection) {

        LinkedList<T> newList = new LinkedList<>(newCollection);
        // TODO: Flush session here to avoid dups error
        oldCollection.removeIf(o -> !newList.contains(o));
        oldCollection.forEach(item -> {
            T newItem = newList.stream().filter(c -> c.equals(item)).findFirst().get();
            item.applyChanges(newItem);
            newList.remove(item);
        });

        // All remaining items are new
        // Add them to new list and persist them
        oldCollection.addAll(newList);
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Map<Object, Boolean> seen = new ConcurrentHashMap<>();
        return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }
}
