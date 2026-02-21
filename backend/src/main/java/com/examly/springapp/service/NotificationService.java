package com.examly.springapp.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    public void sendEventNotification(String email, String eventTitle) {
        // Email notification logic
        System.out.println("Sending notification to " + email + " for event: " + eventTitle);
    }
    
    public void sendRegistrationConfirmation(String email, String eventTitle) {
        // Registration confirmation logic
        System.out.println("Sending registration confirmation to " + email + " for event: " + eventTitle);
    }
}