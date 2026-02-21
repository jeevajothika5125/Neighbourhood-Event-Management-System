package com.examly.springapp.controller;

import com.examly.springapp.model.Zone;
import com.examly.springapp.repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {
    
    @Autowired
    private ZoneRepository zoneRepository;
    
    @PostMapping
    public ResponseEntity<Zone> createZone(@RequestBody Zone zone) {
        Zone savedZone = zoneRepository.save(zone);
        return ResponseEntity.ok(savedZone);
    }
    
    @GetMapping
    public ResponseEntity<List<Zone>> getAllZones() {
        List<Zone> zones = zoneRepository.findAll();
        return ResponseEntity.ok(zones);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Zone> getZoneById(@PathVariable Long id) {
        Zone zone = zoneRepository.findById(id).orElse(null);
        return ResponseEntity.ok(zone);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteZone(@PathVariable Long id) {
        zoneRepository.deleteById(id);
        return ResponseEntity.ok("Zone deleted successfully");
    }
}