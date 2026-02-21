package com.examly.springapp.controller;

import com.examly.springapp.model.Event;
import com.examly.springapp.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@CrossOrigin(origins = "http://localhost:3000")
public class OrganizerController {
    
    @Autowired
    private EventService eventService;
    
    @GetMapping("/events")
    public List<Event> getOrganizerEvents() {
        return eventService.getAllEvents();
    }
}