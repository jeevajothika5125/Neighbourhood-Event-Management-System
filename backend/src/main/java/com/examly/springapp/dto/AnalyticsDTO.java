package com.examly.springapp.dto;

public class AnalyticsDTO {
    private Long totalEvents;
    private Long totalUsers;
    private Long totalRegistrations;
    private Long activeVenues;
    private String mostPopularEvent;
    private Double averageRegistrationsPerEvent;
    
    public AnalyticsDTO() {}
    
    public Long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Long totalEvents) { this.totalEvents = totalEvents; }
    
    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
    
    public Long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(Long totalRegistrations) { this.totalRegistrations = totalRegistrations; }
    
    public Long getActiveVenues() { return activeVenues; }
    public void setActiveVenues(Long activeVenues) { this.activeVenues = activeVenues; }
    
    public String getMostPopularEvent() { return mostPopularEvent; }
    public void setMostPopularEvent(String mostPopularEvent) { this.mostPopularEvent = mostPopularEvent; }
    
    public Double getAverageRegistrationsPerEvent() { return averageRegistrationsPerEvent; }
    public void setAverageRegistrationsPerEvent(Double averageRegistrationsPerEvent) { this.averageRegistrationsPerEvent = averageRegistrationsPerEvent; }
}