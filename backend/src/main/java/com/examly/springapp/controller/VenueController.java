package com.examly.springapp.controller;

import com.examly.springapp.model.Venue;
import com.examly.springapp.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {
    
    @Autowired
    private VenueRepository venueRepository;
    
    @PostMapping
    public ResponseEntity<Venue> createVenue(@RequestBody Venue venue) {
        Venue savedVenue = venueRepository.save(venue);
        return ResponseEntity.ok(savedVenue);
    }
    
    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        List<Venue> venues = venueRepository.findAll();
        return ResponseEntity.ok(venues);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        Venue venue = venueRepository.findById(id).orElse(null);
        return ResponseEntity.ok(venue);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @RequestBody Venue venue) {
        venue.setVenueId(id);
        Venue updatedVenue = venueRepository.save(venue);
        return ResponseEntity.ok(updatedVenue);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVenue(@PathVariable Long id) {
        venueRepository.deleteById(id);
        return ResponseEntity.ok("Venue deleted successfully");
    }
}