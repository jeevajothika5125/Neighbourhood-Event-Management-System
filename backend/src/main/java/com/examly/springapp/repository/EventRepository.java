package com.examly.springapp.repository;

import com.examly.springapp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(Event.Status status);
    List<Event> findByOrganizerName(String organizerName);
    List<Event> findByCategory(String category);
    List<Event> findByStatusOrderByCreatedAtDesc(Event.Status status);
    Long countByStatus(Event.Status status);
    
    @Query("SELECT e.organizerName as organizer, COUNT(e) as eventCount FROM Event e GROUP BY e.organizerName ORDER BY COUNT(e) DESC")
    List<Map<String, Object>> findTopOrganizers();
}