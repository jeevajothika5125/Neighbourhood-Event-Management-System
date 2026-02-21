package com.examly.springapp.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "privacy_settings")
public class PrivacySetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Boolean profileVisibility = true;

    @Column(nullable = false)
    private Boolean emailVisibility = false;

    @Column(nullable = false)
    private Boolean phoneVisibility = false;

    @Column(nullable = false)
    private Boolean locationVisibility = false;

    @Column(nullable = false)
    private Boolean interestsVisibility = true;

    @Column(nullable = false)
    private Boolean socialLinksVisibility = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getProfileVisibility() { return profileVisibility; }
    public void setProfileVisibility(Boolean profileVisibility) { this.profileVisibility = profileVisibility; }

    public Boolean getEmailVisibility() { return emailVisibility; }
    public void setEmailVisibility(Boolean emailVisibility) { this.emailVisibility = emailVisibility; }

    public Boolean getPhoneVisibility() { return phoneVisibility; }
    public void setPhoneVisibility(Boolean phoneVisibility) { this.phoneVisibility = phoneVisibility; }

    public Boolean getLocationVisibility() { return locationVisibility; }
    public void setLocationVisibility(Boolean locationVisibility) { this.locationVisibility = locationVisibility; }

    public Boolean getInterestsVisibility() { return interestsVisibility; }
    public void setInterestsVisibility(Boolean interestsVisibility) { this.interestsVisibility = interestsVisibility; }

    public Boolean getSocialLinksVisibility() { return socialLinksVisibility; }
    public void setSocialLinksVisibility(Boolean socialLinksVisibility) { this.socialLinksVisibility = socialLinksVisibility; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}