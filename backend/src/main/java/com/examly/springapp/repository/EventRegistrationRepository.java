package com.examly.springapp.repository;

import com.examly.springapp.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUsername(String username);
    List<EventRegistration> findByEventId(Long eventId);

    boolean existsByUsernameAndEventId(String username, Long eventId);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.eventId = :eventId")
    Long countByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.eventId IN (SELECT e.id FROM Event e WHERE e.organizerName = :organizerUsername)")
    Long countByOrganizerUsername(@Param("organizerUsername") String organizerUsername);
}