package com.examly.springapp.service;

import com.examly.springapp.model.EventRegistration;
import com.examly.springapp.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventRegistrationService {
    
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    
    public List<EventRegistration> getAllRegistrations() {
        return eventRegistrationRepository.findAll();
    }
    
    public EventRegistration saveRegistration(EventRegistration registration) {
        return eventRegistrationRepository.save(registration);
    }
}