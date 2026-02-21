package com.examly.springapp.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_event_registrations")
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private Long eventId;
    
    @Column(nullable = false)
    private LocalDateTime registrationDate;
    
    public EventRegistration() {
        this.registrationDate = LocalDateTime.now();
    }
    
    public EventRegistration(String username, Long eventId) {
        this.username = username;
        this.eventId = eventId;
        this.registrationDate = LocalDateTime.now();
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
}