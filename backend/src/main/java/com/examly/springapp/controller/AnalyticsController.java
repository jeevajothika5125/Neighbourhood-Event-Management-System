package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.EventRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @GetMapping("/stats")
    public Map<String, Object> getAnalyticsStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        stats.put("totalEvents", eventRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRegistrations", eventRegistrationRepository.count());
        stats.put("approvedEvents", eventRepository.countByStatus(com.examly.springapp.model.Event.Status.APPROVED));
        stats.put("pendingEvents", eventRepository.countByStatus(com.examly.springapp.model.Event.Status.PENDING));
        
        // Users by role
        Map<String, Long> usersByRole = new HashMap<>();
        usersByRole.put("ADMIN", userRepository.countByRole(User.Role.ADMIN));
        usersByRole.put("ORGANIZER", userRepository.countByRole(User.Role.ORGANIZER));
        usersByRole.put("PARTICIPANT", userRepository.countByRole(User.Role.PARTICIPANT));
        stats.put("usersByRole", usersByRole);
        
        return stats;
    }

    @GetMapping("/top-organizers")
    public List<Map<String, Object>> getTopOrganizers() {
        return eventRepository.findTopOrganizers();
    }
}