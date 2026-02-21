package com.examly.springapp.controller;

import com.examly.springapp.model.Event;
import com.examly.springapp.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {
    
    @Autowired
    private EventRepository eventRepository;
    
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    @GetMapping("/approved")
    public List<Event> getApprovedEvents() {
        return eventRepository.findByStatusOrderByCreatedAtDesc(Event.Status.APPROVED);
    }
    
    @GetMapping("/pending")
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatusOrderByCreatedAtDesc(Event.Status.PENDING);
    }
    
    @GetMapping("/organizer/{organizerName}")
    public List<Event> getEventsByOrganizer(@PathVariable String organizerName) {
        return eventRepository.findByOrganizerName(organizerName);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        event.setStatus(Event.Status.PENDING);
        return eventRepository.save(event);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(id);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setDate(eventDetails.getDate());
            event.setTime(eventDetails.getTime());
            event.setLocation(eventDetails.getLocation());
            event.setCategory(eventDetails.getCategory());
            event.setContactNumber(eventDetails.getContactNumber());
            return ResponseEntity.ok(eventRepository.save(event));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Event> updateEventStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            Optional<Event> optionalEvent = eventRepository.findById(id);
            if (optionalEvent.isPresent()) {
                Event event = optionalEvent.get();
                // Remove quotes if present and convert to uppercase
                String cleanStatus = status.replace("\"", "").toUpperCase();
                event.setStatus(Event.Status.valueOf(cleanStatus));
                return ResponseEntity.ok(eventRepository.save(event));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}