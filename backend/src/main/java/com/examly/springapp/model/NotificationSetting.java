package com.examly.springapp.model;

import javax.persistence.*;

@Entity
@Table(name = "notification_settings")
public class NotificationSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Boolean emailNotifications = true;

    @Column(nullable = false)
    private Boolean pushNotifications = true;

    @Column(nullable = false)
    private Boolean eventReminders = true;

    @Column(nullable = false)
    private Boolean eventUpdates = true;

    @Column(nullable = false)
    private Boolean registrationConfirmations = true;

    @Column(nullable = false)
    private Boolean marketingEmails = false;

    @Column(nullable = false)
    private Boolean smsNotifications = false;

    @Column(nullable = false)
    private Boolean weeklyDigest = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public Boolean getPushNotifications() { return pushNotifications; }
    public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public Boolean getEventReminders() { return eventReminders; }
    public void setEventReminders(Boolean eventReminders) { this.eventReminders = eventReminders; }

    public Boolean getEventUpdates() { return eventUpdates; }
    public void setEventUpdates(Boolean eventUpdates) { this.eventUpdates = eventUpdates; }

    public Boolean getRegistrationConfirmations() { return registrationConfirmations; }
    public void setRegistrationConfirmations(Boolean registrationConfirmations) { this.registrationConfirmations = registrationConfirmations; }

    public Boolean getMarketingEmails() { return marketingEmails; }
    public void setMarketingEmails(Boolean marketingEmails) { this.marketingEmails = marketingEmails; }

    public Boolean getSmsNotifications() { return smsNotifications; }
    public void setSmsNotifications(Boolean smsNotifications) { this.smsNotifications = smsNotifications; }

    public Boolean getWeeklyDigest() { return weeklyDigest; }
    public void setWeeklyDigest(Boolean weeklyDigest) { this.weeklyDigest = weeklyDigest; }
}