package com.examly.springapp.model;

import javax.persistence.*;

@Entity
@Table(name = "venues")
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long venueId;
    
    private String venueName;
    private String location;
    private Integer capacity;
    private String facilities;
    private String availableZones;
    
    public Venue() {}
    
    public Long getVenueId() { return venueId; }
    public void setVenueId(Long venueId) { this.venueId = venueId; }
    
    public Long getId() { return venueId; }
    public void setId(Long id) { this.venueId = id; }
    
    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }
    
    public String getName() { return venueName; }
    public void setName(String name) { this.venueName = name; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getAddress() { return location; }
    public void setAddress(String address) { this.location = address; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }
    
    public String getAvailableZones() { return availableZones; }
    public void setAvailableZones(String availableZones) { this.availableZones = availableZones; }
}