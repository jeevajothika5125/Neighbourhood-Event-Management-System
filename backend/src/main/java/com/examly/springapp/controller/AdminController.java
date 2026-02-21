package com.examly.springapp.controller;

import com.examly.springapp.dto.AnalyticsDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Event;
import com.examly.springapp.model.AuditLog;
import com.examly.springapp.service.AnalyticsService;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.EventService;
import com.examly.springapp.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EventService eventService;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
    
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/audit")
    public ResponseEntity<String> getAuditLogs() {
        return ResponseEntity.ok("Audit logs data");
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        AnalyticsDTO analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }
}