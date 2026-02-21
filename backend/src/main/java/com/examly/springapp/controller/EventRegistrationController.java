package com.examly.springapp.controller;

import com.examly.springapp.model.EventRegistration;
import com.examly.springapp.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/event-registrations")
@CrossOrigin(origins = "http://localhost:3000")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerForEvent(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = (String) requestData.get("username");
            Long eventId = Long.valueOf(requestData.get("eventId").toString());
            
            if (eventRegistrationRepository.existsByUsernameAndEventId(username, eventId)) {
                response.put("success", false);
                response.put("message", "Already registered for this event");
                return ResponseEntity.badRequest().body(response);
            }
            
            EventRegistration registration = new EventRegistration(username, eventId);
            EventRegistration savedRegistration = eventRegistrationRepository.save(registration);
            
            response.put("success", true);
            response.put("registration", savedRegistration);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<EventRegistration>> getUserRegistrations(@PathVariable String username) {
        List<EventRegistration> registrations = eventRegistrationRepository.findByUsername(username);
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventRegistration>> getEventRegistrations(@PathVariable Long eventId) {
        List<EventRegistration> registrations = eventRegistrationRepository.findByEventId(eventId);
        return ResponseEntity.ok(registrations);
    }



    @GetMapping("/count/event/{eventId}")
    public ResponseEntity<Map<String, Long>> getEventRegistrationCount(@PathVariable Long eventId) {
        Long count = eventRegistrationRepository.countByEventId(eventId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/organizer/{organizerUsername}")
    public ResponseEntity<Map<String, Long>> getOrganizerRegistrationCount(@PathVariable String organizerUsername) {
        Long count = eventRegistrationRepository.countByOrganizerUsername(organizerUsername);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{username}/{eventId}")
    public ResponseEntity<Map<String, Boolean>> checkRegistration(@PathVariable String username, @PathVariable Long eventId) {
        boolean isRegistered = eventRegistrationRepository.existsByUsernameAndEventId(username, eventId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isRegistered", isRegistered);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/unregister/{username}/{eventId}")
    public ResponseEntity<Map<String, Object>> unregisterFromEvent(@PathVariable String username, @PathVariable Long eventId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<EventRegistration> registrations = eventRegistrationRepository.findByUsername(username);
            EventRegistration toDelete = registrations.stream()
                .filter(reg -> reg.getEventId().equals(eventId))
                .findFirst()
                .orElse(null);
            
            if (toDelete != null) {
                eventRegistrationRepository.delete(toDelete);
                response.put("success", true);
                response.put("message", "Successfully unregistered from event");
            } else {
                response.put("success", false);
                response.put("message", "Registration not found");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Unregistration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        try {
            long count = eventRegistrationRepository.count();
            response.put("success", true);
            response.put("message", "Event registration service is working");
            response.put("totalRegistrations", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Database error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}