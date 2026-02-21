package com.examly.springapp.service;

import com.examly.springapp.dto.AnalyticsDTO;
import com.examly.springapp.repository.EventRepository;
import com.examly.springapp.repository.EventRegistrationRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public AnalyticsDTO getAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        analytics.setTotalEvents(eventRepository.count());
        analytics.setTotalRegistrations(eventRegistrationRepository.count());
        analytics.setTotalUsers(userRepository.count());
        analytics.setMostPopularEvent("Sample Event");
        analytics.setAverageRegistrationsPerEvent(5.0);
        return analytics;
    }
}